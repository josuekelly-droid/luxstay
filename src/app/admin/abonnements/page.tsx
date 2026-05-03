// src/app/admin/abonnements/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Crown, Calendar } from 'lucide-react';

interface Abonnement {
  id: string;
  plan: string;
  duree: string;
  actif: boolean;
  debut: string;
  fin: string;
  annoncesMax: number;
  annoncesUtilisees: number;
  user: {
    nom: string;
    prenom: string;
    email: string;
  };
}

export default function AdminAbonnementsPage() {
  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAbonnements();
  }, []);

  const fetchAbonnements = async () => {
    try {
      const response = await fetch('/api/admin/abonnements');
      const data = await response.json();
      if (response.ok) setAbonnements(data.abonnements);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: abonnements.length,
    actifs: abonnements.filter(a => a.actif).length,
    premium: abonnements.filter(a => a.plan === 'PREMIUM').length,
    business: abonnements.filter(a => a.plan === 'BUSINESS').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={40} className="text-luxury-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-luxury-green-dark">Abonnements</h2>
        <p className="text-gray-500 text-sm mt-1">{abonnements.length} abonnements</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-500' },
          { label: 'Actifs', value: stats.actifs, color: 'bg-green-500' },
          { label: 'Premium', value: stats.premium, color: 'bg-luxury-gold' },
          { label: 'Business', value: stats.business, color: 'bg-purple-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-card p-4">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-white mb-2`}>
              <Crown size={20} />
            </div>
            <p className="text-2xl font-bold text-luxury-green-dark">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-luxury-sand-light text-left">
                <th className="p-4 text-sm font-semibold">Utilisateur</th>
                <th className="p-4 text-sm font-semibold">Plan</th>
                <th className="p-4 text-sm font-semibold">Statut</th>
                <th className="p-4 text-sm font-semibold">Annonces</th>
                <th className="p-4 text-sm font-semibold">Expire le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {abonnements.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <p className="font-medium text-sm">{a.user.prenom} {a.user.nom}</p>
                    <p className="text-xs text-gray-400">{a.user.email}</p>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      a.plan === 'BUSINESS' ? 'bg-purple-100 text-purple-700' :
                      a.plan === 'PREMIUM' ? 'bg-luxury-gold/20 text-luxury-gold-dark' :
                      a.plan === 'STANDARD' ? 'bg-luxury-green/10 text-luxury-green' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {a.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    {a.actif ? (
                      <span className="text-xs text-green-600">● Actif</span>
                    ) : (
                      <span className="text-xs text-red-600">● Inactif</span>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    {a.annoncesUtilisees}/{a.annoncesMax === 999999 ? '∞' : a.annoncesMax}
                  </td>
                  <td className="p-4 text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(a.fin).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}