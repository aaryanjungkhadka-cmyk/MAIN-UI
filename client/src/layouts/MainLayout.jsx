import React from 'react';
import AppHeader from '../components/AppHeader';
import { BottomNav } from '../components/BottomNav';

export const MainLayout = ({ children }) => {
  return (
    <div className="kl-page kl-fade-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppHeader showBack={false} />
      <main style={{ flex: '1 1 auto', minHeight: 0, padding: '16px 16px 36px', width: '100%', boxSizing: 'border-box' }}>
        {children}
      </main>
      <BottomNav active="home" />
    </div>
  );
};
