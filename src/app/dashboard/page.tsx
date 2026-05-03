// // src/app/dashboard/page.tsx
// 'use client';

// import { useSession } from 'next-auth/react';
// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import {
//   Home, PlusCircle, MessageSquare, Heart, TrendingUp,
//   Eye, CreditCard, ArrowRight, Loader2,
// } from 'lucide-react';

// interface StatsData {
//   annoncesActives: number;
//   vuesTotal: number;
//   messagesNouveaux: number;
//   favorisTotal: number;
//   planActuel: string;
//   annoncesMax: number;
//   annoncesUtilisees: number;
// }

// export default function DashboardPage() {
//   const { data: session } = useSession();
//   const [stats, setStats] = useState<StatsData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const response = await fetch('/api/dashboard/stats');
//       const data = await response.json();
//       if (response.ok) {
//         setStats(data.stats);
//       }
//     } catch (error) {
//       console.error('Erreur chargement stats:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <Loader2 size={40} className="text-luxury-green animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Stats */}
//       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {[
//           { label: 'Annonces actives', value: stats?.annoncesActives || 0, icon: <Home size={24} />, color: 'bg-luxury-green', lien: '/dashboard/annonces' },
//           { label: 'Vues ce mois', value: stats?.vuesTotal || 0, icon: <Eye size={24} />, color: 'bg-blue-500', lien: '/dashboard/annonces' },
//           { label: 'Nouveaux messages', value: stats?.messagesNouveaux || 0, icon: <MessageSquare size={24} />, color: 'bg-luxury-gold', lien: '/dashboard/messages' },
//           { label: 'Favoris', value: stats?.favorisTotal || 0, icon: <Heart size={24} />, color: 'bg-red-500', lien: '/dashboard/favoris' },
//         ].map((stat, index) => (
//           <Link key={index} href={stat.lien} className="bg-white rounded-2xl shadow-card p-6 hover:shadow-luxury transition group">
//             <div className="flex items-center gap-4">
//               <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
//                 {stat.icon}
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-luxury-green-dark">{stat.value}</p>
//                 <p className="text-sm text-gray-500">{stat.label}</p>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>

//       {/* Abonnement actuel */}
//       {stats && (
//         <div className="bg-white rounded-2xl shadow-card p-6">
//           <h3 className="font-display text-xl font-bold text-luxury-green-dark mb-4">Votre abonnement</h3>
//           <div className="flex items-center justify-between flex-wrap gap-4">
//             <div>
//               <span className={`text-sm font-bold px-3 py-1 rounded-full ${
//                 stats.planActuel === 'PREMIUM' ? 'badge-premium' :
//                 stats.planActuel === 'BUSINESS' ? 'bg-purple-100 text-purple-700' :
//                 stats.planActuel === 'STANDARD' ? 'bg-luxury-green/10 text-luxury-green' :
//                 'bg-gray-100 text-gray-600'
//               }`}>
//                 {stats.planActuel}
//               </span>
//               <p className="text-sm text-gray-500 mt-2">
//                 {stats.annoncesUtilisees}/{stats.annoncesMax} annonces utilisées
//               </p>
//               <div className="w-48 h-2 bg-gray-200 rounded-full mt-2">
//                 <div
//                   className="h-full bg-luxury-green rounded-full"
//                   style={{ width: `${Math.min(100, (stats.annoncesUtilisees / stats.annoncesMax) * 100)}%` }}
//                 />
//               </div>
//             </div>
//             <Link href="/dashboard/abonnement" className="text-luxury-green font-semibold text-sm hover:underline">
//               Gérer mon abonnement →
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





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

  // Rediriger les admins vers /admin
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
      <div className="space-y-8">
        {/* Message de bienvenue */}
        <div className="bg-gradient-to-r from-luxury-gold to-luxury-gold-light rounded-2xl p-8 text-center">
          <User size={48} className="text-luxury-green-dark mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-luxury-green-dark mb-3">
            Bienvenue, {(session?.user as any)?.prenom || 'Acheteur'} !
          </h2>
          <p className="text-luxury-green-dark/80 mb-6 max-w-lg mx-auto">
            Découvrez des biens immobiliers au Bénin, sauvegardez vos favoris et contactez les annonceurs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/recherche" className="btn-primary flex items-center gap-2">
              <Search size={20} /> Explorer les biens
            </Link>
            <Link href="/dashboard/abonnement" className="btn-secondary flex items-center gap-2 border-luxury-green-dark text-luxury-green-dark hover:bg-luxury-green-dark hover:text-white">
              <Briefcase size={20} /> Devenir annonceur
            </Link>
          </div>
        </div>

        {/* Stats acheteur */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/dashboard/favoris" className="bg-white rounded-2xl shadow-card p-6 hover:shadow-luxury transition group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Heart size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-luxury-green-dark">{stats?.favorisTotal || 0}</p>
                <p className="text-sm text-gray-500">Biens favoris</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/messages" className="bg-white rounded-2xl shadow-card p-6 hover:shadow-luxury transition group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-luxury-gold rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-luxury-green-dark">{stats?.messagesNouveaux || 0}</p>
                <p className="text-sm text-gray-500">Messages</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/profil" className="bg-white rounded-2xl shadow-card p-6 hover:shadow-luxury transition group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-luxury-green rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-luxury-green-dark">Mon profil</p>
                <p className="text-sm text-gray-500">Gérer mes informations</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Invitation devenir annonceur */}
        <div className="bg-white rounded-2xl shadow-card p-8 text-center">
          <Briefcase size={48} className="text-luxury-gold mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold text-luxury-green-dark mb-3">
            Vous avez des biens à vendre ou à louer ?
          </h3>
          <p className="text-gray-500 mb-6 max-w-lg mx-auto">
            Publiez vos annonces sur LuxStay et touchez des milliers d&apos;acheteurs potentiels au Bénin.
          </p>
          <Link href="/dashboard/abonnement" className="btn-primary inline-flex items-center gap-2">
            Voir les offres annonceur <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD ANNONCEUR (ANNOUNCER)
  // ==========================================
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