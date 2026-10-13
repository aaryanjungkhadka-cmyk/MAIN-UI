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

  const getActiveTab = () => {
    if (active) return active;
    if (path === '/home' || path === '/') return 'home';
    if (path.startsWith('/progress') || path === '/goals') return 'progress';
    if (path.startsWith('/scan')) return 'scan';
    if (path.startsWith('/history')) return 'history';
    if (
      path.startsWith('/profile') ||
      path.startsWith('/settings') ||
      path === '/upgrade' ||
      path === '/payment'
    ) {
      return 'profile';
    }
    return 'home';
  };

  const currentTab = getActiveTab();

  const TABS = [
    { id: 'home', label: 'Home', to: '/home', icon: Home },
    { id: 'progress', label: 'Progress', to: '/progress', icon: LayoutDashboard },
    { id: 'scan', label: 'Scan', to: '/scan', icon: ScanLine },
    { id: 'history', label: 'History', to: '/history', icon: History },
    { id: 'profile', label: 'Profile', to: '/profile', icon: CircleUserRound },
  ];

  return (
    <div className="kl-bottom-nav-wrap">
      <nav className="kl-bottom-nav" aria-label="Main navigation">
        {TABS.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              to={tab.to}
              className={`kl-nav-item ${isActive ? 'active' : ''}`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="kl-nav-icon-wrap">
                <Icon size={19} strokeWidth={isActive ? 2.4 : 2} />
              </span>
              {isActive && <span className="kl-nav-label">{tab.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default BottomNav;
