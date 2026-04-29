// GitHub API Configuration
// This allows uploading images directly to your GitHub repository

const GITHUB_CONFIG = {
    // YOUR GITHUB SETTINGS - UPDATE THESE!
    username: 'SandyDev786',              // Your GitHub username
    repo: 'devcreative-portfolio',        // Your repository name
    branch: 'main',                       // Usually 'main' or 'master'
    token: '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',           // Your actual token
    
    // Image base URL (for loading images on website)
    // GitHub raw content URL
    imageBaseURL: 'https://raw.githubusercontent.com/SandyDev786/devcreative-portfolio/main/'
};

// GitHub API Upload Function
async function uploadToGitHub(file, path) {
    try {
        // Show upload progress
        console.log(`Uploading ${file.name} to GitHub...`);
        
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
                console.log('File exists, will update...');
            }
        } catch (e) {
            console.log('New file, will create...');
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
                message: `Upload ${path} via CMS`,
                content: content,
                branch: GITHUB_CONFIG.branch,
                ...(sha && { sha }) // Include SHA if updating existing file
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API error: ${response.status} - ${errorData.message}`);
        }

        const result = await response.json();
        
        // Return the public URL that will work on Vercel and GitHub Pages
        const publicURL = GITHUB_CONFIG.imageBaseURL + path;
        console.log(`✅ Uploaded successfully: ${publicURL}`);
        
        return publicURL;
    } catch (error) {
        console.error('Error uploading to GitHub:', error);
        alert('⚠️ Upload failed: ' + error.message + '\n\nCheck:\n1. GitHub token is correct\n2. Token has "repo" permission\n3. Repository name is correct');
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
function generateFileName(originalName) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop().toLowerCase();
    const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase();
    const baseName = cleanName.replace(`.${extension}`, '');
    return `${baseName}-${timestamp}-${random}.${extension}`;
}

// Upload Cover Image to GitHub
async function uploadCoverImageToGitHub(file, projectId) {
    const fileName = generateFileName(file.name);
    const path = `images/projects/${projectId}/${fileName}`;
    return await uploadToGitHub(file, path);
}

// Upload Gallery Image to GitHub
async function uploadGalleryImageToGitHub(file, projectId, index) {
    const fileName = generateFileName(file.name);
    const path = `images/projects/${projectId}/gallery-${index}-${fileName}`;
    return await uploadToGitHub(file, path);
}

// Upload Hero Background to GitHub
async function uploadHeroBackgroundToGitHub(file) {
    const fileName = generateFileName(file.name);
    const path = `images/hero/${fileName}`;
    return await uploadToGitHub(file, path);
}

// Upload About Photo to GitHub
async function uploadAboutPhotoToGitHub(file) {
    const fileName = generateFileName(file.name);
    const path = `images/about/${fileName}`;
    return await uploadToGitHub(file, path);
}

// Delete file from GitHub (optional - for cleanup)
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
                message: `Delete ${path} via CMS`,
                sha: fileData.sha,
                branch: GITHUB_CONFIG.branch
            })
        });
        
        console.log(`🗑️ Deleted: ${path}`);
    } catch (error) {
        console.error('Error deleting from GitHub:', error);
    }
}

// Test GitHub connection
async function testGitHubConnection() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}`, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            console.log('✅ GitHub connection successful!');
            return true;
        } else {
            console.error('❌ GitHub connection failed:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ GitHub connection error:', error);
        return false;
    }
}

// Initialize and test on load
if (typeof GITHUB_CONFIG.token !== 'undefined' && GITHUB_CONFIG.token !== 'YOUR_GITHUB_TOKEN') {
    console.log('🔧 GitHub upload enabled');
    testGitHubConnection();
} else {
    console.warn('⚠️ GitHub token not configured. Set your token in github-upload-config.js');
}
