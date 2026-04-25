// Storage.js - Shared localStorage functions
// Used by both index.html and admin.html

const STORAGE_KEYS = {
  PROJECTS: 'sandy:projects',
  SETTINGS: 'sandy:settings',
  AUTH: 'sandy:auth'
};

// Load projects from localStorage
function loadProjects() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return stored ? JSON.parse(stored) : getDefaultProjects();
  } catch (e) {
    console.error('Error loading projects:', e);
    return getDefaultProjects();
  }
}

// Save projects to localStorage
function saveProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return true;
  } catch (e) {
    console.error('Error saving projects:', e);
    return false;
  }
}

// Load settings from localStorage
function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : getDefaultSettings();
  } catch (e) {
    console.error('Error loading settings:', e);
    return getDefaultSettings();
  }
}

// Save settings to localStorage
function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Error saving settings:', e);
    return false;
  }
}

// Check authentication
function checkAuth() {
  try {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  } catch (e) {
    return false;
  }
}

// Save authentication
function saveAuth(status) {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH, String(status));
    return true;
  } catch (e) {
    return false;
  }
}

// Default projects (seed data)
function getDefaultProjects() {
  return [
    {
      id: 'instagram-growth-campaign',
      title: 'Instagram Growth Campaign',
      category: 'Social Media',
      tagline: 'Full content strategy & visual system for a UAE lifestyle brand',
      description: `Built a complete Instagram visual identity system from the ground up. From content pillars to post templates, story designs, and highlight covers, every touchpoint was considered to create a cohesive, premium look that grew the account from 12K to 80K followers in 6 months.

The system was modular and scalable — handed off to the in-house social team with full documentation so they could continue producing on-brand content daily without ever losing consistency.`,
      client: 'Luxe Living UAE',
      year: '2024',
      coverImage: 'images/instagram-campaign.jpg',
      images: [
        'images/instagram-1.jpg',
        'images/instagram-2.jpg',
        'images/instagram-3.jpg'
      ],
      videoUrl: '',
      tags: ['Instagram', 'Content Strategy', 'Visual Design', 'Social Media', 'Branding']
    },
    {
      id: 'luxury-tower-dubai',
      title: 'Luxury Tower — Dubai',
      category: 'Real Estate',
      tagline: 'Complete digital campaign and print collateral for a luxury off-plan tower',
      description: `Full real estate marketing package for a luxury off-plan tower launch in Dubai Marina. The project included a 32-page sales brochure, digital ad creatives for Instagram and Google, a 30-day social media launch campaign, and animated property walkthrough content.

The campaign drove 4,200+ qualified leads in the first week and helped sell 60% of inventory in the first month.`,
      client: 'Emaar Properties',
      year: '2024',
      coverImage: 'images/luxury-tower.jpg',
      images: [
        'images/luxury-tower-1.jpg',
        'images/luxury-tower-2.jpg',
        'images/luxury-tower-3.jpg'
      ],
      videoUrl: '',
      tags: ['Real Estate', 'Dubai', 'Brochure Design', 'Social Ads', 'Motion']
    },
    {
      id: 'real-estate-landing',
      title: 'Real Estate Landing Page',
      category: 'Web Design',
      tagline: 'High-converting lead-generation page for a Dubai property launch',
      description: `A high-converting landing page built for a luxury off-plan property registration campaign. Achieved a 34% conversion rate by integrating social proof above the fold, a sticky CTA bar, WhatsApp integration, and a multi-step form that reduced friction by 62%.

The lead form connects directly to HubSpot, triggering automated WhatsApp confirmation messages, email sequences, and sales team notifications.`,
      client: 'Nakheel Developers',
      year: '2024',
      coverImage: 'images/landing-page.jpg',
      images: [
        'images/landing-page-1.jpg',
        'images/landing-page-2.jpg',
        'images/landing-page-3.jpg'
      ],
      videoUrl: '',
      tags: ['Web Design', 'Landing Page', 'Webflow', 'HubSpot', 'CRM', 'Real Estate']
    },
    {
      id: 'product-launch-reel',
      title: 'Product Launch Reel',
      category: 'Reels & Video',
      tagline: 'Multi-platform video campaign for a luxury skincare brand launch',
      description: `Short-form video campaign for a luxury skincare brand launching across the UAE and KSA. The project included a 60-second hero brand film, 8 Instagram reels, 6 TikTok-native videos, and YouTube pre-roll ads.

All content was built from a unified motion language — consistent timing, transitions, and typography animation that made every piece instantly recognisable as the same brand.`,
      client: 'GLOW Skincare',
      year: '2024',
      coverImage: 'images/product-reel.jpg',
      images: [
        'images/product-reel-1.jpg',
        'images/product-reel-2.jpg'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      tags: ['Reels', 'Video', 'Motion Design', 'TikTok', 'Instagram', 'Advertising']
    }
  ];
}

// Default settings
function getDefaultSettings() {
  return {
    name: 'Sandy',
    title: 'Creative Digital Designer',
    location: 'Dubai, UAE',
    badge: 'Open to new projects',
    heroBio: `I design <strong>social media content, reels, real estate visuals,</strong> and <strong>web experiences</strong> that make brands impossible to scroll past. Based in Dubai, working globally.`,
    aboutBio: `I'm a <strong>Creative Digital Designer</strong> based in Dubai with a passion for building visual experiences that stop the scroll and drive real results.<br><br>From <strong>social media content</strong> and <strong>short-form reels</strong> to <strong>real estate campaigns</strong> and <strong>landing pages</strong> — I combine design thinking with deep platform knowledge to produce work that performs.`,
    heroPhoto: 'images/hero-profile.jpg',
    aboutPhoto: 'images/about-portrait.jpg',
    email: 'hello@sandy.ae',
    whatsapp: '971500000000',
    behance: 'https://behance.net/sandy',
    instagram: 'https://instagram.com/sandy',
    contactSub: "Whether it's a single reel or a full brand — I'd love to hear what you're building."
  };
}

// Category icons
const categoryIcons = {
  'Social Media': '📱',
  'Reels & Video': '🎬',
  'Real Estate': '🏠',
  'Web Design': '🌐',
  'Branding': '✦'
};

// Utility: Escape HTML
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Utility: Generate unique ID
function generateId(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}
