// src/components/layout/CookieBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import { usePathname } from 'next/navigation';

export default function CookieBanner() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
  
  if (isDashboard) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accepter"
      declineButtonText="Refuser"
      enableDeclineButton
      cookieName="luxstay-cookie-consent"
      style={{
        background: '#0F2A1E',
        color: '#E8D5B7',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        padding: '16px 24px',
        alignItems: 'center',
      }}
      buttonStyle={{
        background: '#D4A843',
        color: '#0F2A1E',
        fontSize: '14px',
        fontWeight: 600,
        borderRadius: '12px',
        padding: '10px 24px',
        border: 'none',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#E8D5B7',
        fontSize: '14px',
        fontWeight: 500,
        borderRadius: '12px',
        padding: '10px 24px',
        border: '2px solid #E8D5B7',
      }}
      expires={180}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div>
          <p className="font-semibold text-luxury-gold mb-1">🍪 Nous utilisons des cookies</p>
          <p className="text-sm text-gray-300">
            Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic.
            Vous pouvez les accepter ou les refuser.
          </p>
        </div>
      </div>
    </CookieConsent>
  );
}