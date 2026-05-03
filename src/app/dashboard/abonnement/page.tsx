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
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-luxury-green-dark">Mon abonnement</h2>

      {/* Abonnement actuel */}
      {abonnement && (
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-luxury-gold/10 rounded-2xl flex items-center justify-center">
              <Crown size={32} className="text-luxury-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-luxury-green-dark">
                Plan {abonnement.plan}
              </h3>
              <p className="text-sm text-gray-500">
                Expire le {new Date(abonnement.fin).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
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
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Photos par annonce</span>
              <span className="font-semibold">{abonnement.photosParAnnonce}</span>
            </div>
          </div>

          <Link href="/dashboard/annonces/creer" className="btn-primary inline-flex items-center gap-2">
            Publier une annonce
          </Link>
        </div>
      )}

      {/* Plans disponibles */}
      <div>
        <h3 className="font-display text-xl font-bold text-luxury-green-dark mb-6">
          Changer de plan
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.plan}
              className={`bg-white rounded-2xl shadow-card p-6 border-2 transition relative ${
                plan.populaire
                  ? 'border-luxury-gold scale-105 shadow-elevated'
                  : 'border-transparent hover:border-luxury-green/30'
              } ${abonnement?.plan === plan.plan ? 'border-luxury-green bg-luxury-green/5' : ''}`}
            >
              {plan.populaire && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-luxury-gold text-luxury-green-dark text-xs font-bold px-3 py-1 rounded-full">
                  Populaire
                </span>
              )}

              <h4 className="font-bold text-luxury-green-dark text-lg mb-1">{plan.nom}</h4>
              <p className="text-2xl font-bold text-luxury-green mb-4">{plan.prix}</p>

              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> {plan.annonces}
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> {plan.photos}
                </li>
                <li className="flex items-center gap-2">
                  {plan.badge ? (
                    <Check size={14} className="text-green-500" />
                  ) : (
                    <span className="w-3.5 h-3.5 flex items-center justify-center text-red-400">×</span>
                  )}
                  Badge vérifié
                </li>
              </ul>

              {abonnement?.plan === plan.plan ? (
                <span className="block text-center py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-600">
                  Plan actuel
                </span>
              ) : (
                <Link
                  href={`/paiement?plan=${plan.plan}`}
                  className={`block text-center py-2 rounded-xl text-sm font-semibold transition ${
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