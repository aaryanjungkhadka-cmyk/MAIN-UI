import { randomUUID } from 'node:crypto';

// Pre-seeded active campaigns for Featured Partners horizontal banner carousel
const INITIAL_SPONSORS = [
  {
    id: 'sp-jiri-nutrition',
    sponsorName: 'Jiri Nutrition',
    category: 'supplements',
    heading: 'Building #1 Global Nepali Brand',
    description: '100% Nepali grass-fed whey, plant protein & mass gainer crafted for peak strength.',
    imageUrl: '/sponsors/jiri-nutrition.jpg',
    productImage: '/sponsors/jiri-products.jpg',
    bannerImage: '/sponsors/jiri-products.jpg',
    destinationUrl: 'https://jirinu.com/',
    ctaText: 'Shop Jiri',
    badge: '100% Nepali Brand',
    isActive: true,
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2027-12-31T23:59:59.000Z',
    impressions: 1240,
    clicks: 185,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sp-muscleblaze',
    sponsorName: 'MuscleBlaze Nepal',
    category: 'supplements',
    heading: 'Biozyme Whey Protein | #WheyForIndia & Nepal',
    description: 'Clinically tested 50% higher protein absorption & 33% faster recovery.',
    imageUrl: '/sponsors/muscleblaze-biozyme.webp',
    productImage: '/sponsors/muscleblaze-product.jpg',
    bannerImage: '/sponsors/muscleblaze-biozyme-hires.jpg',
    destinationUrl: 'https://www.muscleblaze.com/nepal',
    ctaText: 'Order Now',
    badge: 'Official Partner',
    isActive: true,
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2027-12-31T23:59:59.000Z',
    impressions: 2450,
    clicks: 310,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sp-nepal-organics',
    sponsorName: 'Nepal Organics',
    category: 'nutrition',
    heading: 'Roasted Himalayan Sattu & Seeds',
    description: 'High-fiber natural whole food nutrition crafted for daily strength.',
    imageUrl: '/sponsors/nepal-organics.png',
    productImage: '/sponsors/nepal-organics-sattu.jpg',
    destinationUrl: 'https://nepalorganics.np',
    ctaText: 'Explore',
    badge: 'Sponsored',
    isActive: true,
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2027-12-31T23:59:59.000Z',
    impressions: 940,
    clicks: 106,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sp-himalayan-whey',
    sponsorName: 'Himalayan Whey',
    category: 'supplements',
    heading: '100% Grass-Fed Whey Protein',
    description: '24g pure protein per scoop. Free delivery across Nepal with code KHANA15.',
    imageUrl: '/sponsors/himalayan-whey.png',
    productImage: '/sponsors/gold-standard-whey.jpg',
    destinationUrl: 'https://himalayanwhey.com.np',
    ctaText: 'Shop Now',
    badge: 'Sponsored',
    isActive: true,
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2027-12-31T23:59:59.000Z',
    impressions: 1640,
    clicks: 198,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sp-ktm-fitness',
    sponsorName: 'Kathmandu Fitness Hub',
    category: 'gym',
    heading: 'Strength & Recovery Lounge',
    description: 'Complimentary 3-day pass + personal body composition analysis.',
    imageUrl: '/sponsors/kathmandu-fitness.png',
    destinationUrl: 'https://ktmfitnesshub.com',
    ctaText: 'Claim Pass',
    badge: 'Partner Offer',
    isActive: true,
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2027-12-31T23:59:59.000Z',
    impressions: 1180,
    clicks: 134,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sp-optimum-nutrition',
    sponsorName: 'Optimum Nutrition',
    category: 'supplements',
    heading: 'Gold Standard 100% Whey',
    description: "World's #1 selling whey protein. 24g pure protein & 5.5g BCAAs per scoop.",
    imageUrl: '/sponsors/gold-standard-whey.jpg',
    productImage: '/sponsors/gold-standard-whey.jpg',
    destinationUrl: 'https://www.optimumnutrition.com',
    ctaText: 'Order Now',
    badge: 'Sponsored',
    isActive: true,
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2027-12-31T23:59:59.000Z',
    impressions: 2150,
    clicks: 285,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sp-muscleblaze-xxl',
    sponsorName: 'MuscleBlaze XXL',
    category: 'supplements',
    heading: 'Phir Se Zidd Kar | Mass Gainer XXL',
    description: 'High-protein muscle mass fuel & creatine monohydrate for peak strength.',
    imageUrl: '/sponsors/muscleblaze-phirse-zidd.jpg',
    productImage: '/sponsors/muscleblaze-phirse-zidd.jpg',
    destinationUrl: 'https://www.muscleblaze.com',
    ctaText: 'Explore Range',
    badge: 'Partner Offer',
    isActive: true,
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2027-12-31T23:59:59.000Z',
    impressions: 1790,
    clicks: 224,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sp-everest-gear',
    sponsorName: 'Everest Outdoor Gear',
    category: 'equipment',
    heading: 'Resistance Bands & Home Gym Kits',
    description: 'Compact fitness essentials for high-altitude training and home workouts.',
    imageUrl: '/sponsors/everest-gear.png',
    destinationUrl: 'https://everestgear.com.np',
    ctaText: 'Shop Gear',
    badge: 'Partner Offer',
    isActive: true,
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2027-12-31T23:59:59.000Z',
    impressions: 710,
    clicks: 78,
    createdAt: new Date().toISOString()
  }
];

class SponsorService {
  constructor() {
    this.sponsors = new Map();
    INITIAL_SPONSORS.forEach((s) => this.sponsors.set(s.id, { ...s }));
  }

  // Get active sponsors for public display on the dashboard
  getActiveSponsors({ category, limit = 6 } = {}) {
    const now = new Date();
    let list = Array.from(this.sponsors.values()).filter((s) => {
      if (!s.isActive) return false;
      if (s.startDate && new Date(s.startDate) > now) return false;
      if (s.endDate && new Date(s.endDate) < now) return false;
      if (category && s.category !== category) return false;
      return true;
    });

    if (limit && Number(limit) > 0) {
      list = list.slice(0, Number(limit));
    }
    return list;
  }

  getAllSponsors() {
    return Array.from(this.sponsors.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getSponsorById(id) {
    return this.sponsors.get(id) || null;
  }

  createSponsor(data) {
    const id = data.id || `sp-${randomUUID().slice(0, 8)}`;
    const newSponsor = {
      id,
      sponsorName: data.sponsorName || 'Partner Sponsor',
      category: data.category || 'nutrition',
      heading: data.heading || 'Featured Partner',
      description: data.description || '',
      imageUrl: data.imageUrl || '/sponsors/gold-standard-whey.jpg',
      destinationUrl: data.destinationUrl || 'https://khanalens.com',
      ctaText: data.ctaText || 'Explore',
      badge: data.badge || 'Sponsored',
      isActive: data.isActive !== false,
      startDate: data.startDate || new Date().toISOString(),
      endDate: data.endDate || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString()
    };
    this.sponsors.set(id, newSponsor);
    return newSponsor;
  }

  updateSponsor(id, updates) {
    const current = this.sponsors.get(id);
    if (!current) return null;
    const updated = {
      ...current,
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };
    this.sponsors.set(id, updated);
    return updated;
  }

  deleteSponsor(id) {
    return this.sponsors.delete(id);
  }

  trackImpression(id) {
    const s = this.sponsors.get(id);
    if (s) {
      s.impressions = (s.impressions || 0) + 1;
      return s.impressions;
    }
    return 0;
  }

  trackClick(id) {
    const s = this.sponsors.get(id);
    if (s) {
      s.clicks = (s.clicks || 0) + 1;
      return { clicks: s.clicks, destinationUrl: s.destinationUrl };
    }
    return null;
  }
}

export const sponsorService = new SponsorService();
