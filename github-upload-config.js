// Server upload adapter.
// The dashboard keeps these function names for compatibility with the old GitHub uploader.

const GITHUB_CONFIG = {
    token: 'SERVER_UPLOADS',
    imageBaseURL: ''
};

async function uploadFileToServer(file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', options.type || 'projects');
    formData.append('projectId', options.projectId || 'project');
    formData.append('prefix', options.prefix || 'file');

    const response = await fetch('cms-api.php?action=upload', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.ok === false) {
        const error = new Error(data.error || `Upload failed: ${response.status}`);
        error.status = response.status;
        throw error;
    }

    return data.url;
}

async function uploadCoverImageToGitHub(file, projectId) {
    return uploadFileToServer(file, {
        type: 'projects',
        projectId,
        prefix: 'cover'
    });
}

async function uploadGalleryImageToGitHub(file, projectId, index) {
    return uploadFileToServer(file, {
        type: 'projects',
        projectId,
        prefix: `gallery-${index}`
    });
}

async function uploadHeroBackgroundToGitHub(file) {
    return uploadFileToServer(file, {
        type: 'hero',
        prefix: 'hero'
    });
}

async function uploadAboutPhotoToGitHub(file) {
    return uploadFileToServer(file, {
        type: 'about',
        prefix: 'about'
    });
}

console.log('Server upload adapter enabled');
