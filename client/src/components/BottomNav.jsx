import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CircleUserRound,
  History,
  Home,
  LayoutDashboard,
  ScanLine,
} from 'lucide-react';

export function BottomNav({ active }) {
  const location = useLocation();
  const path = location.pathname;

  const isHome = active === 'home' || path === '/home';
  const isProgress = active === 'progress' || path.startsWith('/progress') || path === '/goals';
  const isScan = active === 'scan' || path.startsWith('/scan');
  const isHistory = active === 'history' || path.startsWith('/history');
  const isProfile = active === 'profile' || path.startsWith('/profile') || path.startsWith('/settings');

  return (
    <nav className="kl-bottom-nav" aria-label="Main navigation">
      <Link
        to="/home"
        className={`kl-nav-item ${isHome ? 'active' : ''}`}
      >
        <Home size={19} />
        <span>Home</span>
      </Link>
      <Link
        to="/progress"
        className={`kl-nav-item ${isProgress ? 'active' : ''}`}
      >
        <LayoutDashboard size={19} />
        <span>Progress</span>
      </Link>
      <Link
        to="/scan"
        className={`kl-nav-item ${isScan ? 'active' : ''}`}
      >
        <span className="kl-nav-scan">
          <ScanLine size={24} />
        </span>
        <span>Scan</span>
      </Link>
      <Link
        to="/history"
        className={`kl-nav-item ${isHistory ? 'active' : ''}`}
      >
        <History size={19} />
        <span>History</span>
      </Link>
      <Link
        to="/profile"
        className={`kl-nav-item ${isProfile ? 'active' : ''}`}
      >
        <CircleUserRound size={20} />
        <span>Profile</span>
      </Link>
    </nav>
  );
}

export default BottomNav;
