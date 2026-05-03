// src/app/admin/parametres/page.tsx
import { Settings } from 'lucide-react';

export default function AdminParametresPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-luxury-green-dark">Paramètres</h2>
      <div className="bg-white rounded-2xl shadow-card p-16 text-center">
        <Settings size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-500">Configuration</h3>
        <p className="text-gray-400">Paramètres de la plateforme à venir</p>
      </div>
    </div>
  );
}