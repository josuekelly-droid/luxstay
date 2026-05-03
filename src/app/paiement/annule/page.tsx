// src/app/paiement/annule/page.tsx
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaiementAnnulePage() {
  return (
    <main className="min-h-screen pt-24 flex items-center justify-center bg-luxury-sand-light">
      <div className="text-center bg-white rounded-2xl shadow-luxury p-12 max-w-lg mx-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-600" />
        </div>
        <h1 className="font-display text-2xl font-bold text-luxury-green-dark mb-4">
          Paiement annulé
        </h1>
        <p className="text-gray-500 mb-8">
          Le paiement a été annulé. Aucun montant n&apos;a été débité.
        </p>
        <Link href="/tarifs" className="btn-primary inline-flex items-center gap-2">
          Voir les offres
        </Link>
      </div>
    </main>
  );
}