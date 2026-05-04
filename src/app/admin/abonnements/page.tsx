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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-500' },
          { label: 'Actifs', value: stats.actifs, color: 'bg-green-500' },
          { label: 'Premium', value: stats.premium, color: 'bg-luxury-gold' },
          { label: 'Business', value: stats.business, color: 'bg-purple-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-card p-3 sm:p-4">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 ${s.color} rounded-xl flex items-center justify-center text-white mb-2`}>
              <Crown size={16} className="sm:size-[18px]" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-luxury-green-dark">{s.value}</p>
            <p className="text-xs sm:text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Vue Cartes Mobile */}
      <div className="lg:hidden space-y-3">
        {abonnements.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl shadow-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-sm text-luxury-green-dark">
                  {a.user.prenom} {a.user.nom}
                </p>
                <p className="text-xs text-gray-400 truncate">{a.user.email}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                a.plan === 'BUSINESS' ? 'bg-purple-100 text-purple-700' :
                a.plan === 'PREMIUM' ? 'bg-luxury-gold/20 text-luxury-gold-dark' :
                a.plan === 'STANDARD' ? 'bg-luxury-green/10 text-luxury-green' :
                'bg-gray-100 text-gray-600'
              }`}>
                {a.plan}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                {a.actif ? (
                  <span className="text-green-600">● Actif</span>
                ) : (
                  <span className="text-red-600">● Inactif</span>
                )}
              </span>
              <span>{a.annoncesUtilisees}/{a.annoncesMax === 999999 ? '∞' : a.annoncesMax} annonces</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={12} />
              <span>Expire le {new Date(a.fin).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table Desktop */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-luxury-sand-light text-left">
                <th className="p-4 text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Utilisateur</th>
                <th className="p-4 text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Plan</th>
                <th className="p-4 text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Statut</th>
                <th className="p-4 text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Annonces</th>
                <th className="p-4 text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Expire le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {abonnements.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <p className="font-medium text-sm">{a.user.prenom} {a.user.nom}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{a.user.email}</p>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      a.plan === 'BUSINESS' ? 'bg-purple-100 text-purple-700' :
                      a.plan === 'PREMIUM' ? 'bg-luxury-gold/20 text-luxury-gold-dark' :
                      a.plan === 'STANDARD' ? 'bg-luxury-green/10 text-luxury-green' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {a.plan}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {a.actif ? (
                      <span className="text-xs text-green-600">● Actif</span>
                    ) : (
                      <span className="text-xs text-red-600">● Inactif</span>
                    )}
                  </td>
                  <td className="p-4 text-sm whitespace-nowrap">
                    {a.annoncesUtilisees}/{a.annoncesMax === 999999 ? '∞' : a.annoncesMax}
                  </td>
                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap flex items-center gap-1">
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