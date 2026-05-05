// src/app/dashboard/abonnement/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface AbonnementInfo {
  plan: string;
  duree: string;
  debut: string;
  fin: string;
  annoncesMax: number;
  annoncesUtilisees: number;
  photosParAnnonce: number;
  actif: boolean;
}

const plans = [
  {
    nom: 'Gratuit',
    prix: '0 FCFA',
    annonces: '5 annonces/mois',
    photos: '5 photos/annonce',
    badge: false,
    plan: 'GRATUIT',
  },
  {
    nom: 'Standard',
    prix: '15 000 FCFA/mois',
    annonces: '15 annonces/mois',
    photos: '10 photos/annonce',
    badge: false,
    plan: 'STANDARD',
  },
  {
    nom: 'Premium',
    prix: '35 000 FCFA/mois',
    annonces: '50 annonces/mois',
    photos: '20 photos/annonce',
    badge: true,
    plan: 'PREMIUM',
    populaire: true,
  },
  {
    nom: 'Business',
    prix: '70 000 FCFA/mois',
    annonces: 'Illimité',
    photos: '30 photos/annonce',
    badge: true,
    plan: 'BUSINESS',
  },
];

export default function AbonnementPage() {
  const [abonnement, setAbonnement] = useState<AbonnementInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAbonnement();
  }, []);

  const fetchAbonnement = async () => {
    try {
      const response = await fetch('/api/abonnement');
      const data = await response.json();
      if (response.ok && data.abonnement) {
        setAbonnement(data.abonnement);
      }
    } catch (error) {
      toast.error('Erreur de chargement');
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
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      <h2 className="text-xl sm:text-2xl font-bold text-luxury-green-dark">Mon abonnement</h2>

      {/* Abonnement actuel */}
      {abonnement && (
        <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-luxury-gold/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Crown size={28} className="sm:size-[32px] text-luxury-gold" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-luxury-green-dark">
                Plan {abonnement.plan}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Expire le {new Date(abonnement.fin).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-5 sm:mb-6">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Annonces utilisées</span>
              <span className="font-semibold">
                {abonnement.annoncesUtilisees} / {abonnement.annoncesMax === 999999 ? '∞' : abonnement.annoncesMax}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-luxury-green rounded-full transition-all"
                style={{
                  width: `${abonnement.annoncesMax === 999999 ? 50 : Math.min(100, (abonnement.annoncesUtilisees / abonnement.annoncesMax) * 100)}%`
                }}
              />
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Photos par annonce</span>
              <span className="font-semibold">{abonnement.photosParAnnonce}</span>
            </div>
          </div>

          <Link href="/dashboard/annonces/creer" className="btn-primary inline-flex items-center gap-2 text-sm">
            Publier une annonce
          </Link>
        </div>
      )}

      {/* Plans disponibles */}
      <div>
        <h3 className="font-display text-lg sm:text-xl font-bold text-luxury-green-dark mb-4 sm:mb-6">
          Changer de plan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {plans.map((plan) => (
            <div
              key={plan.plan}
              className={`bg-white rounded-2xl shadow-card p-4 sm:p-6 border-2 transition relative ${
                plan.populaire
                  ? 'border-luxury-gold sm:scale-105 shadow-elevated'
                  : 'border-transparent hover:border-luxury-green/30'
              } ${abonnement?.plan === plan.plan ? 'border-luxury-green bg-luxury-green/5' : ''}`}
            >
              {plan.populaire && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-luxury-gold text-luxury-green-dark text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                  Populaire
                </span>
              )}

              <h4 className="font-bold text-luxury-green-dark text-base sm:text-lg mb-1">{plan.nom}</h4>
              <p className="text-xl sm:text-2xl font-bold text-luxury-green mb-3 sm:mb-4">{plan.prix}</p>

              <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm">
                <li className="flex items-center gap-2">
                  <Check size={12} className="sm:size-[14px] text-green-500 flex-shrink-0" /> {plan.annonces}
                </li>
                <li className="flex items-center gap-2">
                  <Check size={12} className="sm:size-[14px] text-green-500 flex-shrink-0" /> {plan.photos}
                </li>
                <li className="flex items-center gap-2">
                  {plan.badge ? (
                    <Check size={12} className="sm:size-[14px] text-green-500 flex-shrink-0" />
                  ) : (
                    <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex items-center justify-center text-red-400 text-xs">×</span>
                  )}
                  <span className="text-xs sm:text-sm">Badge vérifié</span>
                </li>
              </ul>

              {abonnement?.plan === plan.plan ? (
                <span className="block text-center py-2 bg-gray-100 rounded-xl text-xs sm:text-sm font-medium text-gray-600">
                  Plan actuel
                </span>
              ) : (
                <Link
                  href={`/paiement?plan=${plan.plan}`}
                  className={`block text-center py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    plan.populaire ? 'btn-premium' : 'btn-secondary'
                  }`}
                >
                  Choisir
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}