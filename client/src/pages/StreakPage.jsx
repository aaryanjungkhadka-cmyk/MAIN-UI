import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Check, Sparkles, Trophy, Utensils } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import { BottomNav } from '../components/BottomNav';
import { calculateStreak, currentWeek, dayCounts, getStreakData } from '../data/streak';
import { getProfileApi } from '../services/api';

export default function StreakPage() {
  const navigate = useNavigate();
  const [streakData, setStreakData] = useState({ streak: 0, days: [], week: [] });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getProfileApi()
      .then((res) => {
        if (isMounted) setAvatar(res?.data?.data?.avatar);
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
  const weekDays = useMemo(() => {
    return streakData.week.length > 0 ? streakData.week : currentWeek(streakData.days);
  }, [streakData]);

  // Last 5 days that counted toward the streak
  const achievements = useMemo(() => {
    return (streakData.days || [])
      .filter(dayCounts)
      .slice(-5)
      .reverse();
  }, [streakData.days]);

  const bottomMessage = useMemo(() => {
    if (streak === 0) return 'Log a meal today to start';
    if (streak < 7) return 'Great start, keep going tomorrow';
    return 'Amazing consistency! Keep your streak going tomorrow';
  }, [streak]);

  return (
    <div className="kl-page streak-page-viewport kl-fade-up">
      <style>{`
        .streak-page-viewport {
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
          padding: 0 16px 36px;
          box-sizing: border-box;
        }

        .streak-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 16px 20px;
          text-align: center;
        }

        .streak-flame-container {
          position: relative;
          width: 150px;
          height: 160px;
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
          padding-top: 32px;
          font-size: 52px;
          font-weight: 900;
          color: #FFFFFF;
          text-shadow: 0 3px 8px rgba(180, 70, 0, 0.45);
          letter-spacing: -1.5px;
          line-height: 1;
        }

        .streak-label {
          margin-top: 10px;
          font-size: 20px;
          font-weight: 800;
          color: #FF9A1F;
          letter-spacing: -0.4px;
        }

        .streak-card {
          margin-top: 14px;
          padding: 18px 16px;
          border-radius: var(--kl-radius-card);
          background: rgba(255, 255, 255, 0.75);
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
          margin: 16px 0 12px;
        }

        .streak-card-footer-note {
          text-align: center;
          font-size: 13px;
          font-weight: 650;
          color: #1F4D33;
          margin: 0;
        }
        .streak-card-footer-note strong {
          color: #FF9A1F;
        }

        /* Achievements section */
        .streak-section-title {
          margin: 22px 0 10px;
          font-size: 15px;
          font-weight: 750;
          color: #1F4D33;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .streak-achievements-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .streak-achievement-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(31, 77, 51, 0.1);
        }

        .streak-achievement-icon {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #E8F5EF;
          color: #1F4D33;
          flex-shrink: 0;
        }

        .streak-achievement-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .streak-achievement-info strong {
          font-size: 13px;
          color: #1F4D33;
        }

        .streak-achievement-info span {
          font-size: 11px;
          color: rgba(31, 77, 51, 0.65);
        }

        .streak-empty-box {
          text-align: center;
          padding: 24px 16px;
          border-radius: 18px;
          border: 1.5px dashed rgba(31, 77, 51, 0.18);
          background: rgba(255, 255, 255, 0.5);
          color: rgba(31, 77, 51, 0.7);
          font-size: 13px;
        }
      `}</style>

      <div className="streak-page-scroll">
        <AppHeader
          avatar={avatar}
          streak={streak}
          showBack={true}
          backTo="/home"
        />

        {/* Hero Section */}
        <div className="streak-hero">
          <div className="streak-flame-container">
            <svg
              viewBox="0 0 100 110"
              className="streak-flame-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer flame */}
              <path
                d="M50 0C50 0 58 18 64 26C74 38 88 52 88 72C88 93 71 110 50 110C29 110 12 93 12 72C12 56 22 42 32 30C36 25 40 18 42 10C42 10 46 20 46 24C46 32 40 40 40 46C40 52 44 56 50 56C58 56 64 48 64 38C64 24 50 0 50 0Z"
                fill="url(#outerFlameGrad)"
              />
              {/* Inner flame */}
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

          <div className="streak-label">day streak!</div>
        </div>

        {/* Current Week Card */}
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

        {/* Recent Achievements */}
        <h3 className="streak-section-title">
          <Trophy size={16} color="#FF9A1F" />
          Recent achievements
        </h3>

        {achievements.length === 0 ? (
          <div className="streak-empty-box">
            Log a meal today to start your streak
          </div>
        ) : (
          <div className="streak-achievements-list">
            {achievements.map((day) => {
              const dateObj = new Date(`${day.date}T12:00:00Z`);
              const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
              const mealCount = day.meals?.length || 0;
              const kcal = Math.round(day.calories || 0);

              return (
                <div key={day.date} className="streak-achievement-item">
                  <div className="streak-achievement-icon">
                    <Award size={18} />
                  </div>
                  <div className="streak-achievement-info">
                    <strong>Logged {mealCount} {mealCount === 1 ? 'meal' : 'meals'}</strong>
                    <span>{dateStr} · {kcal > 0 ? `${kcal} kcal saved` : 'Streak maintained'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav active="home" />
    </div>
  );
}
