// GitHub API Configuration
// This allows uploading images directly to your GitHub repository

const GITHUB_CONFIG = {
    // YOUR GITHUB SETTINGS - UPDATE THESE!
    username: 'YOUR_GITHUB_USERNAME',  // e.g., 'johnsmith'
    repo: 'YOUR_REPO_NAME',            // e.g., 'portfolio'
    branch: 'main',                     // Usually 'main' or 'master'
    token: 'YOUR_GITHUB_TOKEN',        // Generate at: https://github.com/settings/tokens
};

// GitHub API Upload Function
async function uploadToGitHub(file, path) {
    try {
        // Convert file to base64
        const base64Content = await fileToBase64(file);
        const content = base64Content.split(',')[1]; // Remove data:image/... prefix

        // GitHub API endpoint
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${path}`;

        // Check if file already exists
        let sha = null;
        try {
            const checkResponse = await fetch(url, {
                headers: {
                    'Authorization': `token ${GITHUB_CONFIG.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (checkResponse.ok) {
                const existingFile = await checkResponse.json();
                sha = existingFile.sha;
            }
        } catch (e) {
            // File doesn't exist, that's fine
        }

        // Upload or update file
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Upload ${path}`,
                content: content,
                branch: GITHUB_CONFIG.branch,
                ...(sha && { sha }) // Include SHA if updating existing file
            })
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const result = await response.json();
        
        // Return the public URL
        return `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${path}`;
    } catch (error) {
        console.error('Error uploading to GitHub:', error);
        throw error;
    }
}

// Helper: Convert File to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Generate unique filename
function generateFileName(originalName, projectId) {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase();
    return `${timestamp}-${cleanName}`;
}

// Upload Cover Image
async function uploadCoverImage(file, projectId) {
    const fileName = generateFileName(file.name, projectId);
    const path = `images/projects/${projectId}/cover-${fileName}`;
    return await uploadToGitHub(file, path);
}

// Upload Gallery Image
async function uploadGalleryImage(file, projectId, index) {
    const fileName = generateFileName(file.name, projectId);
    const path = `images/projects/${projectId}/gallery-${index}-${fileName}`;
    return await uploadToGitHub(file, path);
}

// Upload Hero Background
async function uploadHeroBackground(file) {
    const fileName = generateFileName(file.name, 'hero');
    const path = `images/hero/${fileName}`;
    return await uploadToGitHub(file, path);
}

// Upload About Photo
async function uploadAboutPhoto(file) {
    const fileName = generateFileName(file.name, 'about');
    const path = `images/about/${fileName}`;
    return await uploadToGitHub(file, path);
}

// Delete file from GitHub
async function deleteFromGitHub(path) {
    try {
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${path}`;
        
        // Get file SHA
        const getResponse = await fetch(url, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!getResponse.ok) {
            return; // File doesn't exist
        }

        const fileData = await getResponse.json();

        // Delete file
        await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Delete ${path}`,
                sha: fileData.sha,
                branch: GITHUB_CONFIG.branch
            })
        });
    } catch (error) {
        console.error('Error deleting from GitHub:', error);
    }
}
