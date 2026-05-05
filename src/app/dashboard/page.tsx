// src/app/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Home, PlusCircle, MessageSquare, Heart, TrendingUp,
  Eye, CreditCard, ArrowRight, Loader2, Search, User,
  Briefcase,
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
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const userRole = (session?.user as any)?.role || 'USER';

  useEffect(() => {
    if (userRole === 'ADMIN') {
      router.push('/admin');
    }
  }, [userRole, router]);

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

  // ==========================================
  // DASHBOARD ACHETEUR (USER)
  // ==========================================
  if (userRole === 'USER') {
    return (
      <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
        {/* Message de bienvenue */}
        <div className="bg-gradient-to-r from-luxury-gold to-luxury-gold-light rounded-2xl p-6 sm:p-8 text-center">
          <User size={40} className="sm:size-[48px] text-luxury-green-dark mx-auto mb-3 sm:mb-4" />
          <h2 className="font-display text-xl sm:text-2xl font-bold text-luxury-green-dark mb-2 sm:mb-3">
            Bienvenue, {(session?.user as any)?.prenom || 'Acheteur'} !
          </h2>
          <p className="text-luxury-green-dark/80 text-sm sm:text-base mb-5 sm:mb-6 max-w-lg mx-auto">
            Découvrez des biens immobiliers au Bénin, sauvegardez vos favoris et contactez les annonceurs.
          </p>
          <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
            <Link href="/recherche" className="btn-primary flex items-center gap-2 text-sm">
              <Search size={18} /> Explorer les biens
            </Link>
            <Link href="/dashboard/abonnement" className="btn-secondary flex items-center gap-2 text-sm border-luxury-green-dark text-luxury-green-dark hover:bg-luxury-green-dark hover:text-white">
              <Briefcase size={18} /> Devenir annonceur
            </Link>
          </div>
        </div>

        {/* Stats acheteur */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Link href="/dashboard/favoris" className="bg-white rounded-2xl shadow-card p-4 sm:p-6 hover:shadow-luxury transition group">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
                <Heart size={20} className="sm:size-[24px]" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-luxury-green-dark">{stats?.favorisTotal || 0}</p>
                <p className="text-xs sm:text-sm text-gray-500">Biens favoris</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/messages" className="bg-white rounded-2xl shadow-card p-4 sm:p-6 hover:shadow-luxury transition group">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-luxury-gold rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
                <MessageSquare size={20} className="sm:size-[24px]" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-luxury-green-dark">{stats?.messagesNouveaux || 0}</p>
                <p className="text-xs sm:text-sm text-gray-500">Messages</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/profil" className="bg-white rounded-2xl shadow-card p-4 sm:p-6 hover:shadow-luxury transition group sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-luxury-green rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
                <User size={20} className="sm:size-[24px]" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-semibold text-luxury-green-dark">Mon profil</p>
                <p className="text-xs sm:text-sm text-gray-500">Gérer mes informations</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Invitation devenir annonceur */}
        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8 text-center">
          <Briefcase size={40} className="sm:size-[48px] text-luxury-gold mx-auto mb-3 sm:mb-4" />
          <h3 className="font-display text-lg sm:text-xl font-bold text-luxury-green-dark mb-2 sm:mb-3">
            Vous avez des biens à vendre ou à louer ?
          </h3>
          <p className="text-gray-500 text-sm sm:text-base mb-5 sm:mb-6 max-w-lg mx-auto">
            Publiez vos annonces sur LuxStay et touchez des milliers d&apos;acheteurs potentiels au Bénin.
          </p>
          <Link href="/dashboard/abonnement" className="btn-primary inline-flex items-center gap-2 text-sm">
            Voir les offres annonceur <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD ANNONCEUR (ANNOUNCER)
  // ==========================================
  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Annonces actives', value: stats?.annoncesActives || 0, icon: <Home size={20} className="sm:size-[24px]" />, color: 'bg-luxury-green', lien: '/dashboard/annonces' },
          { label: 'Vues ce mois', value: stats?.vuesTotal || 0, icon: <Eye size={20} className="sm:size-[24px]" />, color: 'bg-blue-500', lien: '/dashboard/annonces' },
          { label: 'Nouveaux messages', value: stats?.messagesNouveaux || 0, icon: <MessageSquare size={20} className="sm:size-[24px]" />, color: 'bg-luxury-gold', lien: '/dashboard/messages' },
          { label: 'Favoris', value: stats?.favorisTotal || 0, icon: <Heart size={20} className="sm:size-[24px]" />, color: 'bg-red-500', lien: '/dashboard/favoris' },
        ].map((stat, index) => (
          <Link key={index} href={stat.lien} className="bg-white rounded-2xl shadow-card p-3 sm:p-6 hover:shadow-luxury transition group">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0`}>
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-luxury-green-dark">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Abonnement actuel */}
      {stats && (
        <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6">
          <h3 className="font-display text-lg sm:text-xl font-bold text-luxury-green-dark mb-3 sm:mb-4">Votre abonnement</h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className={`text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full ${
                stats.planActuel === 'PREMIUM' ? 'badge-premium' :
                stats.planActuel === 'BUSINESS' ? 'bg-purple-100 text-purple-700' :
                stats.planActuel === 'STANDARD' ? 'bg-luxury-green/10 text-luxury-green' :
                'bg-gray-100 text-gray-600'
              }`}>
                {stats.planActuel}
              </span>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                {stats.annoncesUtilisees}/{stats.annoncesMax} annonces utilisées
              </p>
              <div className="w-full sm:w-48 h-2 bg-gray-200 rounded-full mt-2">
                <div
                  className="h-full bg-luxury-green rounded-full"
                  style={{ width: `${Math.min(100, (stats.annoncesUtilisees / stats.annoncesMax) * 100)}%` }}
                />
              </div>
            </div>
            <Link href="/dashboard/abonnement" className="text-luxury-green font-semibold text-xs sm:text-sm hover:underline flex-shrink-0">
              Gérer mon abonnement →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}