// src/app/admin/signalements/page.tsx
import { Flag } from 'lucide-react';

export default function AdminSignalementsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-luxury-green-dark">Signalements</h2>
      <div className="bg-white rounded-2xl shadow-card p-16 text-center">
        <Flag size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-500">Aucun signalement</h3>
        <p className="text-gray-400">Les signalements apparaîtront ici</p>
      </div>
    </div>
  );
}