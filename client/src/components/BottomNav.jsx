import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

  const [isVisible, setIsVisible] = useState(true);
  const lastYRef = useRef(0);
  const isVisibleRef = useRef(true);
  const tickingRef = useRef(false);
  const idleTimeoutRef = useRef(null);
  const isKeyboardOpenRef = useRef(false);

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

  useEffect(() => {
    // Robust cross-browser scroll position helper for Android & iOS
    const getScrollY = () => {
      if (typeof window === 'undefined') return 0;
      return (
        window.scrollY ??
        window.pageYOffset ??
        document.documentElement?.scrollTop ??
        document.body?.scrollTop ??
        0
      );
    };

    // Total scrollable document height helper
    const getDocHeight = () => {
      if (typeof document === 'undefined') return 0;
      const b = document.body;
      const h = document.documentElement;
      return Math.max(
        b ? b.scrollHeight : 0,
        b ? b.offsetHeight : 0,
        h ? h.clientHeight : 0,
        h ? h.scrollHeight : 0,
        h ? h.offsetHeight : 0
      );
    };

    const showNav = () => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const hideNav = () => {
      if (isVisibleRef.current && !isKeyboardOpenRef.current) {
        isVisibleRef.current = false;
        setIsVisible(false);
      }
    };

    const resetIdleTimer = () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      // When scrolling stops on Android, gently bring the navigation bar back
      idleTimeoutRef.current = setTimeout(() => {
        if (!isKeyboardOpenRef.current) {
          showNav();
        }
      }, 850);
    };

    // Initialize with current scroll position
    lastYRef.current = getScrollY();

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const currentY = getScrollY();
        const diff = currentY - lastYRef.current;
        const docHeight = getDocHeight();
        const winHeight = window.innerHeight || 800;
        const isNearBottom = currentY + winHeight >= docHeight - 45;

        // 1. Near the top of the page: always visible
        if (currentY <= 25) {
          showNav();
          lastYRef.current = currentY;
          tickingRef.current = false;
          return;
        }

        // 2. Near the bottom of the page: always visible
        if (isNearBottom) {
          showNav();
          lastYRef.current = currentY;
          tickingRef.current = false;
          return;
        }

        // 3. Directional scroll detection with jitter threshold
        if (Math.abs(diff) >= 7) {
          if (diff > 0) {
            // Scrolling DOWN -> smoothly hide
            hideNav();
            resetIdleTimer();
          } else if (diff < 0) {
            // Scrolling UP -> immediately show
            showNav();
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
          }
          lastYRef.current = currentY;
        }

        tickingRef.current = false;
      });
    };

    // When touch ends on Android, trigger idle check so nav returns smoothly
    const onTouchEnd = () => {
      resetIdleTimer();
    };

    // Android keyboard detection: hide nav when typing to prevent covering inputs
    const onFocusIn = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        isKeyboardOpenRef.current = true;
        hideNav();
      }
    };

    const onFocusOut = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        isKeyboardOpenRef.current = false;
        // Delay to allow Android keyboard to collapse
        setTimeout(() => {
          showNav();
        }, 300);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('focusin', onFocusIn, { passive: true });
    document.addEventListener('focusout', onFocusOut, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, []);

  const navContent = (
    <div
      className={`kl-bottom-nav-wrap ${isVisible ? 'nav-visible' : 'nav-hidden'}`}
      aria-hidden={!isVisible}
    >
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

  // Render via portal directly into document.body so no container clipping or transforms affect it
  if (typeof document !== 'undefined' && document.body) {
    return createPortal(navContent, document.body);
  }

  return navContent;
}

export default BottomNav;
