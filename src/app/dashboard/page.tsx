// src/app/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home, PlusCircle, MessageSquare, Heart, TrendingUp,
  Eye, CreditCard, ArrowRight, Loader2,
} from 'lucide-react';

interface StatsData {
  annoncesActives: number;
  vuesTotal: number;
  messagesNouveaux: number;
  favorisTotal: number;
  planActuel: string;
  annoncesMax: number;
  annoncesUtilisees: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
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

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Annonces actives', value: stats?.annoncesActives || 0, icon: <Home size={24} />, color: 'bg-luxury-green', lien: '/dashboard/annonces' },
          { label: 'Vues ce mois', value: stats?.vuesTotal || 0, icon: <Eye size={24} />, color: 'bg-blue-500', lien: '/dashboard/annonces' },
          { label: 'Nouveaux messages', value: stats?.messagesNouveaux || 0, icon: <MessageSquare size={24} />, color: 'bg-luxury-gold', lien: '/dashboard/messages' },
          { label: 'Favoris', value: stats?.favorisTotal || 0, icon: <Heart size={24} />, color: 'bg-red-500', lien: '/dashboard/favoris' },
        ].map((stat, index) => (
          <Link key={index} href={stat.lien} className="bg-white rounded-2xl shadow-card p-6 hover:shadow-luxury transition group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-luxury-green-dark">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Abonnement actuel */}
      {stats && (
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="font-display text-xl font-bold text-luxury-green-dark mb-4">Votre abonnement</h3>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                stats.planActuel === 'PREMIUM' ? 'badge-premium' :
                stats.planActuel === 'BUSINESS' ? 'bg-purple-100 text-purple-700' :
                stats.planActuel === 'STANDARD' ? 'bg-luxury-green/10 text-luxury-green' :
                'bg-gray-100 text-gray-600'
              }`}>
                {stats.planActuel}
              </span>
              <p className="text-sm text-gray-500 mt-2">
                {stats.annoncesUtilisees}/{stats.annoncesMax} annonces utilisées
              </p>
              <div className="w-48 h-2 bg-gray-200 rounded-full mt-2">
                <div
                  className="h-full bg-luxury-green rounded-full"
                  style={{ width: `${Math.min(100, (stats.annoncesUtilisees / stats.annoncesMax) * 100)}%` }}
                />
              </div>
            </div>
            <Link href="/dashboard/abonnement" className="text-luxury-green font-semibold text-sm hover:underline">
              Gérer mon abonnement →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}