const CMS_CONFIG = {
    apiUrl: 'cms-api.php'
};

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
            localStorage.setItem('portfolioHomeData', JSON.stringify(data.homeData || {}));
            localStorage.setItem('portfolioProjects', JSON.stringify(data.projects || []));
            return {
                homeData: data.homeData || {},
                projects: data.projects || []
            };
        } catch (error) {
            this.serverAvailable = false;
            return {
                homeData: JSON.parse(localStorage.getItem('portfolioHomeData') || '{}'),
                projects: JSON.parse(localStorage.getItem('portfolioProjects') || '[]')
            };
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
        localStorage.setItem('portfolioHomeData', JSON.stringify(homeData));
        return this.saveAll({
            homeData,
            projects: JSON.parse(localStorage.getItem('portfolioProjects') || '[]')
        });
    },

    async saveProjects(projects) {
        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
        return this.saveAll({
            homeData: JSON.parse(localStorage.getItem('portfolioHomeData') || '{}'),
            projects
        });
    },

    async saveAll(payload) {
        try {
            await this.request('save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
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
