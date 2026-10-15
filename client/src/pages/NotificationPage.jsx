import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  Flame,
  Info,
  Layers,
  Moon,
  Plus,
  RotateCcw,
  Smartphone,
  Sparkles,
  Trash2,
  Utensils,
  Volume2,
  X,
} from 'lucide-react';
import khanaLensLogo from '../assets/images/KhanaLens.png';
import tacoAvatar from '../assets/images/avatar-taco.png';
import sushiAvatar from '../assets/images/avatar-sushi.png';
import { BottomNav } from '../components/BottomNav';

// Visual mascot stickers inspired by Duolingo's mascot in the reference screenshot
function MascotBadge({ type, size = 52 }) {
  if (type === 'taco-wave') {
    return (
      <div className="kl-mascot-sticker" style={{ width: size, height: size }}>
        <img
          src={tacoAvatar}
          alt="Khana Mascot"
          className="kl-mascot-img"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        <span className="kl-mascot-wave-hand">👋</span>
      </div>
    );
  }

  if (type === 'sushi-smile') {
    return (
      <div className="kl-mascot-sticker" style={{ width: size, height: size }}>
        <img
          src={sushiAvatar}
          alt="Sushi Mascot"
          className="kl-mascot-img"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        <span className="kl-mascot-sparkle">✨</span>
      </div>
    );
  }

  if (type === 'flame-runner') {
    return (
      <div className="kl-mascot-sticker kl-mascot-flame" style={{ width: size, height: size }}>
        <div className="kl-mascot-flame-body">
          <span className="kl-mascot-flame-emoji">🔥</span>
          <span className="kl-mascot-shades">🕶️</span>
        </div>
      </div>
    );
  }

  if (type === 'water-drop') {
    return (
      <div className="kl-mascot-sticker kl-mascot-water" style={{ width: size, height: size }}>
        <div className="kl-mascot-water-body">
          <span className="kl-mascot-water-emoji">💧</span>
          <span className="kl-mascot-drop-sparkle">✨</span>
        </div>
      </div>
    );
  }

  if (type === 'salad-bowl') {
    return (
      <div className="kl-mascot-sticker kl-mascot-salad" style={{ width: size, height: size }}>
        <span className="kl-mascot-salad-emoji">🥗</span>
        <span className="kl-mascot-salad-leaf">🌱</span>
      </div>
    );
  }

  if (type === 'night-moon') {
    return (
      <div className="kl-mascot-sticker kl-mascot-night" style={{ width: size, height: size }}>
        <span className="kl-mascot-moon-emoji">🌙</span>
        <span className="kl-mascot-tea-emoji">🍵</span>
      </div>
    );
  }

  if (type === 'trophy-cup') {
    return (
      <div className="kl-mascot-sticker kl-mascot-trophy" style={{ width: size, height: size }}>
        <span className="kl-mascot-trophy-emoji">🏆</span>
        <span className="kl-mascot-star">⭐</span>
      </div>
    );
  }

  // Default Chef mascot badge
  return (
    <div className="kl-mascot-sticker" style={{ width: size, height: size }}>
      <span style={{ fontSize: size * 0.7 }}>🥑</span>
    </div>
  );
}

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'reminders',
    appName: 'KHANALENS',
    time: '3h ago',
    hook: 'Hi! I miss you.',
    body: 'Did you forget to log your lunch? Snap a quick photo with KhanaLens to keep your calorie goals on track!',
    mascot: 'taco-wave',
    actionLabel: '📸 Snap Food',
    actionRoute: '/scan',
    accentColor: '#1F4D33',
    isUnread: true,
  },
  {
    id: 'notif-2',
    category: 'reminders',
    appName: 'KHANALENS',
    time: 'Sun 12:58',
    hook: 'Hi! I miss you.',
    body: 'Do you want to scan your healthy lunch today? We already calculated 480 kcal saved this week!',
    mascot: 'taco-wave',
    actionLabel: '📸 Quick Scan',
    actionRoute: '/scan',
    accentColor: '#1F4D33',
    isUnread: true,
  },
  {
    id: 'notif-3',
    category: 'reminders',
    appName: 'KHANALENS',
    time: 'Sat 12:58',
    hook: "Hi! It's KhanaLens.",
    body: "⏰ It's time for your daily nutrition scan. Take 30 seconds now to log your meal before you dig in.",
    mascot: 'salad-bowl',
    actionLabel: '🥗 Log Meal',
    actionRoute: '/scan',
    accentColor: '#3FA47A',
    isUnread: false,
  },
  {
    id: 'notif-4',
    category: 'score',
    appName: 'KHANALENS',
    time: 'Fri 12:58',
    hook: 'Got 2 mins?',
    body: 'Ace your diet goals! Keep your 7-day Khana Score alive before midnight.',
    mascot: 'flame-runner',
    actionLabel: '🔥 Check Score',
    actionRoute: '/streak',
    accentColor: '#FF9A1F',
    isUnread: false,
  },
  {
    id: 'notif-5',
    category: 'hydration',
    appName: 'KHANALENS',
    time: 'Yesterday',
    hook: '💧 Hydration check!',
    body: "You're 650ml away from your daily goal. Drink a tall glass of water before your afternoon snack.",
    mascot: 'water-drop',
    actionLabel: '💧 +250ml Water',
    actionCustom: 'water',
    accentColor: '#2B8FE5',
    isUnread: false,
  },
  {
    id: 'notif-6',
    category: 'tips',
    appName: 'KHANALENS',
    time: '2 days ago',
    hook: 'Dinner budget: 540 kcal remaining.',
    body: "You've stayed in the green all day! Finish strong with a high-protein dinner like lentil dal or grilled chicken.",
    mascot: 'sushi-smile',
    actionLabel: '📖 Meal Ideas',
    actionRoute: '/meal-plan',
    accentColor: '#55B99C',
    isUnread: false,
  },
  {
    id: 'notif-7',
    category: 'tips',
    appName: 'KHANALENS',
    time: '3 days ago',
    hook: '🌙 Late night craving alert!',
    body: 'Heading to the kitchen? Drink a glass of warm water or herbal tea first. Mindful digestion starts at night.',
    mascot: 'night-moon',
    actionLabel: '🧘 Mindful Tip',
    actionCustom: 'tip',
    accentColor: '#7C5CBF',
    isUnread: false,
  },
  {
    id: 'notif-8',
    category: 'score',
    appName: 'KHANALENS',
    time: '4 days ago',
    hook: '🏆 Rajesh challenged your score!',
    body: 'Rajesh just achieved a 10-day streak! Check the Khana Score leaderboard and claim your spot.',
    mascot: 'trophy-cup',
    actionLabel: '⚔️ Accept Challenge',
    actionRoute: '/streak',
    accentColor: '#E6A117',
    isUnread: false,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'reminders', label: 'Meal Reminders' },
  { id: 'score', label: 'Khana Score' },
  { id: 'hydration', label: 'Hydration' },
  { id: 'tips', label: 'Diet Tips' },
];

export default function NotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('glass'); // 'glass' (KhanaLens app theme) or 'lockscreen' (iOS lockscreen sky)
  const [activeToast, setActiveToast] = useState(null);
  const [simulatedPush, setSimulatedPush] = useState(null);

  const filtered = notifications.filter(
    (n) => activeCategory === 'all' || n.category === activeCategory
  );

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const handleDismiss = (id, e) => {
    e?.stopPropagation();
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isUnread: false })));
    showToast('All notifications marked as read');
  };

  const handleResetAll = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('Notifications reset');
  };

  const handleCardClick = (notif) => {
    // mark read
    setNotifications((prev) =>
      prev.map((item) => (item.id === notif.id ? { ...item, isUnread: false } : item))
    );

    if (notif.actionRoute) {
      navigate(notif.actionRoute);
    } else if (notif.actionCustom === 'water') {
      showToast('💧 Logged 250ml water intake!');
    } else if (notif.actionCustom === 'tip') {
      showToast('🌙 Sleep well and drink water!');
    }
  };

  const showToast = (message) => {
    setActiveToast(message);
    setTimeout(() => setActiveToast(null), 3000);
  };

  const triggerSimulatedNotification = () => {
    const templates = [
      {
        appName: 'KHANALENS',
        time: 'Just now',
        hook: 'Hi! I miss you.',
        body: 'Time to log your meal! Snap a quick photo with KhanaLens.',
        mascot: 'taco-wave',
      },
      {
        appName: 'KHANALENS',
        time: 'Just now',
        hook: 'Got 2 mins?',
        body: 'Your 7-day Khana Score is waiting! Keep it glowing today 🔥',
        mascot: 'flame-runner',
      },
      {
        appName: 'KHANALENS',
        time: 'Just now',
        hook: '💧 Hydration check!',
        body: 'Take a sip of water now to boost your metabolic rate.',
        mascot: 'water-drop',
      },
    ];

    const chosen = templates[Math.floor(Math.random() * templates.length)];
    setSimulatedPush(chosen);

    // Auto add to notifications list
    const newNotif = {
      id: `push-${Date.now()}`,
      category: 'reminders',
      ...chosen,
      actionLabel: '📸 Open KhanaLens',
      actionRoute: '/scan',
      accentColor: '#1F4D33',
      isUnread: true,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    setTimeout(() => {
      setSimulatedPush(null);
    }, 4500);
  };

  return (
    <div className={`kl-page kl-notif-page kl-fade-up ${viewMode === 'lockscreen' ? 'mode-lockscreen' : 'mode-glass'}`}>
      <style>{`
        .kl-notif-page {
          width: 100%;
          min-height: 100%;
          display: flex;
          flex-direction: column;
          color: #1F4D33;
          box-sizing: border-box;
          position: relative;
        }

        /* View Mode 1: KhanaLens Liquid Glass Beige */
        .kl-notif-page.mode-glass {
          background: linear-gradient(175deg, #FDFBF7 0%, #F8F3E8 40%, #F1E9D7 100%);
        }

        /* View Mode 2: Duolingo iOS Lockscreen Sky View (matching reference image) */
        .kl-notif-page.mode-lockscreen {
          background: linear-gradient(180deg, #6FA8DC 0%, #9BC4E2 35%, #88B7DD 65%, #6699CC 100%);
          color: #1A365D;
        }

        .kl-notif-scroll-area {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 12px 16px 110px;
          -webkit-overflow-scrolling: touch;
        }

        /* Lockscreen Header Clock (When in Lock Screen mode) */
        .kl-lockscreen-clock-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 0 20px;
          color: #FFFFFF;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          animation: fade-down 0.4s ease;
        }
        .kl-lockscreen-date {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.2px;
          opacity: 0.95;
        }
        .kl-lockscreen-time {
          font-size: 64px;
          font-weight: 300;
          letter-spacing: -2px;
          line-height: 1;
          margin-top: 2px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Google Sans', sans-serif;
        }

        /* Standard App Header */
        .kl-notif-app-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px 8px;
        }
        .kl-notif-nav-btn {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(31, 77, 51, 0.12);
          color: #1F4D33;
          box-shadow: 0 4px 12px rgba(31, 77, 51, 0.08);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .kl-notif-nav-btn:hover {
          transform: translateY(-2px);
        }
        .kl-notif-nav-btn:active {
          transform: scale(0.96);
        }

        .kl-notif-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .kl-notif-title-wrap h1 {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.4px;
          margin: 0;
          color: #1F4D33;
        }
        .mode-lockscreen .kl-notif-title-wrap h1 {
          color: #FFFFFF;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .kl-notif-badge-pill {
          background: #FF3B30;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 999px;
          box-shadow: 0 2px 6px rgba(255, 59, 48, 0.35);
        }

        /* Top Controls Banner (Simulator & View Mode Toggle) */
        .kl-notif-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 14px;
          padding: 10px 14px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 14px rgba(31, 77, 51, 0.05);
        }
        .mode-lockscreen .kl-notif-controls {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.45);
          color: #FFFFFF;
        }

        .kl-sim-push-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          color: #FFFFFF;
          background: linear-gradient(135deg, #1F4D33 0%, #163D29 100%);
          border: none;
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(31, 77, 51, 0.25);
          transition: transform 0.15s ease;
        }
        .kl-sim-push-btn:hover {
          transform: translateY(-1px);
        }

        .kl-view-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          color: #1F4D33;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(31, 77, 51, 0.15);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        /* Filter Pills */
        .kl-notif-filters {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 2px 0 14px;
          scrollbar-width: none;
        }
        .kl-notif-filters::-webkit-scrollbar {
          display: none;
        }
        .kl-filter-chip {
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          border: 1px solid rgba(31, 77, 51, 0.12);
          background: rgba(255, 255, 255, 0.7);
          color: rgba(31, 77, 51, 0.8);
          transition: all 0.2s ease;
        }
        .mode-lockscreen .kl-filter-chip {
          background: rgba(255, 255, 255, 0.4);
          color: #1A365D;
          border-color: rgba(255, 255, 255, 0.5);
        }
        .kl-filter-chip.active {
          background: #1F4D33;
          color: #FFFFFF;
          border-color: #1F4D33;
          box-shadow: 0 3px 10px rgba(31, 77, 51, 0.22);
        }
        .mode-lockscreen .kl-filter-chip.active {
          background: #FFFFFF;
          color: #1A365D;
          border-color: #FFFFFF;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
        }

        /* Notification Stack (Authentic Duolingo iOS Lockscreen Style) */
        .kl-notif-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Frosted Glass Notification Card */
        .kl-notif-card {
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(24px) saturate(190%);
          -webkit-backdrop-filter: blur(24px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.88);
          box-shadow:
            0 8px 24px -4px rgba(31, 77, 51, 0.08),
            0 2px 6px -1px rgba(31, 77, 51, 0.04),
            inset 0 1px 1px rgba(255, 255, 255, 0.95);
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease, opacity 0.2s ease;
          overflow: hidden;
        }
        .kl-notif-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 12px 28px -4px rgba(31, 77, 51, 0.12),
            0 3px 8px -1px rgba(31, 77, 51, 0.06),
            inset 0 1px 1px rgba(255, 255, 255, 0.95);
        }
        .kl-notif-card:active {
          transform: scale(0.985);
        }

        /* Lockscreen card specific style matching reference screenshot */
        .mode-lockscreen .kl-notif-card {
          background: rgba(235, 245, 255, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.85);
          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.12),
            0 2px 8px rgba(0, 0, 0, 0.06),
            inset 0 1px 1px rgba(255, 255, 255, 0.9);
        }

        .kl-notif-card.unread::after {
          content: '';
          position: absolute;
          top: 14px;
          left: 6px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #1F4D33;
        }
        .mode-lockscreen .kl-notif-card.unread::after {
          background: #2554D7;
        }

        /* Notification Content Block */
        .kl-notif-main-col {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        /* Top Header: App icon + KHANALENS + timestamp */
        .kl-notif-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 2px;
        }
        .kl-notif-app-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .kl-notif-app-icon {
          width: 19px;
          height: 19px;
          border-radius: 5px;
          object-fit: cover;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
        }
        .kl-notif-app-name {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          color: rgba(31, 77, 51, 0.75);
        }
        .mode-lockscreen .kl-notif-app-name {
          color: #3b5998;
          opacity: 0.9;
        }
        .kl-notif-timestamp {
          font-size: 11.5px;
          font-weight: 500;
          color: rgba(31, 77, 51, 0.65);
        }
        .mode-lockscreen .kl-notif-timestamp {
          color: #3b5998;
          opacity: 0.85;
        }

        /* Hook & Body */
        .kl-notif-hook {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.2px;
          color: #143522;
          line-height: 1.25;
          margin: 0;
        }
        .mode-lockscreen .kl-notif-hook {
          color: #0F172A;
        }

        .kl-notif-body {
          font-size: 13.5px;
          line-height: 1.38;
          color: rgba(20, 53, 34, 0.82);
          margin: 0;
          letter-spacing: -0.15px;
        }
        .mode-lockscreen .kl-notif-body {
          color: #1E293B;
        }

        /* Quick Action Bar under card */
        .kl-notif-quick-action {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 6px;
          align-self: flex-start;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          background: rgba(31, 77, 51, 0.08);
          color: #1F4D33;
          border: 1px solid rgba(31, 77, 51, 0.12);
          transition: background 0.15s ease;
        }
        .kl-notif-quick-action:hover {
          background: rgba(31, 77, 51, 0.15);
        }

        /* Mascot Sticker on the right (Duolingo Owl equivalent) */
        .kl-notif-mascot-col {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 4px;
        }

        .kl-mascot-sticker {
          position: relative;
          display: grid;
          place-items: center;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12));
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .kl-notif-card:hover .kl-mascot-sticker {
          transform: scale(1.1) rotate(3deg);
        }

        .kl-mascot-wave-hand {
          position: absolute;
          top: -2px;
          right: -4px;
          font-size: 16px;
          animation: wave-hand 1.4s infinite ease-in-out;
        }

        @keyframes wave-hand {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(18deg); }
        }

        .kl-mascot-flame {
          font-size: 38px;
          line-height: 1;
        }
        .kl-mascot-flame-body {
          position: relative;
          display: inline-block;
        }
        .kl-mascot-flame-emoji {
          display: block;
          filter: drop-shadow(0 4px 6px rgba(255, 154, 31, 0.4));
        }
        .kl-mascot-shades {
          position: absolute;
          top: 10px;
          left: 5px;
          font-size: 16px;
        }

        .kl-mascot-water {
          font-size: 36px;
          position: relative;
        }
        .kl-mascot-drop-sparkle {
          position: absolute;
          top: -2px;
          right: -2px;
          font-size: 14px;
        }

        .kl-mascot-salad {
          font-size: 36px;
          position: relative;
        }
        .kl-mascot-salad-leaf {
          position: absolute;
          top: -2px;
          right: -2px;
          font-size: 14px;
        }

        .kl-mascot-night {
          font-size: 34px;
          position: relative;
        }
        .kl-mascot-tea-emoji {
          position: absolute;
          bottom: -4px;
          right: -4px;
          font-size: 16px;
        }

        .kl-mascot-trophy {
          font-size: 36px;
          position: relative;
        }
        .kl-mascot-star {
          position: absolute;
          top: -4px;
          right: -2px;
          font-size: 14px;
        }

        /* Dismiss Button */
        .kl-notif-dismiss-btn {
          opacity: 0;
          position: absolute;
          top: 8px;
          right: 8px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.08);
          border: none;
          display: grid;
          place-items: center;
          color: #555;
          cursor: pointer;
          transition: opacity 0.15s ease, background 0.15s ease;
        }
        .kl-notif-card:hover .kl-notif-dismiss-btn {
          opacity: 1;
        }
        .kl-notif-dismiss-btn:hover {
          background: rgba(0, 0, 0, 0.2);
          color: #000;
        }

        /* Simulated Live Push Banner (Slides down from top) */
        .kl-live-push-banner {
          position: fixed;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 390px;
          z-index: 9999;
          animation: slide-push-down 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slide-push-down {
          from {
            opacity: 0;
            transform: translate(-50%, -40px) scale(0.94);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }

        .kl-live-push-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(28px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.95);
          cursor: pointer;
        }

        /* Toast feedback */
        .kl-notif-toast {
          position: fixed;
          bottom: 115px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(22, 61, 41, 0.95);
          backdrop-filter: blur(12px);
          color: #FFFFFF;
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          z-index: 9000;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: pop-up 0.2s ease;
        }
        @keyframes pop-up {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        /* Empty State */
        .kl-notif-empty {
          text-align: center;
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .kl-notif-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 22px;
          background: rgba(31, 77, 51, 0.08);
          display: grid;
          place-items: center;
          color: #1F4D33;
        }
      `}</style>

      {/* Simulated Live iOS Drop-down Push Banner */}
      {simulatedPush && (
        <div
          className="kl-live-push-banner"
          onClick={() => {
            setSimulatedPush(null);
            navigate('/scan');
          }}
          role="alert"
        >
          <div className="kl-live-push-card">
            <img src={khanaLensLogo} alt="KhanaLens" className="kl-notif-app-icon" style={{ width: 34, height: 34, borderRadius: 9 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: '#1F4D33' }}>KHANALENS</span>
                <span style={{ fontSize: 11, color: '#666' }}>now</span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#111' }}>{simulatedPush.hook}</div>
              <div style={{ fontSize: 12, color: '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {simulatedPush.body}
              </div>
            </div>
            <MascotBadge type={simulatedPush.mascot} size={42} />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {activeToast && (
        <div className="kl-notif-toast">
          <Sparkles size={16} />
          <span>{activeToast}</span>
        </div>
      )}

      {/* Header */}
      <header className="kl-notif-app-header">
        <button
          type="button"
          className="kl-notif-nav-btn"
          onClick={() => navigate('/home')}
          aria-label="Back to home"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="kl-notif-title-wrap">
          <h1>Notifications</h1>
          {unreadCount > 0 && <span className="kl-notif-badge-pill">{unreadCount}</span>}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            className="kl-notif-nav-btn"
            onClick={handleMarkAllRead}
            title="Mark all as read"
            aria-label="Mark all read"
          >
            <Check size={18} />
          </button>
          <button
            type="button"
            className="kl-notif-nav-btn"
            onClick={handleResetAll}
            title="Reset demo notifications"
            aria-label="Reset notifications"
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </header>

      <div className="kl-notif-scroll-area">
        {/* Lockscreen aesthetic Header if user switched to Lockscreen mode */}
        {viewMode === 'lockscreen' && (
          <div className="kl-lockscreen-clock-header">
            <span className="kl-lockscreen-date">Tuesday, October 15</span>
            <span className="kl-lockscreen-time">12:58</span>
          </div>
        )}

        {/* Top Controls: Trigger Live Simulation & View Mode Toggle */}
        <div className="kl-notif-controls">
          <button
            type="button"
            className="kl-sim-push-btn"
            onClick={triggerSimulatedNotification}
          >
            <Bell size={14} />
            <span>Test Live Notification</span>
          </button>

          <button
            type="button"
            className="kl-view-toggle-btn"
            onClick={() => setViewMode((prev) => (prev === 'glass' ? 'lockscreen' : 'glass'))}
            title="Toggle between KhanaLens Beige Glass and iOS Lockscreen Look"
          >
            <Smartphone size={13} />
            <span>{viewMode === 'glass' ? 'Lockscreen View' : 'App View'}</span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="kl-notif-filters">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? notifications.length
                : notifications.filter((n) => n.category === cat.id).length;

            return (
              <button
                type="button"
                key={cat.id}
                className={`kl-filter-chip ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Notifications Stack (Duolingo iOS style) */}
        {filtered.length === 0 ? (
          <div className="kl-notif-empty">
            <div className="kl-notif-empty-icon">
              <Bell size={28} />
            </div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>All Caught Up!</h3>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
              No notifications in this category. You're doing amazing on your diet goals!
            </p>
            <button
              type="button"
              className="kl-sim-push-btn"
              onClick={handleResetAll}
              style={{ marginTop: 8 }}
            >
              Restore Notifications
            </button>
          </div>
        ) : (
          <div className="kl-notif-stack">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`kl-notif-card ${item.isUnread ? 'unread' : ''}`}
                onClick={() => handleCardClick(item)}
                role="button"
                tabIndex={0}
              >
                {/* Dismiss button on hover */}
                <button
                  type="button"
                  className="kl-notif-dismiss-btn"
                  onClick={(e) => handleDismiss(item.id, e)}
                  aria-label="Dismiss notification"
                  title="Dismiss"
                >
                  <X size={13} />
                </button>

                {/* Left/Center Column: Header + Hook + Body */}
                <div className="kl-notif-main-col">
                  {/* Top Header Row: Logo + App Name + Timestamp */}
                  <div className="kl-notif-header-row">
                    <div className="kl-notif-app-badge">
                      <img
                        src={khanaLensLogo}
                        alt="KhanaLens icon"
                        className="kl-notif-app-icon"
                      />
                      <span className="kl-notif-app-name">{item.appName}</span>
                    </div>
                    <span className="kl-notif-timestamp">{item.time}</span>
                  </div>

                  {/* Notification Headline/Hook */}
                  <h2 className="kl-notif-hook">{item.hook}</h2>

                  {/* Body text */}
                  <p className="kl-notif-body">{item.body}</p>

                  {/* Quick Action Pill */}
                  {item.actionLabel && (
                    <div className="kl-notif-quick-action">
                      <span>{item.actionLabel}</span>
                      <ChevronRight size={12} />
                    </div>
                  )}
                </div>

                {/* Right Column: Cute Duolingo-style Mascot Sticker */}
                <div className="kl-notif-mascot-col">
                  <MascotBadge type={item.mascot} size={50} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation Dock */}
      <BottomNav active="home" />
    </div>
  );
}
