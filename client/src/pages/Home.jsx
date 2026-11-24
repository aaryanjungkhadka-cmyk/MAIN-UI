import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Camera,
  ChevronRight,
  Droplet,
  Dumbbell,
  ExternalLink,
  UserRound,
  UtensilsCrossed,
  Wheat,
} from 'lucide-react';
import mealImage from '../assets/images/HealthyFood-2.jpg';
import khanaLensLogo from '../assets/images/KhanaLens.png';
import { useAuth } from '../hooks/useAuth';
import { useNutrition } from '../hooks/useNutrition';
import {
  getProfileApi,
  getProgressApi,
  saveProfileApi,
  getSponsorsApi,
  trackSponsorClickApi
} from '../services/api';
import { Avatar } from '../components/Avatar';
import { BottomNav } from '../components/BottomNav';
import AppHeader from '../components/AppHeader';
import { calculateStreak } from '../data/streak';

const defaultSummary = {
  calories: 0,
  calorieGoal: 2000,
  protein: 0,
  proteinGoal: 120,
  carbs: 0,
  carbsGoal: 250,
  fat: 0,
  fatGoal: 70
};

// Fallback partner banners if API is temporarily unavailable
const fallbackSponsors = [
  {
    id: 'sp-jiri-nutrition',
    sponsorName: 'Jiri Nutrition',
    category: 'supplements',
    heading: 'Building #1 Global Nepali Brand',
    description: '100% Nepali grass-fed whey, plant protein & mass gainer crafted for peak strength.',
    imageUrl: '/sponsors/jiri-nutrition.jpg',
    productImage: '/sponsors/jiri-products.jpg',
    bannerImage: '/sponsors/jiri-ad-banner.jpg',
    destinationUrl: 'https://jirinu.com/',
    ctaText: 'Shop Jiri',
    badge: '100% Nepali Brand'
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
    badge: 'Official Partner'
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
    badge: 'Sponsored'
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
    badge: 'Partner Offer'
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
    badge: 'Sponsored'
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
    badge: 'Sponsored'
  },
  {
    id: 'sp-muscleblaze-xxl',
    sponsorName: 'MuscleBlaze',
    category: 'supplements',
    heading: 'Phir Se Zidd Kar | Mass Gainer XXL',
    description: 'High-protein muscle mass fuel & creatine monohydrate for peak strength.',
    imageUrl: '/sponsors/muscleblaze-phirse-zidd.jpg',
    destinationUrl: 'https://www.muscleblaze.com',
    ctaText: 'Explore Range',
    badge: 'Partner Offer'
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
    badge: 'Partner Offer'
  }
];

const homeCss = `
@property --progress {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}

@keyframes pulse-soft {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}

.dashboard-viewport {
  position: relative;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  color: #1F4D33;
  font-family: 'Google Sans Local', 'Google Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
  overflow-y: visible;
  box-sizing: border-box;
}
.dashboard-viewport * { box-sizing: border-box; }

.dashboard-page {
  position: relative;
  width: 100%;
  max-width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  padding: 0 16px max(112px, calc(74px + env(safe-area-inset-bottom, 16px) + 24px));
  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
}

.dashboard-header h1 {
  margin: 0 0 2px;
  color: #1F4D33;
  font-size: 21px;
  font-weight: 750;
  letter-spacing: -0.5px;
}
.dashboard-header p {
  margin: 0;
  color: rgba(31, 77, 51, 0.72);
  font-size: 12.5px;
}

/* SMART FOOD SCANNER CARD */
.scan-hero,
.smart-food-scanner {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 182px;
  min-height: 176px;
  margin: 14px 0 6px;
  padding: 0;
  border-radius: 24px;
  text-decoration: none;
  color: #FBF7EE;
  overflow: hidden;
  isolation: isolate;
  background: #254D37;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
}
.scan-hero:active,
.smart-food-scanner:active {
  transform: scale(0.985);
}
.scan-hero-video,
.smart-food-scanner video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 80% center;
  pointer-events: none;
  z-index: 0;
}
.scan-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(16, 42, 28, 0.9) 0%,
    rgba(20, 52, 35, 0.72) 42%,
    rgba(25, 66, 44, 0.28) 64%,
    rgba(25, 66, 44, 0) 84%
  );
  pointer-events: none;
  z-index: 1;
}
.scan-hero-copy,
.scanner-content {
  position: relative;
  z-index: 2;
  padding: 20px 22px;
  max-width: 62%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;
}
.scan-hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 5px;
}
.scan-camera-pill {
  width: 26px;
  height: 26px;
  min-width: 26px;
  min-height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: #FFFFFF;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  padding: 0 !important;
  margin: 0 !important;
  line-height: 0 !important;
  box-sizing: border-box !important;
}
.scan-camera-pill svg {
  display: block !important;
  width: 14px !important;
  height: 14px !important;
  margin: 0 !important;
  padding: 0 !important;
  flex-shrink: 0 !important;
}
.scan-hero small {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  color: #D6EFE0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}
.scan-hero strong {
  display: block;
  font-size: 20px;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.2;
  margin: 0 0 4px;
  letter-spacing: -0.3px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}
.scan-hero span.scan-hero-desc {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: rgba(251, 247, 238, 0.95);
  line-height: 1.3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* SECTION HEADINGS */
.dashboard-section {
  margin-top: 16px;
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.section-heading h2 {
  margin: 0;
  color: #1F4D33;
  font-size: 15px;
  font-weight: 750;
  letter-spacing: -0.2px;
}
.section-heading button,
.section-heading a,
.section-view-all {
  background: none;
  border: 0;
  color: #3FA47A;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  padding: 0;
}
.section-heading button:hover,
.section-heading a:hover {
  text-decoration: underline;
}

/* 1. TODAY'S SUMMARY - NORMAL, BIG, ALIGNED */
.dashboard-viewport .summary-card {
  padding: 26px 22px !important;
  border-radius: 28px !important;
  background: #FFFFFF !important;
  border: 1px solid rgba(31, 77, 51, 0.1) !important;
  box-shadow: 0 4px 20px rgba(31, 77, 51, 0.06), 0 1px 3px rgba(31, 77, 51, 0.04) !important;
  display: flex !important;
  align-items: center !important;
  gap: 22px !important;
  min-height: 254px !important;
  box-sizing: border-box !important;
  animation: none !important;
  transform: none !important;
  filter: none !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility !important;
}

.dashboard-viewport .summary-ring {
  width: 156px !important;
  height: 156px !important;
  min-width: 156px !important;
  max-width: 156px !important;
  flex: 0 0 156px !important;
  aspect-ratio: 1 / 1 !important;
  border-radius: 50% !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  display: grid !important;
  place-items: center !important;
  background: conic-gradient(
    #3FA47A 0deg,
    #3FA47A var(--progress, 0deg),
    rgba(31, 77, 51, 0.08) var(--progress, 0deg),
    rgba(31, 77, 51, 0.08) 360deg
  ) !important;
  box-shadow: none !important;
  transform: none !important;
  filter: none !important;
}

.dashboard-viewport .summary-ring-inner {
  width: 118px !important;
  height: 118px !important;
  min-width: 118px !important;
  aspect-ratio: 1 / 1 !important;
  border-radius: 50% !important;
  border: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  background: #FFFFFF !important;
  box-shadow: inset 0 0 0 1px rgba(31, 77, 51, 0.05) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  text-align: center !important;
  transform: none !important;
}

.dashboard-viewport .summary-ring strong {
  font-size: 25px !important;
  font-weight: 850 !important;
  color: #1F4D33 !important;
  line-height: 1.1 !important;
  letter-spacing: -0.6px !important;
  -webkit-font-smoothing: antialiased !important;
}

.dashboard-viewport .summary-ring span {
  font-size: 11.5px !important;
  font-weight: 600 !important;
  color: rgba(31, 77, 51, 0.65) !important;
  line-height: 1 !important;
  margin-top: 3px !important;
  -webkit-font-smoothing: antialiased !important;
}

.dashboard-viewport .summary-ring b {
  font-size: 14.5px !important;
  font-weight: 800 !important;
  color: #3FA47A !important;
  margin-top: 4px !important;
  -webkit-font-smoothing: antialiased !important;
}

.dashboard-viewport .summary-macro-list {
  flex: 1 1 auto !important;
  width: 100% !important;
  min-width: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 19px !important;
}

.dashboard-viewport .summary-macro-row {
  width: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 7px !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  background: none !important;
  box-shadow: none !important;
}

.dashboard-viewport .summary-macro-header {
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}

.dashboard-viewport .summary-macro-title {
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
}

.dashboard-viewport .summary-macro-icon {
  width: 28px !important;
  height: 28px !important;
  border-radius: 9px !important;
  display: grid !important;
  place-items: center !important;
  flex-shrink: 0 !important;
}

.dashboard-viewport .summary-macro-label {
  font-size: 15px !important;
  font-weight: 750 !important;
  color: #1F4D33 !important;
  letter-spacing: -0.2px !important;
  -webkit-font-smoothing: antialiased !important;
}

.dashboard-viewport .summary-macro-numbers {
  display: inline-flex !important;
  align-items: baseline !important;
  gap: 3px !important;
}

.dashboard-viewport .summary-macro-numbers strong {
  font-size: 16px !important;
  font-weight: 800 !important;
  color: #1F4D33 !important;
  -webkit-font-smoothing: antialiased !important;
}

.dashboard-viewport .summary-macro-numbers span {
  font-size: 13px !important;
  font-weight: 550 !important;
  color: rgba(31, 77, 51, 0.6) !important;
  -webkit-font-smoothing: antialiased !important;
}

.dashboard-viewport .summary-macro-track {
  width: 100% !important;
  height: 9px !important;
  border-radius: 999px !important;
  background: rgba(31, 77, 51, 0.09) !important;
  overflow: hidden !important;
}

.dashboard-viewport .summary-macro-bar {
  display: block !important;
  height: 100% !important;
  border-radius: 999px !important;
  transition: width 0.5s ease !important;
}

/* 2. YOUR 7-DAY PLAN */
.seven-day-card {
  padding: 14px 15px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(31, 77, 51, 0.12);
  box-shadow: 0 4px 14px rgba(31, 77, 51, 0.05);
  animation: fade-up 0.4s ease both;
}

.seven-day-strip {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

@media (max-width: 360px) {
  .seven-day-strip {
    display: flex;
    overflow-x: auto;
    padding-bottom: 2px;
    scrollbar-width: none;
  }
  .seven-day-strip::-webkit-scrollbar {
    display: none;
  }
}

.seven-day-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 64px;
  min-width: 40px;
  padding: 5px 2px;
  border-radius: 13px;
  border: 1px solid rgba(31, 77, 51, 0.12);
  background: rgba(255, 255, 255, 0.82);
  color: #1F4D33;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.seven-day-btn:active {
  transform: scale(0.95);
}

.seven-day-btn.is-today {
  border-color: #3FA47A;
  box-shadow: inset 0 0 0 1px #3FA47A;
}

.seven-day-btn.selected {
  background: linear-gradient(180deg, #6A9E82 0%, #3A6E52 100%) !important;
  color: #FBF7EE !important;
  border-color: rgba(31, 77, 51, 0.5) !important;
  box-shadow: 0 4px 12px rgba(31, 77, 51, 0.22) !important;
}

.seven-day-weekday {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: rgba(31, 77, 51, 0.65);
}

.seven-day-btn.selected .seven-day-weekday {
  color: rgba(251, 247, 238, 0.85);
}

.seven-day-num {
  font-size: 14px;
  font-weight: 800;
  line-height: 1.1;
  color: #1F4D33;
}

.seven-day-btn.selected .seven-day-num {
  color: #FFFFFF;
}

.seven-day-dot-wrap {
  height: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.seven-day-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #3FA47A;
  display: block;
}

.seven-day-btn.selected .seven-day-dot {
  background: #FBF7EE;
}

.seven-day-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 9px;
  padding-top: 7px;
  border-top: 1px solid rgba(31, 77, 51, 0.08);
  font-size: 11px;
  color: rgba(31, 77, 51, 0.72);
}

.seven-day-footer strong {
  color: #1F4D33;
}

.seven-day-today-btn {
  background: none;
  border: 0;
  color: #3FA47A;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

/* 3. RECENT MEALS (NUTRITION HISTORY) */
.meal-list {
  display: grid;
  gap: 8px;
}

.meal-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  cursor: pointer;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(31, 77, 51, 0.12);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.meal-row:hover {
  transform: translateY(-1px);
  border-color: rgba(63, 164, 122, 0.3);
}

.meal-row img {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.meal-copy {
  flex: 1;
  display: grid;
  gap: 2px;
  min-width: 0;
}

.meal-copy strong {
  color: #1F4D33;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meal-copy span {
  color: rgba(31, 77, 51, 0.7);
  font-size: 11px;
}

.dashboard-empty-meals,
.loading-row {
  color: rgba(31, 77, 51, 0.7);
  font-size: 12px;
  text-align: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  border: 1px dashed rgba(31, 77, 51, 0.15);
}

.dashboard-empty-scan-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  color: #3FA47A;
  font-weight: 700;
  text-decoration: none;
  font-size: 12px;
}

/* 4. SPONSORED HORIZONTAL CAROUSEL (BELOW THE INITIAL VIEWPORT) */
.sponsor-carousel-section {
  margin-top: 22px;
  margin-bottom: 12px;
}

.sponsor-heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.sponsor-heading-left {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.sponsor-pill-tag {
  font-size: 8.5px;
  font-weight: 750;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 6px;
  background: rgba(63, 164, 122, 0.14);
  color: #266b4c;
  border: 1px solid rgba(63, 164, 122, 0.25);
}

.sponsor-carousel-dots {
  display: flex;
  align-items: center;
  gap: 5px;
}

.sponsor-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(31, 77, 51, 0.24);
  border: 0;
  padding: 0;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.sponsor-dot.active {
  width: 20px;
  background: linear-gradient(135deg, #3FA47A 0%, #1F4D33 100%);
  box-shadow: 0 2px 6px rgba(63, 164, 122, 0.32);
}

/* DOKO SPONSORED ADVERTISEMENT BANNER (VIDEO WITH DOKO HOLDING WHITE BOARD) */
.doko-sponsor-card {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 20px;
  overflow: hidden;
  background: #0E291B;
  border: 1px solid rgba(31, 77, 51, 0.16);
  box-shadow: 0 8px 26px rgba(31, 77, 51, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  user-select: none;
  touch-action: pan-y;
  isolation: isolate;
  display: block;
  container-type: inline-size;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  outline: none;
  box-sizing: border-box;
}

@media (max-width: 420px) {
  .doko-sponsor-card {
    aspect-ratio: 16 / 9;
    min-height: unset;
  }
}

.doko-sponsor-card:hover {
  border-color: rgba(63, 164, 122, 0.45);
  box-shadow: 0 12px 30px rgba(31, 77, 51, 0.18), 0 4px 10px rgba(0, 0, 0, 0.08);
}

.doko-sponsor-card:active {
  transform: scale(0.992);
}

.doko-sponsor-card:focus-visible {
  box-shadow: 0 0 0 3px rgba(63, 164, 122, 0.45), 0 8px 24px rgba(31, 77, 51, 0.12);
}

/* 1. Persistent Animated Doko Video Layer */
.doko-ad-video-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.doko-ad-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  pointer-events: none;
  transform: translateZ(0);
}

@media (prefers-reduced-motion: reduce) {
  .doko-ad-video {
    display: none;
  }
  .doko-ad-video-layer {
    background: url('/doko-sponsor-board-poster.jpg') no-repeat center center / contain;
  }
}

/* 2. Sliding Carousel Track on Top of the Video Layer */
.doko-carousel-track {
  position: relative;
  z-index: 2;
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .doko-carousel-track {
    transition: none !important;
  }
}

/* Individual Slide Container */
.doko-slide-wrapper {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

/* 3. Sponsor Content Aligned Inside Doko's White Board */
.doko-whiteboard-content {
  position: absolute;
  top: 7%;
  left: 6.8%;
  width: 53%;
  height: 85%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  text-align: left;
  overflow: hidden;
  color: #0E3A24;
  padding: clamp(6px, 2.2cqw, 14px) clamp(6px, 2.4cqw, 14px);
  gap: clamp(3px, 1.1cqw, 7px);
  z-index: 3;
}

@media (max-width: 420px) {
  .doko-whiteboard-content {
    top: 6.5%;
    left: 6.5%;
    width: 53%;
    height: 86%;
    padding: 6px 7px;
    gap: 3px;
  }
}

/* Brand Row: Logo + Brand Name + Badge */
.doko-ad-brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  width: 100%;
  flex-shrink: 0;
  min-height: 0;
}

.doko-ad-brand-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  overflow: hidden;
}

.doko-ad-logo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(16px, 4.8cqw, 22px);
  height: clamp(16px, 4.8cqw, 22px);
  min-width: clamp(16px, 4.8cqw, 22px);
  border-radius: 5px;
  background: #FFFFFF;
  box-shadow: 0 1px 3px rgba(31, 77, 51, 0.15);
  border: 1px solid rgba(31, 77, 51, 0.14);
  flex-shrink: 0;
  overflow: hidden;
  padding: 1.5px;
}

.doko-ad-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.doko-ad-brand-name {
  font-size: clamp(8.5px, 2.6cqw, 11.5px);
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0.35px;
  color: #0A2F1B;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doko-ad-badge {
  font-size: clamp(6px, 1.8cqw, 8px);
  font-weight: 800;
  color: #165634;
  background: rgba(63, 164, 122, 0.18);
  border: 1px solid rgba(63, 164, 122, 0.35);
  padding: 1.5px 5px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  line-height: 1;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Headline */
.doko-ad-heading {
  margin: 0;
  font-size: clamp(10px, 3cqw, 13.5px);
  font-weight: 850;
  color: #041B0E;
  line-height: 1.2;
  letter-spacing: -0.2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-shrink: 0;
}

/* Media & Marketing Description Row with Small Brand/Product Image */
.doko-ad-body-row {
  display: flex;
  align-items: center;
  gap: clamp(5px, 1.6cqw, 8px);
  flex: 1 1 auto;
  min-height: 0;
  margin: 1px 0;
  overflow: hidden;
}

.doko-ad-product-box {
  width: clamp(34px, 10cqw, 48px);
  height: clamp(28px, 8.5cqw, 40px);
  min-width: clamp(34px, 10cqw, 48px);
  border-radius: 6px;
  background: #FFFFFF;
  border: 1px solid rgba(31, 77, 51, 0.16);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 1.5px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.doko-ad-product-box:hover {
  transform: scale(1.06);
  border-color: rgba(63, 164, 122, 0.45);
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.12);
}

.doko-ad-product-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  border-radius: 4px;
}

/* Marketing Description */
.doko-ad-desc {
  margin: 0;
  font-size: clamp(7.5px, 2.1cqw, 10px);
  font-weight: 550;
  color: #24583B;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1 1 auto;
}

.doko-ad-desc.full-width {
  font-size: clamp(8px, 2.3cqw, 10.5px);
  -webkit-line-clamp: 3;
}

/* Bottom CTA Row */
.doko-ad-cta-wrap {
  display: flex;
  align-items: center;
  margin-top: auto;
  flex-shrink: 0;
  min-height: 0;
}

.doko-ad-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 4.5px;
  background: linear-gradient(135deg, #1C6941 0%, #0D371E 100%);
  color: #FFFFFF;
  font-size: clamp(8px, 2.4cqw, 10.5px);
  font-weight: 800;
  padding: clamp(3px, 1cqw, 5.5px) clamp(8px, 2.4cqw, 13px);
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 6px rgba(13, 55, 30, 0.3);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  line-height: 1.1;
  text-decoration: none;
  flex-shrink: 0;
}

.doko-ad-cta-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(13, 55, 30, 0.45);
}

.doko-ad-cta-btn:active {
  transform: scale(0.96);
}

.doko-ad-cta-btn svg {
  transition: transform 0.2s ease;
}

.doko-sponsor-card:hover .doko-ad-cta-btn svg {
  transform: translateX(1.5px);
}

/* MODAL */
.dashboard-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(18, 53, 36, 0.4);
  backdrop-filter: blur(4px);
}

.dashboard-goal-modal {
  width: min(100%, 360px);
  padding: 22px;
  border-radius: 24px;
  background: linear-gradient(170deg, #FBF8F0, #F2EADA);
  color: #1F4D33;
  box-shadow: 0 30px 60px rgba(31, 77, 51, 0.25);
}

.dashboard-goal-modal h2 {
  margin: 0 0 14px;
  font-size: 18px;
  font-weight: 750;
}

.dashboard-goal-modal label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 4px;
  color: #1F4D33;
}

.dashboard-goal-modal input {
  width: 100%;
  padding: 9px 12px;
  border-radius: 12px;
  border: 1px solid rgba(31, 77, 51, 0.18);
  background: rgba(255, 255, 255, 0.85);
  color: #1F4D33;
  font: inherit;
}

.dashboard-goal-save {
  width: 100%;
  height: 48px;
  margin-top: 16px;
  border: 0;
  border-radius: 14px;
  cursor: pointer;
  color: #FBF7EE;
  font-weight: 700;
  font-size: 14px;
  background: linear-gradient(180deg, #6A9E82 0%, #4E8266 50%, #3A6E52 100%);
  box-shadow: 0 6px 16px rgba(31, 77, 51, 0.25);
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-viewport *,
  .dashboard-viewport *::before,
  .dashboard-viewport *::after {
    animation: none !important;
    transition: none !important;
  }
  .scan-hero-video,
  .smart-food-scanner video {
    display: none;
  }
  .scan-hero,
  .smart-food-scanner {
    background-image: url('/doko-dance-card-poster.jpg');
    background-size: cover;
    background-position: 80% center;
  }
}
`;

function UserAvatar({ user, profile }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = (user?.name || 'User')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (profile?.avatar) return <Avatar avatar={profile.avatar} alt={`${user?.name || 'User'} avatar`} />;
  return user?.avatarUrl && !imageFailed ? (
    <img className="dashboard-avatar" src={user.avatarUrl} alt={`${user.name} profile`} onError={() => setImageFailed(true)} />
  ) : (
    <div className="dashboard-avatar dashboard-avatar-fallback" aria-label="Profile avatar">
      <UserRound size={21} strokeWidth={1.8} />
      <span>{initials}</span>
    </div>
  );
}

function SummaryRing({ calories, goal }) {
  const percentage = goal > 0 ? Math.min(Math.round((calories / goal) * 100), 100) : 0;
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    setAnimatedPercentage(0);
    const fillTimer = setTimeout(() => setAnimatedPercentage(100), 150);
    const settleTimer = setTimeout(() => setAnimatedPercentage(percentage), 900);
    return () => {
      clearTimeout(fillTimer);
      clearTimeout(settleTimer);
    };
  }, [percentage]);

  return (
    <div className="summary-ring" style={{ '--progress': `${animatedPercentage * 3.6}deg` }}>
      <div className="summary-ring-inner">
        <strong>{calories.toLocaleString()}</strong>
        <span>/ {goal.toLocaleString()} kcal</span>
        <b>{percentage}%</b>
      </div>
    </div>
  );
}

const macroStyles = {
  protein: { Icon: Dumbbell, color: '#55b99c' },
  carbs: { Icon: Wheat, color: '#f7a13b' },
  fat: { Icon: Droplet, color: '#e8893a' },
};

function MacroRow({ type, label, value, goal }) {
  const { Icon, color } = macroStyles[type];
  const percentage = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  const displayValue = Math.round(Number(value) || 0);
  const displayGoal = Math.round(Number(goal) || 0);
  return (
    <div className={`summary-macro-row ${type}`}>
      <div className="summary-macro-header">
        <div className="summary-macro-title">
          <span className="summary-macro-icon" style={{ background: `${color}22`, color }}>
            <Icon size={14} strokeWidth={2.4} />
          </span>
          <span className="summary-macro-label">{label}</span>
        </div>
        <div className="summary-macro-numbers">
          <strong>{displayValue}</strong>
          <span>/{displayGoal}g</span>
        </div>
      </div>
      <div className="summary-macro-track">
        <span className="summary-macro-bar" style={{ width: `${percentage}%`, background: color }} />
      </div>
    </div>
  );
}

export const Home = () => {
  const navigate = useNavigate();
  const scanVideoRef = useRef(null);

  const handleScanHeroClick = () => {
    if (scanVideoRef.current) {
      try {
        scanVideoRef.current.pause();
      } catch (e) {
        // ignore
      }
    }
  };

  const location = useLocation();
  const { user } = useAuth();
  const { getHistory, loading } = useNutrition();
  const [history, setHistory] = useState({ summary: { totals: {} }, data: [] });
  const [profile, setProfile] = useState(null);
  const [nutritionProgress, setNutritionProgress] = useState(null);
  const [selectedProgressDate, setSelectedProgressDate] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [goalOverride, setGoalOverride] = useState({});
  const [goalDraft, setGoalDraft] = useState({
    calorieGoal: defaultSummary.calorieGoal,
    proteinGoal: defaultSummary.proteinGoal,
    carbsGoal: defaultSummary.carbsGoal,
    fatGoal: defaultSummary.fatGoal
  });
  const [goalEditorOpen, setGoalEditorOpen] = useState(false);

  // ========================================================
  // FEATURED PARTNERS AUTOMATIC CAROUSEL ENGINE (5s Rotation)
  // ========================================================
  const [sponsors, setSponsors] = useState(fallbackSponsors);
  const [activeSlide, setActiveSlide] = useState(0);

  const carouselRef = useRef(null);
  const carouselSectionRef = useRef(null);
  const dokoVideoRef = useRef(null);
  const activeSlideRef = useRef(0);
  const sponsorsRef = useRef(fallbackSponsors);

  // Interaction, visibility, and accessibility pause flags
  const isInteractingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isVisibleRef = useRef(true);
  const isTabVisibleRef = useRef(true);
  const prefersReducedMotionRef = useRef(false);

  // Desktop drag & mobile swipe tracking
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const touchStartPosRef = useRef({ x: 0, y: 0 });
  const hasTouchSwipedRef = useRef(false);

  // Dedicated single autoplay timer ref
  const autoplayTimerRef = useRef(null);

  // Ensure Doko animated video autoplays inline & muted
  useEffect(() => {
    const vid = dokoVideoRef.current;
    if (!vid) return;
    vid.muted = true;
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, []);

  // Keep references in sync with latest state
  useEffect(() => {
    sponsorsRef.current = sponsors;
  }, [sponsors]);

  useEffect(() => {
    activeSlideRef.current = activeSlide;
  }, [activeSlide]);

  // Smooth slide navigation
  const scrollToSlide = useCallback((targetIdx) => {
    const currentSponsors = sponsorsRef.current;
    if (!currentSponsors || currentSponsors.length === 0) return;

    // Wrap around smoothly (0 -> length-1 -> 0)
    const normalizedIdx = ((targetIdx % currentSponsors.length) + currentSponsors.length) % currentSponsors.length;
    activeSlideRef.current = normalizedIdx;
    setActiveSlide(normalizedIdx);
  }, []);

  // Advance to next advertisement (every 5 seconds)
  const advanceToNextSlide = useCallback(() => {
    const currentSponsors = sponsorsRef.current;
    if (!currentSponsors || currentSponsors.length <= 1) return;

    if (isInteractingRef.current) return;
    if (isHoveredRef.current) return;
    if (!isVisibleRef.current) return;
    if (!isTabVisibleRef.current) return;
    if (prefersReducedMotionRef.current) return;

    const nextIdx = (activeSlideRef.current + 1) % currentSponsors.length;
    scrollToSlide(nextIdx);
  }, [scrollToSlide]);

  const clearAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const resetAutoplayTimer = useCallback(() => {
    clearAutoplayTimer();
    if (prefersReducedMotionRef.current) return;
    if (sponsorsRef.current.length <= 1) return;

    autoplayTimerRef.current = setInterval(() => {
      advanceToNextSlide();
    }, 3000); // Automatically switch sponsors every 3 seconds
  }, [clearAutoplayTimer, advanceToNextSlide]);

  // Load sponsor data dynamically from backend API
  useEffect(() => {
    getSponsorsApi()
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setSponsors(res.data.data);
        }
      })
      .catch(() => {
        // Keeps fallback
      });
  }, []);

  // Set up smart autoplay listeners: IntersectionObserver, tab visibility & reduced motion
  useEffect(() => {
    // 1. Reduced motion accessibility
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = motionQuery.matches;
    const handleMotionChange = (e) => {
      prefersReducedMotionRef.current = e.matches;
      if (e.matches) {
        clearAutoplayTimer();
      } else {
        resetAutoplayTimer();
      }
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // 2. Tab visibility change (pause on background tabs)
    const handleVisibilityChange = () => {
      const isTabActive = !document.hidden;
      isTabVisibleRef.current = isTabActive;
      if (isTabActive) {
        resetAutoplayTimer();
      } else {
        clearAutoplayTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 3. Viewport IntersectionObserver (only rotate when on-screen)
    let observer;
    if ('IntersectionObserver' in window && carouselSectionRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisibleRef.current = entry.isIntersecting;
            if (entry.isIntersecting) {
              resetAutoplayTimer();
            } else {
              clearAutoplayTimer();
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(carouselSectionRef.current);
    } else {
      resetAutoplayTimer();
    }

    return () => {
      clearAutoplayTimer();
      motionQuery.removeEventListener('change', handleMotionChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer) observer.disconnect();
    };
  }, [clearAutoplayTimer, resetAutoplayTimer]);

  // Restart timer cleanly whenever sponsor list changes
  useEffect(() => {
    resetAutoplayTimer();
  }, [sponsors, resetAutoplayTimer]);

  // Card click navigation (avoids accidental triggers during swipe or drag)
  const handleSponsorClick = (sponsor) => {
    if (hasDraggedRef.current || hasTouchSwipedRef.current) return;
    if (!sponsor?.destinationUrl) return;
    try {
      trackSponsorClickApi(sponsor.id).catch(() => {});
    } catch (e) {
      // ignore
    }
    window.open(sponsor.destinationUrl, '_blank', 'noopener,noreferrer');
  };

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e) => {
    isInteractingRef.current = true;
    hasTouchSwipedRef.current = false;
    clearAutoplayTimer();
    if (e.touches && e.touches[0]) {
      touchStartPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!touchStartPosRef.current || !e.touches || !e.touches[0]) return;
    const dx = e.touches[0].clientX - touchStartPosRef.current.x;
    const dy = e.touches[0].clientY - touchStartPosRef.current.y;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      hasTouchSwipedRef.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    isInteractingRef.current = false;
    if (touchStartPosRef.current && e.changedTouches && e.changedTouches[0]) {
      const dx = e.changedTouches[0].clientX - touchStartPosRef.current.x;
      const currentSponsors = sponsorsRef.current;
      if (Math.abs(dx) > 30 && currentSponsors && currentSponsors.length > 1) {
        if (dx < 0) {
          // Swipe left -> next sponsor
          scrollToSlide(activeSlideRef.current + 1);
        } else {
          // Swipe right -> previous sponsor
          scrollToSlide(activeSlideRef.current - 1);
        }
      }
    }
    setTimeout(() => {
      hasTouchSwipedRef.current = false;
    }, 120);
    resetAutoplayTimer();
  };

  // Mouse drag & hover handlers for desktop
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    isInteractingRef.current = true;
    hasDraggedRef.current = false;
    clearAutoplayTimer();
    startXRef.current = e.pageX;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.pageX - startXRef.current;
    if (Math.abs(dx) > 8) {
      hasDraggedRef.current = true;
    }
  };

  const handleMouseUp = (e) => {
    if (isDraggingRef.current) {
      const dx = (e && typeof e.pageX === 'number') ? e.pageX - startXRef.current : 0;
      const currentSponsors = sponsorsRef.current;
      if (Math.abs(dx) > 30 && currentSponsors && currentSponsors.length > 1) {
        if (dx < 0) {
          scrollToSlide(activeSlideRef.current + 1);
        } else {
          scrollToSlide(activeSlideRef.current - 1);
        }
      }
    }
    isDraggingRef.current = false;
    isInteractingRef.current = false;
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 120);
    resetAutoplayTimer();
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    clearAutoplayTimer();
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      handleMouseUp({ pageX: startXRef.current });
    }
    isHoveredRef.current = false;
    resetAutoplayTimer();
  };

  const handleBannerKeyDown = (e) => {
    const currentSponsors = sponsorsRef.current;
    if (!currentSponsors || currentSponsors.length <= 1) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToSlide(activeSlideRef.current + 1);
      resetAutoplayTimer();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToSlide(activeSlideRef.current - 1);
      resetAutoplayTimer();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const currentAd = currentSponsors[activeSlideRef.current];
      if (currentAd) handleSponsorClick(currentAd);
    }
  };

  const fetchDashboardData = () => {
    if (!user?.id) return;
    setProfile(null);
    setProfileLoading(true);
    getHistory().then(setHistory).catch(() => setHistory({ summary: { totals: {} }, data: [] }));
    getProgressApi('week').then((response) => {
      const nextProgress = response.data.data;
      setNutritionProgress(nextProgress);
      setSelectedProgressDate(nextProgress.days?.[nextProgress.days.length - 1]?.date || null);
    }).catch(() => setNutritionProgress(null));
    getProfileApi().then((response) => {
      const nextProfile = response.data.data;
      const resolvedProfile = nextProfile;
      setProfile(resolvedProfile);
      setGoalOverride({
        calorieGoal: Number(resolvedProfile?.calorieGoal || defaultSummary.calorieGoal),
        proteinGoal: Number(resolvedProfile?.proteinGoal || defaultSummary.proteinGoal),
        carbsGoal: Number(resolvedProfile?.carbsGoal || defaultSummary.carbsGoal),
        fatGoal: Number(resolvedProfile?.fatGoal || defaultSummary.fatGoal)
      });
      setGoalDraft({
        calorieGoal: Number(resolvedProfile?.calorieGoal || defaultSummary.calorieGoal),
        proteinGoal: Number(resolvedProfile?.proteinGoal || defaultSummary.proteinGoal),
        carbsGoal: Number(resolvedProfile?.carbsGoal || defaultSummary.carbsGoal),
        fatGoal: Number(resolvedProfile?.fatGoal || defaultSummary.fatGoal)
      });
    }).catch(() => setProfile(null)).finally(() => setProfileLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, [getHistory, user?.id, location.key]);

  useEffect(() => {
    const syncTrackedMeals = () => {
      getHistory().then(setHistory).catch(() => {});
      getProgressApi('week').then((response) => setNutritionProgress(response.data.data)).catch(() => {});
    };
    window.addEventListener('nutrilens-tracker-updated', syncTrackedMeals);
    window.addEventListener('storage', syncTrackedMeals);
    return () => {
      window.removeEventListener('nutrilens-tracker-updated', syncTrackedMeals);
      window.removeEventListener('storage', syncTrackedMeals);
    };
  }, [user?.id, getHistory]);

  const todayDateStr = useMemo(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }, []);

  const progressDays = nutritionProgress?.days || [];

  // Compute the rolling 7-day window ending today
  const sevenDayCards = useMemo(() => {
    const daysMap = new Map();
    progressDays.forEach((d) => {
      daysMap.set(d.date, d);
    });

    const list = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const existing = daysMap.get(dateStr);

      const weekdayShort = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const isToday = dateStr === todayDateStr;

      const hasActivity = existing && (
        (existing.meals && existing.meals.length > 0) ||
        (existing.calories && Number(existing.calories) > 0)
      );

      list.push({
        date: dateStr,
        weekday: weekdayShort,
        dayNum,
        isToday,
        hasActivity: Boolean(hasActivity),
        data: existing || { date: dateStr, meals: [], calories: 0, protein: 0, carbs: 0, fat: 0 }
      });
    }
    return list;
  }, [progressDays, todayDateStr]);

  const selectedDay = useMemo(() => {
    if (selectedProgressDate) {
      const fromProgress = progressDays.find((d) => d.date === selectedProgressDate);
      if (fromProgress) return fromProgress;
      const fromSeven = sevenDayCards.find((c) => c.date === selectedProgressDate);
      if (fromSeven) return fromSeven.data;
    }
    return progressDays[progressDays.length - 1] || sevenDayCards[sevenDayCards.length - 1]?.data || null;
  }, [progressDays, selectedProgressDate, sevenDayCards]);

  const summary = useMemo(() => {
    const selectedTotals = selectedDay || nutritionProgress?.today || {};
    const mealTotals = (selectedTotals.meals || []).reduce((sum, meal) => ({
      calories: sum.calories + Number(meal.calories || meal.totals?.calories || 0),
      protein: sum.protein + Number(meal.protein || meal.totals?.protein || 0),
      carbs: sum.carbs + Number(meal.carbs || meal.totals?.carbohydrates || meal.totals?.carbs || 0),
      fat: sum.fat + Number(meal.fat || meal.totals?.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const resolvedTotals = (selectedTotals.calories || selectedTotals.protein || selectedTotals.carbs || selectedTotals.fat)
      ? selectedTotals
      : { ...selectedTotals, ...mealTotals };

    const base = {
      ...defaultSummary,
      calories: Number(resolvedTotals.calories || 0),
      protein: Number(resolvedTotals.protein || 0),
      carbs: Number(resolvedTotals.carbs || 0),
      fat: Number(resolvedTotals.fat || 0),
      calorieGoal: Number(profile?.calorieGoal || defaultSummary.calorieGoal),
      proteinGoal: Number(profile?.proteinGoal || defaultSummary.proteinGoal),
      carbsGoal: Number(profile?.carbsGoal || defaultSummary.carbsGoal),
      fatGoal: Number(profile?.fatGoal || defaultSummary.fatGoal),
      ...goalOverride
    };

    return {
      ...base,
      calories: Number(base.calories || 0),
      protein: Number(base.protein || 0),
      carbs: Number(base.carbs || 0),
      fat: Number(base.fat || 0),
    };
  }, [nutritionProgress, selectedDay, goalOverride, profile?.calorieGoal, profile?.proteinGoal, profile?.carbsGoal, profile?.fatGoal]);

  const isSelectedPastDay = Boolean(selectedProgressDate && selectedDay && selectedDay.date !== todayDateStr);
  const selectedDayName = selectedDay ? new Date(`${selectedDay.date}T12:00:00Z`).toLocaleDateString([], { weekday: 'long' }) : 'Today';

  const selectedDayMealRows = (selectedDay?.meals || []).map((meal) => ({
    ...meal,
    _id: meal.id,
    foodName: meal.name || 'Saved meal',
    calories: Number(meal.calories ?? meal.totals?.calories ?? 0),
    protein: Number(meal.protein ?? meal.totals?.protein ?? 0),
    carbs: Number(meal.carbs ?? meal.totals?.carbohydrates ?? 0),
    fats: Number(meal.fats ?? meal.fat ?? meal.totals?.fat ?? 0),
    fiber: Number(meal.fiber ?? meal.totals?.fiber ?? 0),
    sodium: Number(meal.sodium ?? meal.totals?.sodium ?? 0),
    itemCount: meal.items || 1,
    image: meal.image,
  }));

  const meals = useMemo(() => {
    if (!selectedDay) return [];
    const sourceMeals = selectedDayMealRows;
    return sourceMeals
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);
  }, [selectedDay, selectedDayMealRows]);

  const displayName = user?.name?.split(' ')[0] || 'there';

  const saveGoals = async () => {
    if (!profile) return;
    const nextProfile = {
      ...profile,
      calorieGoal: Number(goalDraft.calorieGoal) || 0,
      proteinGoal: Number(goalDraft.proteinGoal) || 0,
      carbsGoal: Number(goalDraft.carbsGoal) || 0,
      fatGoal: Number(goalDraft.fatGoal) || 0
    };
    setProfile(nextProfile);
    setGoalOverride({
      calorieGoal: nextProfile.calorieGoal,
      proteinGoal: nextProfile.proteinGoal,
      carbsGoal: nextProfile.carbsGoal,
      fatGoal: nextProfile.fatGoal
    });
    setGoalEditorOpen(false);
    await saveProfileApi(nextProfile);
  };

  const openMealDetails = (meal) => {
    navigate(`/food/${meal._id || 'recent-meal'}`, {
      state: {
        item: {
          id: meal._id,
          name: meal.foodName || 'Recent meal',
          portion: `${meal.itemCount || 1} items`,
          kcal: Number(meal.calories || meal.kcal || 0),
          protein: Number(meal.protein ?? meal.totals?.protein ?? 0),
          carbs: Number(meal.carbs ?? meal.totals?.carbohydrates ?? 0),
          fat: Number(meal.fats ?? meal.fat ?? meal.totals?.fat ?? 0),
          fiber: Number(meal.fiber ?? meal.totals?.fiber ?? 0),
          sodium: Number(meal.sodium ?? meal.totals?.sodium ?? 0),
          image: meal.image || mealImage,
          items: meal.items,
        },
      },
    });
  };

  return (
    <div className="kl-page dashboard-viewport">
      <style>{homeCss}</style>
      <main className="dashboard-page kl-fade-up">
        <AppHeader avatar={profile?.avatar} streak={calculateStreak(progressDays)} />
        <header className="dashboard-header" style={{ marginTop: '10px' }}>
          <div>
            <h1>Hello, {displayName}! <span aria-hidden="true">👋</span></h1>
            <p>Track your nutrition today</p>
          </div>
        </header>

        {/* 1. SMART FOOD SCANNER */}
        <Link to="/scan" className="scan-hero smart-food-scanner" onClick={handleScanHeroClick}>
          <video
            ref={scanVideoRef}
            className="scan-hero-video"
            autoPlay
            loop
            muted
            playsInline
            poster="/doko-dance-card-poster.jpg"
            aria-hidden="true"
          >
            <source src="/doko-dance-card.webm" type="video/webm" />
            <source src="/doko-dance-card-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
            <source src="/doko-dance-card.mp4" type="video/mp4" />
          </video>
          <div className="scan-hero-overlay" aria-hidden="true" />
          <div className="scan-hero-copy scanner-content">
            <div className="scan-hero-tag">
              <span className="scan-camera-pill" aria-hidden="true">
                <Camera size={14} strokeWidth={2.4} />
              </span>
              <small>SMART FOOD SCANNER</small>
            </div>
            <strong>Scan Your Food</strong>
            <span className="scan-hero-desc">Tap to scan or upload your meal</span>
          </div>
        </Link>

        {/* 2. COMPACT TODAY'S SUMMARY */}
        <section className="dashboard-section summary-section">
          <div className="section-heading">
            <h2>{!isSelectedPastDay ? "Today's Summary" : `${selectedDayName}'s Summary`}</h2>
            <button
              type="button"
              onClick={() => {
                setGoalDraft({
                  calorieGoal: summary.calorieGoal,
                  proteinGoal: summary.proteinGoal,
                  carbsGoal: summary.carbsGoal,
                  fatGoal: summary.fatGoal
                });
                setGoalEditorOpen(true);
              }}
            >
              Edit Goal
            </button>
          </div>
          <div className="summary-card">
            <SummaryRing calories={summary.calories} goal={summary.calorieGoal} />
            <div className="summary-macro-list">
              <MacroRow type="protein" label="Protein" value={summary.protein} goal={summary.proteinGoal} />
              <MacroRow type="carbs" label="Carbs" value={summary.carbs} goal={summary.carbsGoal} />
              <MacroRow type="fat" label="Fat" value={summary.fat} goal={summary.fatGoal} />
            </div>
          </div>
        </section>

        {/* 3. YOUR 7-DAY PLAN */}
        <section className="dashboard-section plan-section" aria-labelledby="seven-day-plan-title">
          <div className="section-heading">
            <h2 id="seven-day-plan-title">Your 7-Day Plan</h2>
            <Link to="/progress" className="section-view-all">View All</Link>
          </div>
          <div className="seven-day-card">
            <div className="seven-day-strip">
              {sevenDayCards.map((card) => {
                const isSelected = card.date === (selectedDay?.date || selectedProgressDate);
                return (
                  <button
                    type="button"
                    key={card.date}
                    className={`seven-day-btn ${isSelected ? 'selected' : ''} ${card.isToday ? 'is-today' : ''}`}
                    onClick={() => setSelectedProgressDate(card.date)}
                    aria-label={`Select ${card.weekday}, ${card.date}`}
                  >
                    <span className="seven-day-weekday">{card.weekday}</span>
                    <strong className="seven-day-num">{card.dayNum}</strong>
                    <span className="seven-day-dot-wrap">
                      {card.hasActivity && <i className="seven-day-dot" title="Activity logged" />}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedDay && (
              <div className="seven-day-footer">
                <span>
                  <strong>{selectedDay.meals?.length || 0}</strong> {selectedDay.meals?.length === 1 ? 'meal' : 'meals'} recorded
                  {selectedDay.calories ? ` · ${Math.round(selectedDay.calories)} kcal` : ''}
                </span>
                {isSelectedPastDay && (
                  <button
                    type="button"
                    className="seven-day-today-btn"
                    onClick={() => setSelectedProgressDate(todayDateStr)}
                  >
                    Back to Today
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 4. FEATURED PARTNERS / SPONSORED ADVERTISEMENTS (DOKO HOLDING SPONSOR BOARD) */}
        {sponsors.length > 0 && (
          <section
            ref={carouselSectionRef}
            className="dashboard-section sponsor-carousel-section"
            aria-labelledby="sponsor-carousel-title"
          >
            <div className="section-heading sponsor-heading-row">
              <div className="sponsor-heading-left">
                <h2 id="sponsor-carousel-title">Featured Partners</h2>
                <span className="sponsor-pill-tag">Sponsored</span>
              </div>
              {sponsors.length > 1 && (
                <div className="sponsor-carousel-dots" role="tablist" aria-label="Partner carousel slides">
                  {sponsors.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`sponsor-dot ${idx === activeSlide ? 'active' : ''}`}
                      onClick={() => {
                        scrollToSlide(idx);
                        resetAutoplayTimer();
                      }}
                      aria-label={`Go to slide ${idx + 1}`}
                      aria-selected={idx === activeSlide}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* DOKO SPONSOR BANNER CARD (ANIMATED DOKO VIDEO HOLDING WHITE BOARD) */}
            <div
              className="doko-sponsor-card"
              ref={carouselRef}
              role="region"
              aria-label="Featured Partners Carousel"
              tabIndex="0"
              onKeyDown={handleBannerKeyDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
            >
              {/* Persistent Animated Doko Video Layer (Holding White Board) */}
              <div className="doko-ad-video-layer" aria-hidden="true">
                <video
                  ref={dokoVideoRef}
                  className="doko-ad-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/doko-sponsor-board-poster.jpg"
                >
                  <source src="/doko-sponsor-board.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Dynamic Sliding Content Track */}
              <div
                className="doko-carousel-track"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {sponsors.map((ad, idx) => (
                  <div
                    key={ad.id || idx}
                    className={`doko-slide-wrapper ${idx === activeSlide ? 'active-slide' : ''}`}
                    role="button"
                    tabIndex="0"
                    aria-label={`${ad.sponsorName}: ${ad.heading}`}
                    onClick={() => {
                      if (!hasDraggedRef.current && !hasTouchSwipedRef.current) {
                        handleSponsorClick(ad);
                      }
                    }}
                  >
                    {/* Sponsor Content Aligned Inside Doko's White Board */}
                    <div className="doko-whiteboard-content">
                      {/* 1. Brand Identity Row: Logo + Brand Name + Badge */}
                      <div className="doko-ad-brand-row">
                        <div className="doko-ad-brand-meta">
                          {ad.imageUrl && (
                            <div className="doko-ad-logo-wrap">
                              <img
                                src={ad.imageUrl}
                                alt={`${ad.sponsorName} logo`}
                                className="doko-ad-logo"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <span className="doko-ad-brand-name">{ad.sponsorName}</span>
                        </div>
                        <span className="doko-ad-badge">{ad.badge || 'Sponsored'}</span>
                      </div>

                      {/* 2. Main Headline */}
                      <h4 className="doko-ad-heading">{ad.heading}</h4>

                      {/* 3. Middle Body Row: Small Brand Product Thumbnail + Description */}
                      <div className="doko-ad-body-row">
                        {ad.productImage && (
                          <div
                            className="doko-ad-product-box"
                            role="button"
                            tabIndex="0"
                            aria-label={`View ${ad.sponsorName} products`}
                            title={`Visit ${ad.sponsorName}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSponsorClick(ad);
                            }}
                          >
                            <img
                              src={ad.productImage}
                              alt={`${ad.sponsorName} product`}
                              className="doko-ad-product-img"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.parentElement.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <p className={`doko-ad-desc ${ad.productImage ? 'with-product' : 'full-width'}`}>
                          {ad.description}
                        </p>
                      </div>

                      {/* 4. Clickable CTA Button */}
                      <div className="doko-ad-cta-wrap">
                        <button
                          type="button"
                          className="doko-ad-cta-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSponsorClick(ad);
                          }}
                          aria-label={`${ad.ctaText || 'Shop Now'} at ${ad.sponsorName}`}
                        >
                          <span>{ad.ctaText || 'Shop Now'}</span>
                          <ExternalLink size={11} strokeWidth={2.4} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. RECENT MEALS (NUTRITION HISTORY) */}
        <section className="dashboard-section recent-section">
          <div className="section-heading">
            <h2>{isSelectedPastDay ? `Meals for ${selectedDayName}` : 'Recent Meals'}</h2>
          </div>
          <div className="meal-list">
            {loading && (!history?.data || history.data.length === 0) ? (
              <div className="loading-row">Loading your meals…</div>
            ) : meals.length === 0 ? (
              <div className="dashboard-empty-meals">
                <p>No meals recorded {isSelectedPastDay ? `for ${selectedDayName}` : 'yet'}.</p>
                <Link to="/scan" className="dashboard-empty-scan-link">
                  <Camera size={14} />
                  <span>Scan your meal</span>
                </Link>
              </div>
            ) : (
              meals.map((meal, index) => (
                <div
                  className="meal-row"
                  key={meal._id || `${meal.foodName}-${index}`}
                  role="button"
                  tabIndex="0"
                  onClick={() => openMealDetails(meal)}
                  onKeyDown={(e) => { if (e.key === 'Enter') openMealDetails(meal); }}
                >
                  <img src={meal.image || meal.imageUrl || mealImage} alt={meal.foodName || 'Recent meal'} />
                  <div className="meal-copy">
                    <strong>{meal.foodName}</strong>
                    <span>{Math.round(meal.calories)} kcal&nbsp;·&nbsp;{Math.round(meal.protein || 0)}g protein</span>
                  </div>
                  <ChevronRight size={20} />
                </div>
              ))
            )}
          </div>
        </section>

        

        
      </main>

      <BottomNav active="home" />

      {goalEditorOpen && (
        <div className="dashboard-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setGoalEditorOpen(false); }}>
          <div className="dashboard-goal-modal" role="dialog" aria-modal="true" aria-labelledby="goal-title">
            <h2 id="goal-title">Edit Nutrition Goals</h2>
            <label htmlFor="goal-calories">Daily Calories (kcal)</label>
            <input
              id="goal-calories"
              type="number"
              value={goalDraft.calorieGoal}
              onChange={(e) => setGoalDraft({ ...goalDraft, calorieGoal: e.target.value })}
            />
            <label htmlFor="goal-protein">Protein Goal (g)</label>
            <input
              id="goal-protein"
              type="number"
              value={goalDraft.proteinGoal}
              onChange={(e) => setGoalDraft({ ...goalDraft, proteinGoal: e.target.value })}
            />
            <label htmlFor="goal-carbs">Carbs Goal (g)</label>
            <input
              id="goal-carbs"
              type="number"
              value={goalDraft.carbsGoal}
              onChange={(e) => setGoalDraft({ ...goalDraft, carbsGoal: e.target.value })}
            />
            <label htmlFor="goal-fat">Fat Goal (g)</label>
            <input
              id="goal-fat"
              type="number"
              value={goalDraft.fatGoal}
              onChange={(e) => setGoalDraft({ ...goalDraft, fatGoal: e.target.value })}
            />
            <button type="button" className="dashboard-goal-save" onClick={saveGoals}>
              Save Goals
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
