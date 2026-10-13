import React from 'react';
import BrandLogo from '../components/BrandLogo';
import { BottomNav } from '../components/BottomNav';

export const MainLayout = ({ children }) => {
  return (
    <div className="kl-page kl-fade-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <header className="kl-header">
        <BrandLogo size={44} tagline={false} />
      </header>
      <main style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: '16px 16px 36px', width: '100%', boxSizing: 'border-box' }}>
        {children}
      </main>
      <BottomNav active="home" />
    </div>
  );
};
