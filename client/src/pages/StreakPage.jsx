import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Check,
  ChevronRight,
  Copy,
  Crown,
  Flame,
  Medal,
  Share2,
  Sparkles,
  Swords,
  Trophy,
  Users,
  Utensils,
  Zap,
} from 'lucide-react';
import AppHeader from '../components/AppHeader';
import { BottomNav } from '../components/BottomNav';
import { calculateStreak, currentWeek, dayCounts, getStreakData } from '../data/streak';
import { getProfileApi } from '../services/api';
import { Avatar, PEOPLE_AVATARS } from '../components/Avatar';

export default function StreakPage() {
  const navigate = useNavigate();
  const [streakData, setStreakData] = useState({ streak: 0, days: [], week: [] });
  const [avatar, setAvatar] = useState(null);
  const [userName, setUserName] = useState('You');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('score'); // 'score' | 'dashboard'
  const [copiedChallenge, setCopiedChallenge] = useState(false);
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getProfileApi()
      .then((res) => {
        if (isMounted) {
          setAvatar(res?.data?.data?.avatar);
          if (res?.data?.data?.name) setUserName(res.data.data.name);
        }
      })
      .catch(() => {});

    getStreakData()
      .then((data) => {
        if (isMounted) {
          setStreakData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const streak = streakData.streak;
  const khanaScore = Math.max(streak, 1) * 100 + ((streakData.days || []).length * 15);

  const weekDays = useMemo(() => {
    return streakData.week.length > 0 ? streakData.week : currentWeek(streakData.days);
  }, [streakData]);

  // Milestone Achievements definition
  const MILESTONES = useMemo(() => {
    return [
      {
        id: 'streak-3',
        title: '3-Day Streak',
        desc: 'Build your initial eating habit',
        target: 3,
        current: Math.min(streak, 3),
        unlocked: streak >= 3,
        congrat: 'Well done! 3 days unlocked 🎉',
        icon: Flame,
        color: '#FF9A1F',
        badge: '+50 pts',
      },
      {
        id: 'streak-7',
        title: '7-Day Streak · Well done!',
        desc: 'Log meals for 7 consecutive days',
        target: 7,
        current: Math.min(streak, 7),
        unlocked: streak >= 7,
        congrat: '7 Days Streak! Well done! 🌟',
        icon: Trophy,
        color: '#E05A36',
        badge: '+150 pts',
      },
      {
        id: 'streak-14',
        title: '14-Day Consistency',
        desc: 'Two solid weeks of healthy eating',
        target: 14,
        current: Math.min(streak, 14),
        unlocked: streak >= 14,
        congrat: '14 Days! Well done! Unstoppable ⚡',
        icon: Zap,
        color: '#2554D7',
        badge: '+300 pts',
      },
      {
        id: 'streak-30',
        title: '30-Day Nutrition Legend',
        desc: 'Full month of mindful tracking',
        target: 30,
        current: Math.min(streak, 30),
        unlocked: streak >= 30,
        congrat: '30 Days Champion! Well done! 👑',
        icon: Crown,
        color: '#8B5CF6',
        badge: '+1,000 pts',
      },
      {
        id: 'meals-5',
        title: 'Food Explorer',
        desc: 'Scan & track 5 nutritious meals',
        target: 5,
        current: Math.min((streakData.days || []).length, 5),
        unlocked: (streakData.days || []).length >= 1, // sample unlock
        congrat: 'Well done! Meals logged 🥗',
        icon: Utensils,
        color: '#1F4D33',
        badge: '+75 pts',
      },
    ];
  }, [streak, streakData.days]);

  // Leaderboard data with real People Avatars for Challenge Friends Dashboard
  const LEADERBOARD = useMemo(() => {
    const person1 = PEOPLE_AVATARS[0]?.src || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80';
    const person2 = PEOPLE_AVATARS[1]?.src || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80';
    const person3 = PEOPLE_AVATARS[2]?.src || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80';
    const person4 = PEOPLE_AVATARS[3]?.src || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80';

    return [
      {
        rank: 1,
        name: 'Aarav Sharma',
        score: 350,
        streak: 9,
        badge: '🥇 Leader',
        avatarSrc: person1,
        avatarId: PEOPLE_AVATARS[0]?.id || '1',
        isMe: false,
      },
      {
        rank: 2,
        name: userName || 'You',
        score: khanaScore,
        streak: streak,
        badge: '🥈 Rank #2',
        avatarSrc: null,
        avatarId: avatar,
        isMe: true,
      },
      {
        rank: 3,
        name: 'Pooja Thapa',
        score: 220,
        streak: 5,
        badge: '🥉 Rank #3',
        avatarSrc: person2,
        avatarId: PEOPLE_AVATARS[1]?.id || '2',
        isMe: false,
      },
      {
        rank: 4,
        name: 'Rohan Shrestha',
        score: 160,
        streak: 4,
        badge: 'Rank #4',
        avatarSrc: person3,
        avatarId: PEOPLE_AVATARS[2]?.id || '3',
        isMe: false,
      },
      {
        rank: 5,
        name: 'Simran Gurung',
        score: 90,
        streak: 2,
        badge: 'Rank #5',
        avatarSrc: person4,
        avatarId: PEOPLE_AVATARS[3]?.id || '4',
        isMe: false,
      },
    ].sort((a, b) => b.score - a.score).map((user, idx) => ({ ...user, rank: idx + 1 }));
  }, [userName, khanaScore, streak, avatar]);

  const [copied, setCopied] = useState(false);

  const bottomMessage = useMemo(() => {
    if (streak === 0) return 'Log a meal today to start your Khana Score!';
    if (streak < 7) return 'Great start! Keep going tomorrow to reach 7 days streak!';
    return 'Amazing consistency! 7-day milestone achieved. Well done!';
  }, [streak]);

  const handleShare = async () => {
    const text = `🔥 My Khana Score is ${khanaScore} pts (${streak}-day streak) on KhanaLens! Can you beat my score?`;
    const shareUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KhanaLens Khana Score Challenge',
          text,
          url: shareUrl,
        });
        return;
      } catch (err) {}
    }

    try {
      await navigator.clipboard.writeText(`${text} 👉 ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {}
  };

  const handleChallengeFriend = async () => {
    const challengeText = `⚔️ ${userName} challenged you to a 7-Day Healthy Eating Duel on KhanaLens! Join the challenge: ${window.location.origin}/streak`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KhanaLens 7-Day Challenge',
          text: challengeText,
          url: window.location.origin,
        });
        return;
      } catch (err) {}
    }
    try {
      await navigator.clipboard.writeText(challengeText);
      setCopiedChallenge(true);
      setTimeout(() => setCopiedChallenge(false), 2500);
    } catch (err) {}
  };

  return (
    <div className="kl-page streak-page-viewport kl-fade-up">
      <style>{`
        .streak-page-viewport,
        .streak-page-viewport * {
          font-family: var(--kl-font) !important;
        }

        .streak-page-viewport {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: transparent;
        }

        .streak-page-scroll {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          padding: 0 16px 110px; /* generous bottom padding so nav never overlaps achievements */
          box-sizing: border-box;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .streak-page-scroll::-webkit-scrollbar {
          display: none;
        }

        /* Hero Section */
        .streak-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 16px 14px;
          text-align: center;
        }

        .streak-flame-container {
          position: relative;
          width: 140px;
          height: 150px;
          display: grid;
          place-items: center;
          filter: drop-shadow(0 14px 28px rgba(255, 154, 31, 0.35));
          animation: float-soft 3s ease-in-out infinite;
        }

        @keyframes float-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .streak-flame-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .streak-number-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 28px;
          font-size: 48px;
          font-weight: 900;
          color: #FFFFFF;
          text-shadow: 0 3px 8px rgba(180, 70, 0, 0.45);
          letter-spacing: -1.5px;
          line-height: 1;
        }

        .streak-title-badge {
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(255, 154, 31, 0.15), rgba(224, 90, 54, 0.15));
          border: 1px solid rgba(255, 154, 31, 0.3);
          color: #E05A36;
          font-size: 19px;
          font-weight: 850;
          letter-spacing: -0.4px;
        }

        .streak-subtitle {
          margin: 6px 0 0;
          font-size: 12px;
          color: rgba(31, 77, 51, 0.75);
          font-weight: 600;
        }

        /* Top Segmented Controls: My Score vs Challenge Friends Dashboard */
        .streak-view-toggle {
          display: flex;
          padding: 4px;
          background: rgba(31, 77, 51, 0.08);
          border-radius: 999px;
          border: 1px solid rgba(31, 77, 51, 0.12);
          margin: 14px 0 16px;
          gap: 4px;
        }

        .streak-toggle-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 0;
          background: transparent;
          color: rgba(31, 77, 51, 0.7);
          font-size: 12.5px;
          font-weight: 750;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .streak-toggle-btn.active {
          background: #FFFFFF;
          color: #1F4D33;
          box-shadow: 0 4px 12px rgba(31, 77, 51, 0.12);
        }

        /* Week Strip Card */
        .streak-card {
          padding: 16px 14px;
          border-radius: var(--kl-radius-card);
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(31, 77, 51, 0.12);
          box-shadow: inset 0 1px 0 #FFFFFF, 0 10px 24px rgba(31, 77, 51, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .streak-week-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .streak-day-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .streak-day-label {
          font-size: 11px;
          font-weight: 700;
          color: rgba(31, 77, 51, 0.65);
        }
        .streak-day-label.today {
          color: #FF9A1F;
          font-weight: 800;
        }

        .streak-day-pill {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
          box-sizing: border-box;
        }

        .streak-day-pill.done {
          background: linear-gradient(135deg, #FFB347 0%, #FF9A1F 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 10px rgba(255, 154, 31, 0.35);
        }

        .streak-day-pill.today-pending {
          border: 2px dashed #FF9A1F;
          background: rgba(255, 154, 31, 0.1);
          color: #FF9A1F;
        }

        .streak-day-pill.missed {
          background: rgba(233, 220, 195, 0.5);
          border: 1px solid rgba(31, 77, 51, 0.12);
        }

        .streak-day-pill.future {
          background: rgba(220, 225, 222, 0.35);
          border: 1px solid rgba(31, 77, 51, 0.08);
        }

        .streak-card-divider {
          height: 1px;
          background: rgba(31, 77, 51, 0.1);
          margin: 14px 0 10px;
        }

        .streak-card-footer-note {
          text-align: center;
          font-size: 12.5px;
          font-weight: 650;
          color: #1F4D33;
          margin: 0;
        }

        /* Challenge Friends Card & Action */
        .challenge-action-card {
          margin-top: 14px;
          padding: 16px;
          border-radius: var(--kl-radius-card-sm);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(247, 241, 228, 0.85) 100%);
          border: 1px solid rgba(255, 154, 31, 0.28);
          box-shadow: 0 10px 24px rgba(255, 154, 31, 0.08);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .challenge-action-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .challenge-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, #FF8C42 0%, #E05A36 100%);
          color: #FFFFFF;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(224, 90, 54, 0.3);
        }

        .challenge-action-title strong {
          display: block;
          font-size: 14px;
          font-weight: 800;
          color: #1F4D33;
          letter-spacing: -0.2px;
        }

        .challenge-action-title span {
          display: block;
          font-size: 11.5px;
          color: rgba(31, 77, 51, 0.72);
          margin-top: 2px;
        }

        .challenge-action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .btn-challenge-primary {
          height: 42px;
          border-radius: var(--kl-radius-btn);
          border: 0;
          background: linear-gradient(135deg, #FF9A1F 0%, #E05A36 100%);
          color: #FFFFFF;
          font-size: 12.5px;
          font-weight: 750;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(255, 154, 31, 0.3);
          transition: transform 0.15s ease;
        }
        .btn-challenge-primary:hover {
          transform: translateY(-1.5px);
        }

        .btn-challenge-secondary {
          height: 42px;
          border-radius: var(--kl-radius-btn);
          border: 1px solid rgba(31, 77, 51, 0.18);
          background: #FFFFFF;
          color: #1F4D33;
          font-size: 12.5px;
          font-weight: 750;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .btn-challenge-secondary:hover {
          transform: translateY(-1.5px);
        }

        /* Active Duel Box - Light Cream Glass Theme (No Dark Tones) */
        .active-duel-banner {
          margin-top: 14px;
          padding: 16px;
          border-radius: var(--kl-radius-card);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 243, 232, 0.88) 100%);
          border: 1px solid rgba(255, 154, 31, 0.28);
          box-shadow: 0 10px 24px rgba(255, 154, 31, 0.08);
          color: #1F4D33;
          position: relative;
          overflow: hidden;
        }

        .duel-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: linear-gradient(135deg, rgba(255, 154, 31, 0.15), rgba(224, 90, 54, 0.15));
          color: #E05A36;
          border: 1px solid rgba(255, 154, 31, 0.3);
          padding: 4px 10px;
          border-radius: 999px;
          margin-bottom: 12px;
        }

        .duel-matchup {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .duel-player {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .duel-player strong {
          display: block;
          font-size: 13.5px;
          font-weight: 800;
          color: #1F4D33;
        }

        .duel-player span {
          display: block;
          font-size: 11px;
          color: rgba(31, 77, 51, 0.7);
        }

        .duel-vs {
          font-size: 12px;
          font-weight: 900;
          color: #E05A36;
          background: linear-gradient(135deg, #FFF0DC, #FFE0B2);
          border: 1px solid rgba(255, 154, 31, 0.3);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          box-shadow: 0 2px 8px rgba(255, 154, 31, 0.15);
        }

        .duel-bar-wrap {
          height: 8px;
          border-radius: 999px;
          background: rgba(31, 77, 51, 0.08);
          border: 1px solid rgba(31, 77, 51, 0.1);
          overflow: hidden;
          position: relative;
        }

        .duel-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #FFB347, #3FA47A);
          width: 58%;
        }

        .duel-footer-text {
          margin: 9px 0 0;
          font-size: 11.5px;
          color: rgba(31, 77, 51, 0.75);
          font-weight: 600;
          text-align: center;
        }

        /* Leaderboard table */
        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }

        .leaderboard-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(31, 77, 51, 0.1);
          transition: transform 0.15s ease;
        }

        .leaderboard-item.is-me {
          background: linear-gradient(135deg, rgba(232, 245, 239, 0.95), rgba(255, 255, 255, 0.9));
          border: 1.5px solid #3FA47A;
          box-shadow: 0 4px 12px rgba(63, 164, 122, 0.15);
        }

        .leaderboard-rank {
          font-size: 14px;
          font-weight: 900;
          color: #1F4D33;
          width: 20px;
          text-align: center;
        }

        .leaderboard-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #E8F5EF;
          flex-shrink: 0;
          overflow: hidden;
          border: 1.5px solid rgba(31, 77, 51, 0.15);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .leaderboard-avatar img,
        .leaderboard-avatar .people-avatar,
        .leaderboard-avatar .food-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
        }

        .duel-avatar-wrap {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #E8F5EF;
          border: 2px solid rgba(255, 154, 31, 0.35);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }

        .duel-avatar-wrap img,
        .duel-avatar-wrap .people-avatar,
        .duel-avatar-wrap .food-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
        }

        .leaderboard-info {
          flex: 1;
        }

        .leaderboard-info strong {
          display: block;
          font-size: 13px;
          color: #1F4D33;
        }

        .leaderboard-info span {
          display: block;
          font-size: 10.5px;
          color: rgba(31, 77, 51, 0.65);
        }

        .leaderboard-score-tag {
          text-align: right;
        }

        .leaderboard-score-tag strong {
          display: block;
          font-size: 14px;
          font-weight: 850;
          color: #FF9A1F;
        }

        .leaderboard-score-tag small {
          font-size: 10px;
          color: rgba(31, 77, 51, 0.6);
        }

        /* Achievements Section ("like 7 days well done etc") */
        .streak-section-title {
          margin: 22px 0 10px;
          font-size: 15px;
          font-weight: 750;
          color: #1F4D33;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .streak-milestones-grid {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .milestone-card {
          padding: 12px 14px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(31, 77, 51, 0.1);
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: transform 0.15s ease;
        }

        .milestone-card.unlocked {
          border-color: rgba(63, 164, 122, 0.35);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(238, 250, 243, 0.85) 100%);
          box-shadow: 0 4px 14px rgba(63, 164, 122, 0.1);
        }

        .milestone-top-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .milestone-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          color: #FFFFFF;
        }

        .milestone-info {
          flex: 1;
        }

        .milestone-info strong {
          display: block;
          font-size: 13.5px;
          font-weight: 800;
          color: #1F4D33;
        }

        .milestone-info p {
          margin: 1px 0 0;
          font-size: 11px;
          color: rgba(31, 77, 51, 0.68);
        }

        .milestone-status-pill {
          padding: 4px 9px;
          border-radius: 999px;
          font-size: 10.5px;
          font-weight: 800;
          white-space: nowrap;
        }

        .milestone-status-pill.done {
          background: #E8F5EF;
          color: #1F4D33;
          border: 1px solid rgba(31, 77, 51, 0.15);
        }

        .milestone-status-pill.progress {
          background: rgba(255, 154, 31, 0.12);
          color: #D67115;
          border: 1px solid rgba(255, 154, 31, 0.2);
        }

        .milestone-progress-bar-wrap {
          height: 5px;
          border-radius: 999px;
          background: rgba(31, 77, 51, 0.08);
          overflow: hidden;
        }

        .milestone-progress-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #3FA47A, #1F4D33);
        }
      `}</style>

      <div className="streak-page-scroll">
        <AppHeader
          avatar={avatar}
          streak={streak}
          showBack={true}
          backTo="/home"
        />

        {/* Hero Section: Named Khana Score */}
        <div className="streak-hero">
          <div className="streak-flame-container">
            <svg
              viewBox="0 0 100 110"
              className="streak-flame-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 0C50 0 58 18 64 26C74 38 88 52 88 72C88 93 71 110 50 110C29 110 12 93 12 72C12 56 22 42 32 30C36 25 40 18 42 10C42 10 46 20 46 24C46 32 40 40 40 46C40 52 44 56 50 56C58 56 64 48 64 38C64 24 50 0 50 0Z"
                fill="url(#outerFlameGrad)"
              />
              <path
                d="M50 42C50 42 56 54 60 60C66 69 74 77 74 88C74 100 63 108 50 108C37 108 26 100 26 88C26 77 34 68 40 60C44 54 48 48 50 42Z"
                fill="url(#innerFlameGrad)"
              />
              <defs>
                <linearGradient id="outerFlameGrad" x1="50" y1="0" x2="50" y2="110" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFB347" />
                  <stop offset="0.5" stopColor="#FF9A1F" />
                  <stop offset="1" stopColor="#E05A36" />
                </linearGradient>
                <linearGradient id="innerFlameGrad" x1="50" y1="42" x2="50" y2="108" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFF275" />
                  <stop offset="0.6" stopColor="#FFC93C" />
                  <stop offset="1" stopColor="#FF9A1F" />
                </linearGradient>
              </defs>
            </svg>

            {/* Streak Number */}
            <div className="streak-number-overlay">
              {streak}
            </div>
          </div>

          <div className="streak-title-badge">
            <Flame size={20} />
            <span>Khana Score: {khanaScore} pts</span>
          </div>
          <p className="streak-subtitle">
            {streak}-day consecutive healthy habit streak
          </p>
        </div>

        {/* View Toggle: My Khana Score vs Challenge Friends Dashboard */}
        <div className="streak-view-toggle" role="group" aria-label="Khana Score View">
          <button
            type="button"
            className={`streak-toggle-btn ${activeTab === 'score' ? 'active' : ''}`}
            onClick={() => setActiveTab('score')}
          >
            <Flame size={15} />
            <span>My Khana Score</span>
          </button>
          <button
            type="button"
            className={`streak-toggle-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Users size={15} />
            <span>Friends Dashboard</span>
          </button>
        </div>

        {activeTab === 'score' ? (
          <>
            {/* Current Week Day Tracker */}
            <section className="streak-card">
              <div className="streak-week-strip">
                {weekDays.map((day) => {
                  return (
                    <div key={day.key} className="streak-day-col">
                      <span className={`streak-day-label ${day.isToday ? 'today' : ''}`}>
                        {day.label}
                      </span>
                      <div
                        className={`streak-day-pill ${
                          day.done
                            ? 'done'
                            : day.isToday
                            ? 'today-pending'
                            : day.isFuture
                            ? 'future'
                            : 'missed'
                        }`}
                      >
                        {day.done ? (
                          <Check size={18} strokeWidth={3} />
                        ) : day.isToday ? (
                          <Sparkles size={14} />
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="streak-card-divider" />

              <p className="streak-card-footer-note">
                {bottomMessage}
              </p>
            </section>

            {/* Milestone Achievements ("like 7 days well done etc") */}
            <h3 className="streak-section-title">
              <Medal size={17} color="#FF9A1F" />
              Khana Score Achievements
            </h3>

            <div className="streak-milestones-grid">
              {MILESTONES.map((item) => {
                const Icon = item.icon;
                const progressPct = Math.min(100, Math.round((item.current / item.target) * 100));

                return (
                  <div
                    key={item.id}
                    className={`milestone-card ${item.unlocked ? 'unlocked' : ''}`}
                  >
                    <div className="milestone-top-row">
                      <div
                        className="milestone-icon-wrap"
                        style={{
                          background: item.unlocked
                            ? `linear-gradient(135deg, ${item.color}, #1F4D33)`
                            : 'rgba(31, 77, 51, 0.12)',
                          color: item.unlocked ? '#FFFFFF' : '#1F4D33',
                        }}
                      >
                        <Icon size={19} />
                      </div>
                      <div className="milestone-info">
                        <strong>{item.title}</strong>
                        <p>{item.unlocked ? item.congrat : item.desc}</p>
                      </div>
                      <span
                        className={`milestone-status-pill ${item.unlocked ? 'done' : 'progress'}`}
                      >
                        {item.unlocked ? 'Well done! ✓' : `${item.current}/${item.target}`}
                      </span>
                    </div>

                    <div className="milestone-progress-bar-wrap">
                      <div
                        className="milestone-progress-bar-fill"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Challenge Friends - Placed at the very end of My Khana Score tab */}
            <section className="challenge-action-card">
              <div className="challenge-action-header">
                <div className="challenge-icon-box">
                  <Swords size={22} />
                </div>
                <div className="challenge-action-title">
                  <strong>Challenge Friends & Compare Scores</strong>
                  <span>Compete on meal consistency and boost each other's score</span>
                </div>
              </div>
              <div className="challenge-action-buttons">
                <button
                  type="button"
                  className="btn-challenge-primary"
                  onClick={handleChallengeFriend}
                >
                  <Swords size={16} />
                  <span>{copiedChallenge ? 'Link Copied! ✓' : 'Challenge a Friend'}</span>
                </button>
                <button
                  type="button"
                  className="btn-challenge-secondary"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <Trophy size={16} />
                  <span>View Dashboard</span>
                </button>
              </div>
            </section>
          </>
        ) : (
          /* Friends Challenge Dashboard View */
          <>
            {/* Active Challenge Duel - Light Cream Glass Card */}
            <div className="active-duel-banner">
              <div className="duel-badge">
                <Swords size={13} />
                <span>Active 7-Day Healthy Eating Duel</span>
              </div>
              <div className="duel-matchup">
                <div className="duel-player">
                  <div className="duel-avatar-wrap">
                    <Avatar avatar={avatar} alt="You" />
                  </div>
                  <div>
                    <strong>{userName} (You)</strong>
                    <span>{khanaScore} pts · {streak}d streak</span>
                  </div>
                </div>
                <div className="duel-vs">VS</div>
                <div className="duel-player" style={{ textAlign: 'right' }}>
                  <div>
                    <strong>Aarav Sharma</strong>
                    <span>350 pts · 9d streak</span>
                  </div>
                  <div className="duel-avatar-wrap">
                    <img
                      src={PEOPLE_AVATARS[0]?.src || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80'}
                      alt="Aarav Sharma"
                      className="people-avatar"
                    />
                  </div>
                </div>
              </div>
              <div className="duel-bar-wrap">
                <div className="duel-bar-fill" />
              </div>
              <p className="duel-footer-text">
                Day 4 of 7 · Keep logging meals to hold the rank!
              </p>
            </div>

            {/* Friends Leaderboard Dashboard - Placed before Challenge action */}
            <h3 className="streak-section-title">
              <Trophy size={17} color="#FF9A1F" />
              Friends Khana Score Leaderboard
            </h3>

            <div className="leaderboard-list">
              {LEADERBOARD.map((friend) => (
                <div
                  key={friend.name}
                  className={`leaderboard-item ${friend.isMe ? 'is-me' : ''}`}
                >
                  <span className="leaderboard-rank">
                    {friend.rank === 1 ? '🥇' : friend.rank === 2 ? '🥈' : friend.rank === 3 ? '🥉' : `#${friend.rank}`}
                  </span>
                  <div className="leaderboard-avatar">
                    {friend.isMe ? (
                      <Avatar avatar={avatar} alt={friend.name} />
                    ) : (
                      <img
                        src={friend.avatarSrc}
                        alt={friend.name}
                        className="people-avatar"
                      />
                    )}
                  </div>
                  <div className="leaderboard-info">
                    <strong>{friend.name} {friend.isMe ? '(You)' : ''}</strong>
                    <span>{friend.streak} day streak · {friend.badge}</span>
                  </div>
                  <div className="leaderboard-score-tag">
                    <strong>{friend.score}</strong>
                    <small>pts</small>
                  </div>
                </div>
              ))}
            </div>

            {/* Challenge Option - Placed at the VERY LAST */}
            <section className="challenge-action-card" style={{ marginTop: '18px' }}>
              <div className="challenge-action-header">
                <div className="challenge-icon-box" style={{ background: 'linear-gradient(135deg, #2554D7, #1D42B0)' }}>
                  <Users size={22} />
                </div>
                <div className="challenge-action-title">
                  <strong>Invite New Friends to Duel</strong>
                  <span>Send a direct link to compare eating streaks & scores</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-challenge-primary"
                onClick={handleChallengeFriend}
                style={{ width: '100%' }}
              >
                <Share2 size={16} />
                <span>{copiedChallenge ? 'Challenge Link Copied!' : 'Send 7-Day Challenge Link'}</span>
              </button>
            </section>
          </>
        )}
      </div>

      <BottomNav active="home" />
    </div>
  );
}
