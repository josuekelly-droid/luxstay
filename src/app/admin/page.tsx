// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Home,
  CreditCard,
  TrendingUp,
  Loader2,
  ArrowRight,
  Eye,
  Zap,
  Crown,
  DollarSign,
} from 'lucide-react';

interface StatsAdmin {
  totalUtilisateurs: number;
  totalAnnonces: number;
  annoncesEnAttente: number;
  totalPaiements: number;
  revenuTotal: number;
  nouveauxUtilisateurs: number;
  tauxConversion: number;
  boostsActifs: number;
  prioritaires: number;
  revenuBoosts: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={40} className="text-luxury-green animate-spin" />
      </div>
    );
  }

  const cardsStats = [
    {
      label: 'Utilisateurs',
      value: stats?.totalUtilisateurs || 0,
      sous: `${stats?.nouveauxUtilisateurs || 0} nouveaux cette semaine`,
      icon: <Users size={24} />,
      color: 'bg-blue-500',
      lien: '/admin/utilisateurs',
    },
    {
      label: 'Annonces totales',
      value: stats?.totalAnnonces || 0,
      sous: `${stats?.annoncesEnAttente || 0} en attente de validation`,
      icon: <Home size={24} />,
      color: 'bg-luxury-green',
      lien: '/admin/annonces',
    },
    {
      label: 'Revenus',
      value: `${(stats?.revenuTotal || 0).toLocaleString('fr-FR')} FCFA`,
      sous: `${stats?.totalPaiements || 0} transactions`,
      icon: <DollarSign size={24} />,
      color: 'bg-luxury-gold',
      lien: '/admin/paiements',
    },
    {
      label: 'Taux de conversion',
      value: `${stats?.tauxConversion || 0}%`,
      sous: 'Utilisateurs → Annonceurs',
      icon: <TrendingUp size={24} />,
      color: 'bg-purple-500',
      lien: '#',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-luxury-green-dark">Vue d&apos;ensemble</h2>
        <p className="text-gray-500 text-sm mt-1">Bienvenue dans l&apos;administration LuxStay</p>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsStats.map((stat, index) => (
          <Link
            key={index}
            href={stat.lien}
            className="bg-white rounded-2xl shadow-card p-4 sm:p-6 hover:shadow-luxury transition group"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-luxury-green-dark">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3">{stat.sous}</p>
          </Link>
        ))}
      </div>

      {/* Stats Boosts */}
      <div>
        <h3 className="font-display text-lg font-bold text-luxury-green-dark mb-4 flex items-center gap-2">
          <Zap size={20} className="text-luxury-gold" /> Boosts & Visibilité
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-luxury-green-dark">{stats?.boostsActifs || 0}</p>
                <p className="text-xs sm:text-sm text-gray-500">Boosts actifs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white">
                <Crown size={20} />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-luxury-green-dark">{stats?.prioritaires || 0}</p>
                <p className="text-xs sm:text-sm text-gray-500">Prioritaires</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-luxury-gold rounded-xl flex items-center justify-center text-white">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-luxury-green-dark">
                  {(stats?.revenuBoosts || 0).toLocaleString('fr-FR')} FCFA
                </p>
                <p className="text-xs sm:text-sm text-gray-500">Revenus boosts</p>
              </div>
            </div>
          </div>

          <Link
            href="/admin/annonces?filtre=boost"
            className="bg-white rounded-2xl shadow-card p-4 sm:p-6 hover:shadow-luxury transition group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-luxury-green rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Eye size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-luxury-green-dark">Gérer les boosts</p>
                <p className="text-xs text-gray-500">Voir et désactiver</p>
              </div>
            </div>
            <span className="text-luxury-green font-semibold text-xs flex items-center gap-1">
              Accéder <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            titre: 'Annonces en attente',
            description: 'Validez les nouvelles annonces soumises par les utilisateurs',
            icon: <Eye size={28} />,
            lien: '/admin/annonces',
            couleur: 'bg-orange-50 text-orange-600',
            urgent: stats?.annoncesEnAttente,
          },
          {
            titre: 'Gérer les utilisateurs',
            description: 'Bloquez, débloquez ou modifiez les comptes utilisateurs',
            icon: <Users size={28} />,
            lien: '/admin/utilisateurs',
            couleur: 'bg-blue-50 text-blue-600',
          },
          {
            titre: 'Suivi des paiements',
            description: 'Consultez toutes les transactions et abonnements',
            icon: <CreditCard size={28} />,
            lien: '/admin/paiements',
            couleur: 'bg-green-50 text-green-600',
          },
        ].map((action, index) => (
          <Link
            key={index}
            href={action.lien}
            className="bg-white rounded-2xl shadow-card p-6 hover:shadow-luxury transition group"
          >
            <div className={`w-12 h-12 ${action.couleur} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-bold text-luxury-green-dark mb-2">
                  {action.titre}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{action.description}</p>
              </div>
              {action.urgent !== undefined && action.urgent > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {action.urgent}
                </span>
              )}
            </div>
            <span className="text-luxury-green font-semibold text-sm flex items-center gap-1">
              Accéder <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}