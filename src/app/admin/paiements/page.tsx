// src/app/admin/paiements/page.tsx
import { CreditCard } from 'lucide-react';

export default function AdminPaiementsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-luxury-green-dark">Paiements</h2>
      <div className="bg-white rounded-2xl shadow-card p-16 text-center">
        <CreditCard size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-500">Gestion des paiements</h3>
        <p className="text-gray-400">Suivi des transactions à venir</p>
      </div>
    </div>
  );
}