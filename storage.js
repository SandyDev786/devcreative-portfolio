// Portfolio Projects Data
// Add your projects here - they will automatically appear on the website

const projects = [
  {
    id: 'instagram-growth-campaign',
    title: 'Instagram Growth Campaign',
    category: 'Social Media',
    tagline: 'Full content strategy & visual system for a UAE lifestyle brand',
    description: `Built a complete Instagram visual identity system from the ground up. From content pillars to post templates, story designs, and highlight covers, every touchpoint was considered to create a cohesive, premium look that grew the account from 12K to 80K followers in 6 months.

The system was modular and scalable — handed off to the in-house social team with full documentation so they could continue producing on-brand content daily without ever losing consistency.`,
    client: 'Luxe Living UAE',
    year: '2024',
    coverImage: 'images/instagram-campaign-cover.jpg',
    images: [
      'images/instagram-campaign-1.jpg',
      'images/instagram-campaign-2.jpg',
      'images/instagram-campaign-3.jpg'
    ],
    videoUrl: '', // Optional: YouTube or Vimeo URL
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
    coverImage: 'images/luxury-tower-cover.jpg',
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
    coverImage: 'images/landing-page-cover.jpg',
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
    coverImage: 'images/product-reel-cover.jpg',
    images: [
      'images/product-reel-1.jpg',
      'images/product-reel-2.jpg'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Example YouTube URL
    tags: ['Reels', 'Video', 'Motion Design', 'TikTok', 'Instagram', 'Advertising']
  }
];

// Category icons for project cards
const categoryIcons = {
  'Social Media': '📱',
  'Reels & Video': '🎬',
  'Real Estate': '🏠',
  'Web Design': '🌐',
  'Branding': '✦'
};

// Export for use in index.html
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { projects, categoryIcons };
}
