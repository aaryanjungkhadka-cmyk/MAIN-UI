import React from 'react';
import logo from '../assets/images/KhanaLens.png';

export default function BrandLogo({ size = 46, showText = true, tagline = true, className = '' }) {
  return (
    <div className={`kl-brand ${className}`}>
      <span className="kl-brand-badge" style={{ width: size, height: size }}>
        <img
          src={logo}
          alt="KhanaLens"
          className="kl-brand-mark"
          width={size}
          height={size}
          loading="eager"
          decoding="async"
        />
      </span>
      {showText && (
        <span className="kl-brand-text">
          <strong>
            Khana<span>Lens</span>
          </strong>
          {tagline && <small>Scan. Analyze. Eat Smarter.</small>}
        </span>
      )}
    </div>
  );
}
