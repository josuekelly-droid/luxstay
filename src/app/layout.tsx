// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'LuxStay - Immobilier de luxe au Bénin',
  description: 'Trouvez votre chez-vous idéal au Bénin. Achat, location, parcelles.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}