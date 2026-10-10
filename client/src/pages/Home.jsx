import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Camera,
  ChevronRight,
  Droplet,
  Dumbbell,
  UserRound,
  UtensilsCrossed,
  Wheat,
} from 'lucide-react';
import mealImage from '../assets/images/HealthyFood-2.jpg';
import khanaLensLogo from '../assets/images/KhanaLens.png';
import { useAuth } from '../hooks/useAuth';
import { useNutrition } from '../hooks/useNutrition';
import { getProfileApi, getProgressApi, saveProfileApi } from '../services/api';
import { Avatar } from '../components/Avatar';
import { BottomNav } from '../components/BottomNav';
import AppHeader from '../components/AppHeader';
import { calculateStreak } from '../data/streak';

const defaultSummary = { calories: 0, calorieGoal: 2000, protein: 0, proteinGoal: 120, carbs: 0, carbsGoal: 250, fat: 0, fatGoal: 70 };

/* Matches the splash and profile pages: cream glass card, logo green, round logo badge */
const homeCss = `
@property --progress {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}

@keyframes bar-grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@keyframes pulse-soft {
  0%, 100% { box-shadow: 0 0 0 0 rgba(143, 215, 180, 0.45); }
  50% { box-shadow: 0 0 0 8px rgba(143, 215, 180, 0); }
}

.dashboard-viewport {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: transparent;
  color: #1F4D33;
  font-family: 'Google Sans Local', 'Google Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}
.dashboard-viewport * { box-sizing: border-box; }

.dashboard-page {
  position: relative;
  width: 100%;
  max-width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  padding: 0 16px 36px;
  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.dashboard-brandbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.dashboard-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.dashboard-brand-mark {
  width: 44px; height: 44px; border-radius: 50%; overflow: hidden;
  display: grid; place-items: center;
  background: linear-gradient(145deg, #FBF7EE, #E9DCC3);
  box-shadow: inset 0 2px 2px rgba(255, 255, 255, 0.9), 0 0 0 1px rgba(31, 77, 51, 0.15), 0 8px 18px rgba(31, 77, 51, 0.18);
}
.dashboard-brand-mark img { width: 100%; height: 100%; object-fit: contain; border-radius: 50%; }
.dashboard-brand-copy strong { display: block; color: #1F4D33; font-size: 17px; font-weight: 700; letter-spacing: -0.4px; }
.dashboard-brand-copy strong span { color: #3FA47A; }
.dashboard-brand-copy small { display: block; color: rgba(31, 77, 51, 0.65); font-size: 9px; font-weight: 600; }

.dashboard-header-actions { display: flex; align-items: center; gap: 8px; }
.dashboard-header-actions .icon-button,
.dashboard-header-actions a[aria-label] {
  width: 38px; height: 38px; border-radius: 12px; display: grid; place-items: center; text-decoration: none;
  background: rgba(255, 255, 255, 0.7); border: 1px solid rgba(31, 77, 51, 0.15); color: #1F4D33;
}

.dashboard-header h1 { margin: 0 0 4px; color: #1F4D33; font-size: 22px; font-weight: 700; letter-spacing: -0.6px; }
.dashboard-header p { margin: 0; color: rgba(31, 77, 51, 0.72); font-size: 13px; }

.scan-hero {
  display: flex; align-items: center; justify-content: space-between; margin: 16px 0 6px; padding: 18px;
  border-radius: 22px; text-decoration: none; color: #FBF7EE;
  background: linear-gradient(180deg, #6A9E82 0%, #4E8266 50%, #3A6E52 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 12px 24px rgba(31, 77, 51, 0.2);
}
.scan-hero small { display: block; font-size: 9px; letter-spacing: 1px; opacity: 0.8; }
.scan-hero strong { display: block; font-size: 18px; font-weight: 700; }
.scan-hero span { font-size: 12px; opacity: 0.85; }
.scan-hero-icon {
  width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center;
  background: rgba(255, 255, 255, 0.2); animation: pulse-soft 2.4s ease-in-out infinite;
}

.dashboard-section { margin-top: 18px; }
.section-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.section-heading h2 { margin: 0; color: #1F4D33; font-size: 15px; font-weight: 700; }
.section-heading button, .section-heading a {
  background: none; border: 0; color: #3FA47A; font-size: 12px; font-weight: 700; text-decoration: none; cursor: pointer;
}

.summary-card, .weekly-scans-card {
  padding: 14px; border-radius: 22px; background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(31, 77, 51, 0.12); box-shadow: inset 0 1px 0 #FFFFFF, 0 10px 22px rgba(31, 77, 51, 0.08);
}
.summary-card { display: flex; align-items: center; gap: 14px; animation: fade-up 0.5s ease both; }

.summary-ring {
  width: 124px; height: 124px; min-width: 124px; aspect-ratio: 1 / 1; flex: 0 0 124px;
  border-radius: 50%; display: grid; place-items: center;
  background: conic-gradient(
    #3FA47A 0deg,
    #3FA47A var(--progress),
    rgba(31, 77, 51, 0.1) var(--progress),
    rgba(31, 77, 51, 0.1) 360deg
  );
  transition: --progress 1s cubic-bezier(0.2, 0.8, 0.25, 1);
  box-shadow: 0 0 0 6px rgba(63, 164, 122, 0.07);
}
.summary-ring-inner {
  width: 96px; height: 96px; aspect-ratio: 1 / 1; border-radius: 50%; background: #FBF8F0;
  display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
  box-shadow: inset 0 2px 4px rgba(31, 77, 51, 0.06);
}
.summary-ring-inner strong { color: #1F4D33; font-size: 18px; font-weight: 700; animation: fade-up 0.6s ease 0.3s both; }
.summary-ring-inner span { color: rgba(31, 77, 51, 0.65); font-size: 10px; }
.summary-ring-inner b { color: #1E9E6A; font-size: 12px; }

.macro-list { flex: 1; display: grid; gap: 10px; min-width: 0; }
.macro-row { display: grid; gap: 5px; animation: fade-up 0.5s ease both; }
.macro-row.protein { animation-delay: 0.15s; }
.macro-row.carbs { animation-delay: 0.25s; }
.macro-row.fat { animation-delay: 0.35s; }
.macro-label { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: #1F4D33; }
.macro-icon {
  width: 28px; height: 28px; border-radius: 10px; display: grid; place-items: center; flex-shrink: 0;
}
.macro-row strong { font-size: 13px; color: #1F4D33; }
.macro-row small { color: rgba(31, 77, 51, 0.6); font-weight: 500; }
.macro-track { height: 6px; border-radius: 99px; background: rgba(31, 77, 51, 0.1); overflow: hidden; }
.macro-track span {
  display: block; height: 100%; border-radius: 99px; transform-origin: left center;
  animation: bar-grow 1s cubic-bezier(0.2, 0.8, 0.25, 1) 0.4s both;
}

.weekly-day-strip { display: flex; justify-content: space-between; gap: 6px; }
.weekly-day {
  flex: 1; display: grid; justify-items: center; gap: 2px; padding: 8px 0; cursor: pointer;
  border-radius: 14px; border: 1px solid rgba(31, 77, 51, 0.12); background: rgba(255, 255, 255, 0.7); color: #1F4D33;
  transition: transform 0.2s ease;
}
.weekly-day:hover { transform: translateY(-2px); }
.weekly-day span { font-size: 9px; font-weight: 700; opacity: 0.7; }
.weekly-day strong { font-size: 13px; }
.weekly-day.selected { background: linear-gradient(180deg, #6A9E82 0%, #3A6E52 100%); color: #FBF7EE; border-color: rgba(31, 77, 51, 0.5); }
.weekly-day i { width: 5px; height: 5px; border-radius: 50%; background: #3FA47A; }
.weekly-day.selected i { background: #FBF7EE; }
.weekly-day-summary { margin-top: 10px; display: grid; gap: 2px; font-size: 12px; color: rgba(31, 77, 51, 0.75); }
.weekly-day-summary strong { color: #1F4D33; font-size: 13px; }

.meal-list { display: grid; gap: 10px; }
.meal-row {
  display: flex; align-items: center; gap: 12px; padding: 10px; cursor: pointer;
  border-radius: 18px; background: rgba(255, 255, 255, 0.7); border: 1px solid rgba(31, 77, 51, 0.12);
  transition: transform 0.2s ease;
}
.meal-row:hover { transform: translateY(-2px); }
.meal-row img { width: 52px; height: 52px; border-radius: 14px; object-fit: cover; }
.meal-copy { flex: 1; display: grid; gap: 2px; }
.meal-copy strong { color: #1F4D33; font-size: 13px; }
.meal-copy span { color: rgba(31, 77, 51, 0.7); font-size: 11px; }
.dashboard-empty-meals, .loading-row, .weekly-scans-empty {
  color: rgba(31, 77, 51, 0.7); font-size: 12px; text-align: center; padding: 12px;
}
.dashboard-empty-scan-link {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 6px; color: #3FA47A; font-weight: 700; text-decoration: none;
}



.dashboard-modal-backdrop {
  position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 16px;
  background: rgba(18, 53, 36, 0.35);
}
.dashboard-goal-modal {
  width: min(100%, 360px); padding: 22px; border-radius: 26px;
  background: linear-gradient(170deg, #FBF8F0, #F2EADA); color: #1F4D33;
  box-shadow: 0 30px 60px rgba(31, 77, 51, 0.2);
}
.dashboard-goal-modal h2 { margin: 0; font-size: 18px; font-weight: 700; }
.dashboard-goal-modal input {
  width: 100%; padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(31, 77, 51, 0.18);
  background: rgba(255, 255, 255, 0.7); color: #1F4D33; font: inherit;
}
.dashboard-goal-save {
  width: 100%; height: 50px; margin-top: 12px; border: 0; border-radius: 16px; cursor: pointer;
  color: #FBF7EE; font-weight: 600; font-size: 15px;
  background: linear-gradient(180deg, #6A9E82 0%, #4E8266 50%, #3A6E52 100%);
  box-shadow: 0 8px 18px rgba(31, 77, 51, 0.25);
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-viewport *,
  .dashboard-viewport *::before,
  .dashboard-viewport *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;

/* Override block: beats older project styles for the ring, macro rows and logo */
const homeFixCss = `
.dashboard-viewport .summary-card {
  display: flex !important;
  align-items: center !important;
  gap: 16px !important;
}
.dashboard-viewport .summary-ring {
  width: 124px !important;
  height: 124px !important;
  min-width: 124px !important;
  max-width: 124px !important;
  flex: 0 0 124px !important;
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
    rgba(31, 77, 51, 0.1) var(--progress, 0deg),
    rgba(31, 77, 51, 0.1) 360deg
  ) !important;
  box-shadow: 0 0 0 6px rgba(63, 164, 122, 0.07) !important;
}
.dashboard-viewport .summary-ring-inner {
  width: 96px !important;
  height: 96px !important;
  min-width: 96px !important;
  aspect-ratio: 1 / 1 !important;
  border-radius: 50% !important;
  border: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  background: #FBF8F0 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
}
.dashboard-viewport .macro-list {
  flex: 1 !important;
  display: grid !important;
  gap: 12px !important;
  min-width: 0 !important;
}
.dashboard-viewport .macro-row {
  display: grid !important;
  gap: 5px !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: none !important;
  box-shadow: none !important;
}
.dashboard-viewport .macro-row::before,
.dashboard-viewport .macro-row::after {
  display: none !important;
  content: none !important;
}
.dashboard-viewport .macro-label {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  color: #1F4D33 !important;
  font-size: 12px !important;
  font-weight: 700 !important;
}
.dashboard-viewport .macro-icon {
  width: 28px !important;
  height: 28px !important;
  border-radius: 10px !important;
  display: grid !important;
  place-items: center !important;
}
.dashboard-viewport .macro-track {
  height: 6px !important;
  border: 0 !important;
  border-radius: 99px !important;
  background: rgba(31, 77, 51, 0.1) !important;
  overflow: hidden !important;
}
.dashboard-viewport .macro-track span {
  height: 100% !important;
  border-radius: 99px !important;
}
.dashboard-viewport .dashboard-brandbar {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  margin-bottom: 20px !important;
  width: 100% !important;
}
.dashboard-viewport .dashboard-brand {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  text-decoration: none !important;
}
.dashboard-viewport .dashboard-brand-mark {
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  border-radius: 50% !important;
  overflow: hidden !important;
  background: linear-gradient(145deg, #FBF7EE, #E9DCC3) !important;
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    0 0 0 1px rgba(31, 77, 51, 0.15),
    0 8px 18px rgba(31, 77, 51, 0.16) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
}
.dashboard-viewport .dashboard-brand-mark img {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  border-radius: 50% !important;
  display: block !important;
}
.dashboard-viewport .dashboard-brand-copy {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}
.dashboard-viewport .dashboard-brand-copy strong {
  display: block !important;
  color: #1F4D33 !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  line-height: 1.15 !important;
  letter-spacing: -0.4px !important;
}
.dashboard-viewport .dashboard-brand-copy strong span {
  color: #3FA47A !important;
}
.dashboard-viewport .dashboard-brand-copy small {
  display: block !important;
  margin-top: 2px !important;
  color: rgba(31, 77, 51, 0.65) !important;
  font-size: 9px !important;
  font-weight: 600 !important;
}
.dashboard-viewport .dashboard-header-actions {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}
.dashboard-viewport .dashboard-header-actions .icon-button,
.dashboard-viewport .dashboard-header-actions a[aria-label] {
  width: 38px !important;
  height: 38px !important;
  border-radius: 12px !important;
  display: grid !important;
  place-items: center !important;
  text-decoration: none !important;
  background: rgba(255, 255, 255, 0.7) !important;
  border: 1px solid rgba(31, 77, 51, 0.15) !important;
  color: #1F4D33 !important;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 4px 10px rgba(31, 77, 51, 0.06) !important;
  overflow: hidden !important;
  padding: 0 !important;
  transition: transform 0.15s ease, background 0.15s ease !important;
}
.dashboard-viewport .dashboard-header-actions a[aria-label]:hover,
.dashboard-viewport .dashboard-header-actions .icon-button:hover {
  background: #FFFFFF !important;
  transform: translateY(-1px) !important;
}
.dashboard-viewport .dashboard-header-actions .people-avatar,
.dashboard-viewport .dashboard-header-actions .dashboard-avatar,
.dashboard-viewport .dashboard-header-actions .food-avatar,
.dashboard-viewport .dashboard-header-actions img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  border-radius: inherit !important;
  display: block !important;
}
.dashboard-viewport .dashboard-header-actions .dashboard-avatar-fallback {
  width: 100% !important;
  height: 100% !important;
  border-radius: inherit !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.dashboard-viewport .dashboard-page {
  position: relative !important;
  width: 100% !important;
  flex: 1 1 auto !important;
  min-height: 0 !important;
  height: auto !important;
  margin: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  padding: 16px 16px 24px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  box-sizing: border-box !important;
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
    <div className={`macro-row ${type}`}>
      <div className="macro-label">
        <span className="macro-icon" style={{ background: `${color}26`, color }}>
          <Icon size={15} strokeWidth={2.2} />
        </span>
        <span>{label}</span>
      </div>
      <strong>{displayValue} <small>/{displayGoal}g</small></strong>
      <div className="macro-track"><span style={{ width: `${percentage}%`, background: color }} /></div>
    </div>
  );
}

export const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { getHistory, loading } = useNutrition();
  const [history, setHistory] = useState({ summary: { totals: {} }, data: [] });
  const [profile, setProfile] = useState(null);
  const [nutritionProgress, setNutritionProgress] = useState(null);
  const [selectedProgressDate, setSelectedProgressDate] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [goalOverride, setGoalOverride] = useState({});
  const [goalDraft, setGoalDraft] = useState({ calorieGoal: defaultSummary.calorieGoal, proteinGoal: defaultSummary.proteinGoal, carbsGoal: defaultSummary.carbsGoal, fatGoal: defaultSummary.fatGoal });
  const [goalEditorOpen, setGoalEditorOpen] = useState(false);

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
      setGoalOverride({ calorieGoal: Number(resolvedProfile?.calorieGoal || defaultSummary.calorieGoal), proteinGoal: Number(resolvedProfile?.proteinGoal || defaultSummary.proteinGoal), carbsGoal: Number(resolvedProfile?.carbsGoal || defaultSummary.carbsGoal), fatGoal: Number(resolvedProfile?.fatGoal || defaultSummary.fatGoal) });
      setGoalDraft({ calorieGoal: Number(resolvedProfile?.calorieGoal || defaultSummary.calorieGoal), proteinGoal: Number(resolvedProfile?.proteinGoal || defaultSummary.proteinGoal), carbsGoal: Number(resolvedProfile?.carbsGoal || defaultSummary.carbsGoal), fatGoal: Number(resolvedProfile?.fatGoal || defaultSummary.fatGoal) });
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

  const progressDays = nutritionProgress?.days || [];
  const selectedDay = progressDays.find((day) => day.date === selectedProgressDate) || progressDays[progressDays.length - 1];

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
    const base = { ...defaultSummary, calories: Number(resolvedTotals.calories || 0), protein: Number(resolvedTotals.protein || 0), carbs: Number(resolvedTotals.carbs || 0), fat: Number(resolvedTotals.fat || 0), calorieGoal: Number(profile?.calorieGoal || defaultSummary.calorieGoal), proteinGoal: Number(profile?.proteinGoal || defaultSummary.proteinGoal), carbsGoal: Number(profile?.carbsGoal || defaultSummary.carbsGoal), fatGoal: Number(profile?.fatGoal || defaultSummary.fatGoal), ...goalOverride };
    return {
      ...base,
      calories: Number(base.calories || 0),
      protein: Number(base.protein || 0),
      carbs: Number(base.carbs || 0),
      fat: Number(base.fat || 0),
    };
  }, [nutritionProgress, selectedDay, goalOverride, profile?.calorieGoal, profile?.proteinGoal, profile?.carbsGoal, profile?.fatGoal]);

  const trackedMealRows = (history.data || []).map((meal) => ({
    _id: meal.id,
    foodName: meal.mealName,
    calories: meal.calories,
    itemCount: meal.itemCount || meal.items?.length || 1,
    createdAt: meal.createdAt || 'Just now',
    image: meal.image || meal.imageUrl,
    items: meal.items,
  }));
  const isSelectedPastDay = Boolean(selectedProgressDate && selectedDay && selectedDay.date !== progressDays[progressDays.length - 1]?.date);
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
    const nextProfile = { ...profile, calorieGoal: Number(goalDraft.calorieGoal) || 0, proteinGoal: Number(goalDraft.proteinGoal) || 0, carbsGoal: Number(goalDraft.carbsGoal) || 0, fatGoal: Number(goalDraft.fatGoal) || 0 };
    setProfile(nextProfile);
    setGoalOverride({ calorieGoal: nextProfile.calorieGoal, proteinGoal: nextProfile.proteinGoal, carbsGoal: nextProfile.carbsGoal, fatGoal: nextProfile.fatGoal });
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
    <div className="kl-page dashboard-viewport kl-fade-up">
      <style>{homeCss}</style>
      <style>{homeFixCss}</style>
      <main className="dashboard-page" style={{ padding: '0 16px 36px', background: 'transparent' }}>
        <AppHeader avatar={profile?.avatar} streak={calculateStreak(progressDays)} />
        <header className="dashboard-header" style={{ marginTop: '10px' }}>
          <div>
            <h1>Hello, {displayName}! <span aria-hidden="true">👋</span></h1>
            <p>Track your nutrition today</p>
          </div>
        </header>

        <Link to="/scan" className="scan-hero">
          <div className="scan-hero-copy"><small>SMART FOOD SCANNER</small><strong>Scan Your Food</strong><span>Tap to scan or upload your meal</span></div>
          <span className="scan-hero-icon"><Camera size={22} /><b aria-hidden="true">✦</b></span>
        </Link>

        <section className="dashboard-section">
          <div className="section-heading"><h2>{!isSelectedPastDay ? "Today's Summary" : `${selectedDayName}'s Summary`}</h2><button type="button" onClick={() => { setGoalDraft({ calorieGoal: summary.calorieGoal, proteinGoal: summary.proteinGoal, carbsGoal: summary.carbsGoal, fatGoal: summary.fatGoal }); setGoalEditorOpen(true); }}>Edit Goal</button></div>
          <div className="summary-card">
            <SummaryRing calories={summary.calories} goal={summary.calorieGoal} />
            <div className="macro-list">
              <MacroRow type="protein" label="Protein" value={summary.protein} goal={summary.proteinGoal} />
              <MacroRow type="carbs" label="Carbs" value={summary.carbs} goal={summary.carbsGoal} />
              <MacroRow type="fat" label="Fat" value={summary.fat} goal={summary.fatGoal} />
            </div>
          </div>
        </section>

        <section className="dashboard-section weekly-scans-section" aria-labelledby="weekly-scans-title">
          <div className="section-heading"><h2 id="weekly-scans-title">Last 7 days</h2><Link to="/progress">View progress</Link></div>
          <div className="weekly-scans-card">
            <div className="weekly-day-strip">
              {progressDays.map((day) => {
                const date = new Date(`${day.date}T00:00:00Z`);
                const isSelected = day.date === (selectedDay?.date || selectedProgressDate);
                return <button type="button" key={day.date} className={`weekly-day ${isSelected ? 'selected' : ''}`} onClick={() => setSelectedProgressDate(day.date)} aria-label={`${date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}: ${day.meals.length} scans`}><span>{date.toLocaleDateString([], { weekday: 'short' }).toUpperCase()}</span><strong>{date.getUTCDate()}</strong>{day.meals.length > 0 && <i aria-hidden="true" />}</button>;
              })}
              {!progressDays.length && <div className="weekly-scans-empty">Loading scan history…</div>}
            </div>
            {selectedDay && <div className="weekly-day-summary"><strong>{selectedDay.meals.length} {selectedDay.meals.length === 1 ? 'scan' : 'scans'}</strong><span>{Math.round(selectedDay.calories).toLocaleString()} kcal saved for {new Date(`${selectedDay.date}T00:00:00Z`).toLocaleDateString([], { weekday: 'long' })}</span></div>}
          </div>
        </section>

        <section className="dashboard-section recent-section">
          <div className="section-heading"><h2>{isSelectedPastDay ? `Meals for ${selectedDayName}` : 'Recent Meals'}</h2><Link to="/history">See All</Link></div>
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
                <div className="meal-row" key={meal._id || `${meal.foodName}-${index}`} role="button" tabIndex="0" onClick={() => openMealDetails(meal)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') openMealDetails(meal); }}>
                  <img src={meal.image || meal.imageUrl || mealImage} alt={meal.foodName || 'Recent meal'} />
                  <div className="meal-copy"><strong>{meal.foodName}</strong><span>{Math.round(meal.calories)} kcal&nbsp; · &nbsp;{meal.itemCount || 1} {meal.itemCount === 1 ? 'item' : 'items'}</span></div>
                  <ChevronRight size={20} />
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <BottomNav active="home" />
      {goalEditorOpen && <div className="dashboard-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setGoalEditorOpen(false); }}><section className="dashboard-goal-modal" role="dialog" aria-modal="true" aria-labelledby="goal-editor-title"><div className="dashboard-modal-heading"><div><span>YOUR DAILY TARGETS</span><h2 id="goal-editor-title">Edit nutrition goals</h2></div><button type="button" onClick={() => setGoalEditorOpen(false)} aria-label="Close goal editor">×</button></div><p>Set targets that feel realistic for your routine. These update the summary bars immediately.</p><div className="dashboard-goal-grid"><label className="goal-field-calories" htmlFor="dashboard-calorie-input">Calories<div className="dashboard-goal-input-wrap"><input id="dashboard-calorie-input" type="number" step="50" value={goalDraft.calorieGoal} onChange={(event) => setGoalDraft({ ...goalDraft, calorieGoal: event.target.value })} /><span>kcal</span></div></label><label className="goal-field-protein" htmlFor="dashboard-protein-input">Protein<div className="dashboard-goal-input-wrap"><input id="dashboard-protein-input" type="number" step="1" value={goalDraft.proteinGoal} onChange={(event) => setGoalDraft({ ...goalDraft, proteinGoal: event.target.value })} /><span>g</span></div></label><label className="goal-field-carbs" htmlFor="dashboard-carbs-input">Carbs<div className="dashboard-goal-input-wrap"><input id="dashboard-carbs-input" type="number" step="1" value={goalDraft.carbsGoal} onChange={(event) => setGoalDraft({ ...goalDraft, carbsGoal: event.target.value })} /><span>g</span></div></label><label className="goal-field-fat" htmlFor="dashboard-fat-input">Fat<div className="dashboard-goal-input-wrap"><input id="dashboard-fat-input" type="number" step="1" value={goalDraft.fatGoal} onChange={(event) => setGoalDraft({ ...goalDraft, fatGoal: event.target.value })} /><span>g</span></div></label></div><small>Enter the targets that match your personal plan.</small><button className="dashboard-goal-save" type="button" onClick={saveGoals}>Save nutrition goals</button></section></div>}
    </div>
  );
};