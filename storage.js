// Storage.js - localStorage functions for Sandy Portfolio CMS
// Shared between index.html and admin.html

// Load projects from localStorage
function loadProjects() {
  const stored = localStorage.getItem('sandy:projects');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing projects:', e);
      return [];
    }
  }
  return [];
}

// Save projects to localStorage
function saveProjects(projects) {
  localStorage.setItem('sandy:projects', JSON.stringify(projects));
}

// Load settings from localStorage
function loadSettings() {
  const stored = localStorage.getItem('sandy:settings');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing settings:', e);
      return getDefaultSettings();
    }
  }
  return getDefaultSettings();
}

// For admin panel compatibility
function loadSettingsData() {
  return loadSettings();
}

// Save settings to localStorage
function saveSettings(settings) {
  localStorage.setItem('sandy:settings', JSON.stringify(settings));
}

// For admin panel compatibility
function saveSettingsData(settings) {
  saveSettings(settings);
}

// Default settings
function getDefaultSettings() {
  return {
    name: 'Sandy',
    title: 'Creative Digital Designer',
    location: 'Dubai, UAE',
    badge: 'Open to new projects',
    heroBio: 'I design <strong>social media content, reels, real estate visuals,</strong> and <strong>web experiences</strong> that make brands impossible to scroll past. Based in Dubai, working globally.',
    aboutBio: "I'm a <strong>Creative Digital Designer</strong> based in Dubai with a passion for building visual experiences that stop the scroll and drive real results.<br><br>From <strong>social media content</strong> and <strong>short-form reels</strong> to <strong>real estate campaigns</strong> and <strong>landing pages</strong> — I combine design thinking with deep platform knowledge to produce work that performs.",
    heroPhoto: '',
    aboutPhoto: '',
    email: 'hello@sandy.ae',
    whatsapp: '971500000000',
    behance: 'https://behance.net',
    instagram: 'https://instagram.com',
    contactSub: "Whether it's a single reel or a full brand — I'd love to hear what you're building."
  };
}
