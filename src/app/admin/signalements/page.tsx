// src/app/admin/signalements/page.tsx
import { Flag, Shield } from 'lucide-react';

export default function AdminSignalementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-luxury-green-dark">Signalements</h2>
        <p className="text-gray-500 text-sm mt-1">Gestion des signalements</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-3">
            <Flag size={24} className="text-red-600" />
          </div>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-gray-500">En attente</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
            <Shield size={24} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-gray-500">Résolus</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
            <Flag size={24} className="text-gray-600" />
          </div>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-16 text-center">
        <Flag size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-500">Aucun signalement</h3>
        <p className="text-gray-400">Les signalements apparaîtront ici</p>
      </div>
    </div>
  );
}