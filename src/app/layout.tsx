// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatBot from '@/components/chatbot/ChatBot';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import CookieBanner from '@/components/layout/CookieBanner';

export const viewport: Viewport = {
  themeColor: '#1A5F4A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  
  title: {
    default: 'LuxStay - Immobilier au Bénin | Achat, Location & Vente de Biens',
    template: '%s | LuxStay - Immobilier Bénin',
  },

  
  description:
    'LuxStay, la plateforme immobilière n°1 au Bénin. Trouvez facilement votre appartement, villa, maison ou parcelle à Cotonou, Porto-Novo, Parakou, Abomey-Calavi et partout au Bénin. Achetez, louez ou investissez en toute sécurité avec des annonces 100% vérifiées. Paiement Mobile Money, PayPal et Crypto acceptés.',

  
  keywords: [
    'immobilier Bénin',
    'Cotonou',
    'appartement à louer Cotonou',
    'villa à vendre Bénin',
    'parcelle à vendre Cotonou',
    'location maison Bénin',
    'achat immobilier Bénin',
    'luxstay',
    'agence immobilière Bénin',
    'Porto-Novo',
    'Parakou',
    'Abomey-Calavi',
    'studio à louer Cotonou',
    'duplex Bénin',
    'terrain à vendre Parakou',
    'immobilier de luxe Bénin',
    'investissement immobilier Afrique',
    'location appartement meublé Cotonou',
    'prix villa Fidjrossè',
    'titre foncier Bénin',
    'acheter maison Cotonou',
    'louer studio Porto-Novo',
    'résidence moderne Bénin',
    'quartier résidentiel Cotonou',
    'annonce immobilière Bénin',
  ],

  
  authors: [{ name: 'LuxStay', url: 'https://luxstay-bj.vercel.app' }],
  creator: 'LuxStay',
  publisher: 'LuxStay',

  
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://luxstay-bj.vercel.app'),

  
  alternates: {
    canonical: '/',
  },

  
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'LuxStay',
    title: 'LuxStay - Immobilier au Bénin | Achat, Location & Vente de Biens',
    description:
      'La plateforme immobilière de référence au Bénin. Appartements, villas, parcelles vérifiés. Achetez, louez ou investissez en toute confiance avec LuxStay.',
    url: 'https://luxstay-bj.vercel.app',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LuxStay - La plateforme immobilière de référence au Bénin',
      },
    ],
    countryName: 'Bénin',
    emails: ['luxstayafrica@hotmail.com'],
    phoneNumbers: ['+229 54 66 62 68'],
  },

  
  twitter: {
    card: 'summary_large_image',
    site: '@luxstay_bj',
    creator: '@luxstay_bj',
    title: 'LuxStay - Immobilier de luxe au Bénin',
    description:
      'Trouvez votre chez-vous idéal au Bénin. Appartements, villas, parcelles à Cotonou, Porto-Novo, Parakou et Abomey-Calavi. Annonces vérifiées.',
    images: ['/og-image.png'],
  },

  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },

  
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '64x64' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192' },
      { url: '/icon-512.png', sizes: '512x512' },
    ],
    other: [{ rel: 'mask-icon', url: '/favicon.svg', color: '#1A5F4A' }],
  },

  
  manifest: '/manifest.json',

  // Catégorie pour Google
  category: 'real estate',

  
  applicationName: 'LuxStay',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://api-m.paypal.com" />

        {/* Préchargement */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />

        {/* Icônes */}
        <link rel="icon" href="/favicon.png" type="image/png" sizes="64x64" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/icon-512.png" sizes="512x512" />

        {/* PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Géolocalisation */}
        <meta name="geo.region" content="BJ" />
        <meta name="geo.placename" content="Cotonou" />
        <meta name="geo.position" content="6.3703;2.3912" />
        <meta name="ICBM" content="6.3703, 2.3912" />
      </head>
      <body>
        <SessionProvider>
          <Navbar />
          {children}
          <Footer />
          <ChatBot />
          <Analytics />
          <CookieBanner />
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}