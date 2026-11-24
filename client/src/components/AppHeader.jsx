import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Bell, ChevronLeft, Flame, UtensilsCrossed } from 'lucide-react';
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
  logoSize = 40,
}) {
  const [internalStreak, setInternalStreak] = useState(0);
  const headerRef = useRef(null);

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

  // Dynamically measure header height for safe-area / responsive accuracy
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) {
        document.documentElement.style.setProperty('--kl-header-real-h', `${Math.round(h)}px`);
      }
    };

    measure();

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    window.addEventListener('resize', measure);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const resolvedStreak = typeof streak === 'number' ? streak : internalStreak;

  const headerContent = (
    <header className="kl-header" ref={headerRef}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        {showBack && (
          <Link
            to={backTo}
            className="kl-header-btn"
            style={{ width: 39, height: 39, borderRadius: 13 }}
            aria-label="Go back"
          >
            <ChevronLeft size={19} />
          </Link>
        )}
        <Link
          to="/home"
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', minWidth: 0 }}
          aria-label="KhanaLens Home"
        >
          <BrandLogo size={logoSize} tagline={!showBack} />
        </Link>
      </div>
      {actions ?? (
        <div className="kl-header-actions">
          <Link to="/streak" className="kl-header-btn kl-header-btn-fire" aria-label="Streak">
            <Flame size={19} />
            {resolvedStreak > 0 && (
              <span className="kl-header-streak-badge">{resolvedStreak}</span>
            )}
          </Link>
          <Link to="/notifications" className="kl-header-btn kl-header-btn-notif" aria-label="Notifications">
            <Bell size={19} />
            <span className="kl-header-notif-dot" />
          </Link>
          <Link to={foodTo} className="kl-header-btn" aria-label="Meal planner">
            <UtensilsCrossed size={19} />
          </Link>
          <Link to={profileTo} className="kl-header-btn kl-header-btn-avatar" aria-label="Profile">
            <Avatar avatar={avatar} alt="Your avatar" />
          </Link>
        </div>
      )}
    </header>
  );

  return (
    <>
      <div className="kl-header-spacer" aria-hidden="true" />
      {typeof document !== 'undefined' && document.body
        ? createPortal(headerContent, document.body)
        : headerContent}
    </>
  );
}
