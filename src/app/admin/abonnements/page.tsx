// src/app/admin/abonnements/page.tsx
import { Bell } from 'lucide-react';

export default function AdminAbonnementsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-luxury-green-dark">Abonnements</h2>
      <div className="bg-white rounded-2xl shadow-card p-16 text-center">
        <Bell size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-500">Gestion des abonnements</h3>
        <p className="text-gray-400">Suivi des abonnements à venir</p>
      </div>
    </div>
  );
}