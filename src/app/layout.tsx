// src/app/layout.tsx
import ChatBot from '@/components/chatbot/ChatBot';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

export const viewport: Viewport = {
  themeColor: '#1A5F4A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'LuxStay - Immobilier de luxe au Bénin',
    template: '%s | LuxStay',
  },
  description: 'Trouvez votre chez-vous idéal au Bénin. Des milliers de biens vérifiés : appartements, villas, parcelles. Achetez, louez ou investissez en toute confiance.',
  keywords: ['immobilier', 'Bénin', 'Cotonou', 'appartement', 'villa', 'parcelle', 'location', 'vente', 'luxstay'],
  authors: [{ name: 'LuxStay' }],
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
    title: 'LuxStay - Immobilier de luxe au Bénin',
    description: 'Trouvez votre chez-vous idéal au Bénin. Des milliers de biens vérifiés.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'LuxStay - Immobilier Bénin',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuxStay - Immobilier de luxe au Bénin',
    description: 'Trouvez votre chez-vous idéal au Bénin.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/icon-192.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <SessionProvider>
          <Navbar />
          {children}
          <Footer />
          <ChatBot />
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}