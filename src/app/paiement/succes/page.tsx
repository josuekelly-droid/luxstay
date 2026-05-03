// src/app/paiement/succes/page.tsx
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PaiementSuccesPage() {
  return (
    <main className="min-h-screen pt-24 flex items-center justify-center bg-luxury-sand-light">
      <div className="text-center bg-white rounded-2xl shadow-luxury p-12 max-w-lg mx-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="font-display text-2xl font-bold text-luxury-green-dark mb-4">
          Paiement réussi !
        </h1>
        <p className="text-gray-500 mb-8">
          Votre abonnement a été activé avec succès. Vous pouvez maintenant profiter de votre nouveau plan.
        </p>
        <Link href="/dashboard/abonnement" className="btn-primary inline-flex items-center gap-2">
          Voir mon abonnement
        </Link>
      </div>
    </main>
  );
}