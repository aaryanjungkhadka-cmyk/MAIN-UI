import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Flame, UtensilsCrossed } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { Avatar } from './Avatar';
import { getStreakData } from '../data/streak';

export default function AppHeader({
  avatar,
  streak = null,
  showBack = false,
  backTo = '/home',
  foodTo = '/meal-plan',
  profileTo = '/profile',
  actions,
  logoSize = 44,
}) {
  const [internalStreak, setInternalStreak] = useState(0);

  useEffect(() => {
    if (typeof streak === 'number') {
      setInternalStreak(streak);
      return;
    }
    let isMounted = true;
    getStreakData().then((data) => {
      if (isMounted) setInternalStreak(data.streak || 0);
    });
    return () => {
      isMounted = false;
    };
  }, [streak]);

  const resolvedStreak = typeof streak === 'number' ? streak : internalStreak;

  return (
    <header className="kl-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {showBack && (
          <Link
            to={backTo}
            className="kl-header-btn"
            style={{ width: 40, height: 40, borderRadius: 12 }}
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </Link>
        )}
        <BrandLogo size={logoSize} tagline={!showBack} />
      </div>
      {actions ?? (
        <div className="kl-header-actions">
          <Link to="/streak" className="kl-header-btn kl-header-btn-fire" aria-label="Streak">
            <Flame size={20} />
            {resolvedStreak > 0 && (
              <span className="kl-header-streak-badge">{resolvedStreak}</span>
            )}
          </Link>
          <Link to={foodTo} className="kl-header-btn" aria-label="Meal planner">
            <UtensilsCrossed size={20} />
          </Link>
          <Link to={profileTo} className="kl-header-btn kl-header-btn-avatar" aria-label="Profile">
            <Avatar avatar={avatar} alt="Your avatar" />
          </Link>
        </div>
      )}
    </header>
  );
}
