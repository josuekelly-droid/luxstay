// src/app/not-found.tsx
import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-luxury-sand-light px-4">
      <div className="text-center">
        {/* Grand 404 */}
        <h1 className="font-display text-9xl font-bold text-luxury-green/20 mb-4">404</h1>
        
        <div className="w-20 h-20 bg-white rounded-2xl shadow-luxury flex items-center justify-center mx-auto mb-8 -mt-16 relative z-10">
          <Search size={32} className="text-luxury-gold" />
        </div>

        <h2 className="font-display text-3xl font-bold text-luxury-green-dark mb-4">
          Page introuvable
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          La page que vous recherchez n&apos;existe pas ou a été déplacée. 
          Vérifiez l&apos;URL ou retournez à l&apos;accueil.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/" className="btn-primary flex items-center gap-2">
            <Home size={20} /> Retour à l&apos;accueil
          </Link>
          <Link href="/recherche" className="btn-secondary flex items-center gap-2">
            <Search size={20} /> Rechercher un bien
          </Link>
        </div>
      </div>
    </main>
  );
}