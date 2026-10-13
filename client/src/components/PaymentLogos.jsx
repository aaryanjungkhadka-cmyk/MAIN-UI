import React from 'react';

/**
 * Authentic vector logos for Nepali Payment Gateways:
 * - eSewa
 * - Khalti
 * - Fonepay
 * - ConnectIPS
 * - SCT
 */

export function EsewaLogo({ height = 24, className = '' }) {
  return (
    <svg
      height={height}
      viewBox="0 0 100 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="eSewa"
    >
      {/* Green rounded emblem */}
      <rect x="1" y="2" width="28" height="28" rx="8" fill="#60BB46" />
      {/* Stylized 'e' */}
      <path
        d="M19 14.2C18.6 11.2 16.2 9.5 13.5 9.5C9.8 9.5 7.2 12.6 7.2 16.8C7.2 21 9.9 23.9 14 23.9C17 23.9 18.8 22.4 19.4 20.2H16.8C16.3 21.2 15.3 21.9 13.9 21.9C11.6 21.9 9.8 20.3 9.7 17.6H19.5C19.5 17 19.5 15 19 14.2ZM9.8 15.5C10.1 13.3 11.6 11.6 13.6 11.6C15.5 11.6 16.8 13.1 16.9 15.5H9.8Z"
        fill="#FFFFFF"
      />
      {/* 'eSewa' wordmark */}
      <text
        x="33"
        y="21"
        fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
        fontSize="14.5"
        fontWeight="850"
        fill="#60BB46"
        letterSpacing="-0.3"
      >
        eSewa
      </text>
    </svg>
  );
}

export function KhaltiLogo({ height = 24, className = '' }) {
  return (
    <svg
      height={height}
      viewBox="0 0 102 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Khalti"
    >
      {/* Purple rounded emblem */}
      <rect x="1" y="2" width="28" height="28" rx="8" fill="#5D2E8E" />
      {/* Khalti Origami Bird */}
      <path d="M15 8L8 16L15 24L13 16L15 8Z" fill="#FBAF41" />
      <path d="M15 8L22 13L15 16V8Z" fill="#EE436A" />
      <path d="M15 16L22 19L15 24V16Z" fill="#F15A29" />
      <path d="M15 16L19 16L15 13V16Z" fill="#FFFFFF" />
      {/* 'Khalti' wordmark */}
      <text
        x="33"
        y="21"
        fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
        fontSize="14.5"
        fontWeight="850"
        fill="#5D2E8E"
        letterSpacing="-0.3"
      >
        Khalti
      </text>
    </svg>
  );
}

export function FonepayLogo({ height = 24, className = '' }) {
  return (
    <svg
      height={height}
      viewBox="0 0 108 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Fonepay"
    >
      {/* Red rounded emblem */}
      <rect x="1" y="2" width="28" height="28" rx="8" fill="#E2231A" />
      {/* Stylized 'f' & signal waves */}
      <path
        d="M17.5 9.5H14C12.3 9.5 11 10.8 11 12.5V23H14V17H17V14H14V12.5C14 12.2 14.2 12 14.5 12H17.5V9.5Z"
        fill="#FFFFFF"
      />
      <circle cx="20.5" cy="11.5" r="1.5" fill="#FFFFFF" />
      <circle cx="20.5" cy="16.5" r="1.5" fill="#FFFFFF" />
      {/* 'fonepay' wordmark */}
      <text
        x="33"
        y="21"
        fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
        fontSize="14.5"
        fontWeight="850"
        fill="#E2231A"
        letterSpacing="-0.3"
      >
        fonepay
      </text>
    </svg>
  );
}

export function ConnectIpsLogo({ height = 24, className = '' }) {
  return (
    <svg
      height={height}
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ConnectIPS"
    >
      {/* Blue rounded emblem */}
      <rect x="1" y="2" width="28" height="28" rx="8" fill="#005CAB" />
      {/* Connection link nodes */}
      <circle cx="10" cy="16" r="3" fill="#FFFFFF" />
      <circle cx="20" cy="16" r="3" fill="#FFFFFF" />
      <path d="M10 16H20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M15 11L18 16L15 21" stroke="#FDB913" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* 'connectIPS' wordmark */}
      <text
        x="33"
        y="21"
        fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
        fontSize="13"
        fontWeight="700"
        fill="#005CAB"
        letterSpacing="-0.2"
      >
        connect<tspan fontWeight="900" fill="#E31837">IPS</tspan>
      </text>
    </svg>
  );
}

export function SctLogo({ height = 24, className = '' }) {
  return (
    <svg
      height={height}
      viewBox="0 0 94 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SCT"
    >
      {/* Teal/dark blue card emblem */}
      <rect x="1" y="2" width="28" height="28" rx="8" fill="#0B7A75" />
      {/* SCT card shape & ribbon */}
      <rect x="5" y="8" width="20" height="15" rx="3" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
      <line x1="5" y1="12.5" x2="25" y2="12.5" stroke="#FFFFFF" strokeWidth="1.8" />
      <rect x="8" y="15.5" width="4" height="4" rx="1" fill="#FDB913" />
      {/* 'SCT' wordmark */}
      <text
        x="33"
        y="21"
        fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
        fontSize="14"
        fontWeight="900"
        fill="#0B7A75"
        letterSpacing="0.2"
      >
        SCT
      </text>
    </svg>
  );
}
