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
    default: 'LuxStay - Immobilier de luxe au Bénin | Achat, Location, Parcelles',
    template: '%s | LuxStay',
  },
  description:
    'LuxStay est la plateforme immobilière de référence au Bénin. Trouvez votre chez-vous idéal parmi des milliers de biens vérifiés : appartements, villas, parcelles à Cotonou, Porto-Novo, Parakou et Abomey-Calavi. Achetez, louez ou investissez en toute confiance avec LuxStay.',
  keywords: [
    'immobilier Bénin',
    'Cotonou',
    'appartement à louer Bénin',
    'villa à vendre Cotonou',
    'parcelle Bénin',
    'location maison Bénin',
    'achat immobilier Bénin',
    'luxstay',
    'agence immobilière Bénin',
    'Porto-Novo',
    'Parakou',
    'Abomey-Calavi',
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
    title: 'LuxStay - Immobilier de luxe au Bénin | Achat, Location, Parcelles',
    description:
      'Trouvez votre chez-vous idéal au Bénin. Des milliers de biens vérifiés : appartements, villas, parcelles à Cotonou et partout au Bénin.',
    url: 'https://luxstay-bj.vercel.app',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LuxStay - La plateforme immobilière de référence au Bénin',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@luxstay_bj',
    creator: '@luxstay_bj',
    title: 'LuxStay - Immobilier de luxe au Bénin',
    description:
      'Trouvez votre chez-vous idéal au Bénin. Appartements, villas, parcelles à Cotonou, Porto-Novo, Parakou.',
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
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '64x64' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192' },
      { url: '/icon-512.png', sizes: '512x512' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#1A5F4A' },
    ],
  },
  manifest: '/manifest.json',
  category: 'real estate',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Icônes */}
        <link rel="icon" href="/favicon.png" type="image/png" sizes="64x64" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/icon-512.png" sizes="512x512" />
        
        {/* PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Préchargement */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
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