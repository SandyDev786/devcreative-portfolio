const CMS_CONFIG = {
    apiUrl: 'cms-api.php'
};

function cleanCMSAssetValue(value) {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return '';
    return trimmed;
}

function cleanCMSData(data) {
    const homeData = data && typeof data.homeData === 'object' && !Array.isArray(data.homeData) ? data.homeData : {};
    const projects = Array.isArray(data && data.projects) ? data.projects : [];

    return {
        homeData: {
            ...homeData,
            heroBackground: cleanCMSAssetValue(homeData.heroBackground),
            aboutPhoto: cleanCMSAssetValue(homeData.aboutPhoto)
        },
        projects: projects.map(project => {
            const cleanProject = { ...project };
            cleanProject.coverImage = cleanCMSAssetValue(cleanProject.coverImage);
            cleanProject.thumbnail = cleanCMSAssetValue(cleanProject.thumbnail);
            cleanProject.images = Array.isArray(cleanProject.images)
                ? cleanProject.images.map(cleanCMSAssetValue).filter(Boolean)
                : [];
            return cleanProject;
        })
    };
}

const CMSStore = {
    serverAvailable: null,

    async request(action, options = {}) {
        const url = `${CMS_CONFIG.apiUrl}?action=${encodeURIComponent(action)}`;
        const response = await fetch(url, {
            credentials: 'same-origin',
            ...options
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.ok === false) {
            const error = new Error(data.error || `CMS request failed: ${response.status}`);
            error.status = response.status;
            throw error;
        }

        this.serverAvailable = true;
        return data;
    },

    async loadAll() {
        try {
            const data = await this.request('get');
            const cleanData = cleanCMSData(data);
            localStorage.setItem('portfolioHomeData', JSON.stringify(cleanData.homeData));
            localStorage.setItem('portfolioProjects', JSON.stringify(cleanData.projects));
            return cleanData;
        } catch (error) {
            this.serverAvailable = false;
            const cleanData = cleanCMSData({
                homeData: JSON.parse(localStorage.getItem('portfolioHomeData') || '{}'),
                projects: JSON.parse(localStorage.getItem('portfolioProjects') || '[]')
            });
            localStorage.setItem('portfolioHomeData', JSON.stringify(cleanData.homeData));
            localStorage.setItem('portfolioProjects', JSON.stringify(cleanData.projects));
            return cleanData;
        }
    },

    async getHomeData() {
        const data = await this.loadAll();
        return data.homeData;
    },

    async getProjects() {
        const data = await this.loadAll();
        return data.projects;
    },

    async saveHomeData(homeData) {
        const cleanData = cleanCMSData({
            homeData,
            projects: JSON.parse(localStorage.getItem('portfolioProjects') || '[]')
        });
        localStorage.setItem('portfolioHomeData', JSON.stringify(cleanData.homeData));
        return this.saveAll({
            homeData: cleanData.homeData,
            projects: cleanData.projects
        });
    },

    async saveProjects(projects) {
        const cleanData = cleanCMSData({
            homeData: JSON.parse(localStorage.getItem('portfolioHomeData') || '{}'),
            projects
        });
        localStorage.setItem('portfolioProjects', JSON.stringify(cleanData.projects));
        return this.saveAll({
            homeData: cleanData.homeData,
            projects: cleanData.projects
        });
    },

    async saveAll(payload) {
        try {
            const cleanPayload = cleanCMSData(payload);
            await this.request('save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cleanPayload)
            });
        } catch (error) {
            if (error.status) {
                throw error;
            }
            this.serverAvailable = false;
            console.warn('Server save unavailable, using browser storage only:', error.message);
        }
    },

    async login(username, password) {
        return this.request('login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
    }
};
