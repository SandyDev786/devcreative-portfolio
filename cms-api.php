<?php
declare(strict_types=1);

session_start();

header('Content-Type: application/json; charset=utf-8');

const CMS_USERNAME = 'admin';
const CMS_PASSWORD = 'admin123';
const CMS_DATA_DIR = __DIR__ . '/data';
const CMS_DATA_FILE = CMS_DATA_DIR . '/cms-data.json';
const CMS_UPLOAD_DIR = __DIR__ . '/images';

function respond(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

function require_admin(): void
{
    if (empty($_SESSION['cms_logged_in'])) {
        respond(['ok' => false, 'error' => 'Not authenticated'], 401);
    }
}

function ensure_dir(string $dir): void
{
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        respond(['ok' => false, 'error' => 'Unable to create directory'], 500);
    }
}

function read_cms_data(): array
{
    if (!is_file(CMS_DATA_FILE)) {
        return ['homeData' => new stdClass(), 'projects' => []];
    }

    $json = file_get_contents(CMS_DATA_FILE);
    $data = json_decode($json ?: '', true);

    if (!is_array($data)) {
        return ['homeData' => new stdClass(), 'projects' => []];
    }

    return [
        'homeData' => $data['homeData'] ?? new stdClass(),
        'projects' => is_array($data['projects'] ?? null) ? $data['projects'] : []
    ];
}

function write_cms_data(array $data): void
{
    ensure_dir(CMS_DATA_DIR);

    $payload = [
        'homeData' => is_array($data['homeData'] ?? null) ? $data['homeData'] : new stdClass(),
        'projects' => is_array($data['projects'] ?? null) ? $data['projects'] : []
    ];

    $json = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false || file_put_contents(CMS_DATA_FILE, $json, LOCK_EX) === false) {
        respond(['ok' => false, 'error' => 'Unable to save CMS data'], 500);
    }
}

function clean_segment(string $value): string
{
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9_-]+/', '-', $value) ?? '';
    $value = trim($value, '-');
    return $value !== '' ? $value : 'item';
}

function handle_upload(): void
{
    require_admin();

    if (empty($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
        respond(['ok' => false, 'error' => 'No file uploaded'], 400);
    }

    $file = $_FILES['file'];
    if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
        respond(['ok' => false, 'error' => 'Upload failed'], 400);
    }

    $maxBytes = 20 * 1024 * 1024;
    if (($file['size'] ?? 0) > $maxBytes) {
        respond(['ok' => false, 'error' => 'File is larger than 20MB'], 400);
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    $allowed = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'image/webp' => 'webp',
        'image/svg+xml' => 'svg',
        'video/mp4' => 'mp4',
        'video/webm' => 'webm',
        'video/quicktime' => 'mov'
    ];

    if (!isset($allowed[$mime])) {
        respond(['ok' => false, 'error' => 'Unsupported file type'], 400);
    }

    $type = clean_segment($_POST['type'] ?? 'projects');
    $projectId = clean_segment($_POST['projectId'] ?? 'project');
    $prefix = clean_segment($_POST['prefix'] ?? 'file');

    if ($type === 'hero') {
        $relativeDir = 'images/hero';
    } elseif ($type === 'about') {
        $relativeDir = 'images/about';
    } else {
        $relativeDir = 'images/projects/' . $projectId;
    }

    $targetDir = __DIR__ . '/' . $relativeDir;
    ensure_dir($targetDir);

    $original = pathinfo((string) $file['name'], PATHINFO_FILENAME);
    $baseName = clean_segment($original);
    $extension = $allowed[$mime];
    $filename = sprintf('%s-%s-%s.%s', $prefix, $baseName, date('YmdHis'), $extension);
    $target = $targetDir . '/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $target)) {
        respond(['ok' => false, 'error' => 'Unable to store uploaded file'], 500);
    }

    respond([
        'ok' => true,
        'url' => $relativeDir . '/' . $filename
    ]);
}

$action = $_GET['action'] ?? 'get';

if ($action === 'get') {
    respond(['ok' => true] + read_cms_data());
}

if ($action === 'login') {
    $input = json_decode(file_get_contents('php://input') ?: '{}', true);
    if (($input['username'] ?? '') === CMS_USERNAME && ($input['password'] ?? '') === CMS_PASSWORD) {
        $_SESSION['cms_logged_in'] = true;
        respond(['ok' => true]);
    }
    respond(['ok' => false, 'error' => 'Invalid username or password'], 401);
}

if ($action === 'save') {
    require_admin();
    $input = json_decode(file_get_contents('php://input') ?: '{}', true);
    if (!is_array($input)) {
        respond(['ok' => false, 'error' => 'Invalid JSON'], 400);
    }
    write_cms_data($input);
    respond(['ok' => true]);
}

if ($action === 'upload') {
    handle_upload();
}

respond(['ok' => false, 'error' => 'Unknown action'], 404);
