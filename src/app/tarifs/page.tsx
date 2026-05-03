// src/app/tarifs/page.tsx
'use client';

import { Check, X, Crown } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    nom: 'Gratuit',
    prix: '0 FCFA',
    description: 'Pour débuter',
    annonces: '5 annonces/mois',
    photos: '5 photos/annonce',
    badge: false,
    support: 'Email (48h)',
    stats: 'Basiques',
    couleur: 'border-gray-300',
    bouton: 'Commencer',
    lien: '/inscription',
  },
  {
    nom: 'Standard',
    prix: '15 000 FCFA',
    description: 'Pour les agents',
    annonces: '15 annonces/mois',
    photos: '10 photos/annonce',
    badge: false,
    support: 'Email (24h)',
    stats: 'Avancées',
    couleur: 'border-luxury-green',
    bouton: 'Choisir',
    lien: '/inscription',
    populaire: false,
  },
  {
    nom: 'Premium',
    prix: '35 000 FCFA',
    description: 'Le plus populaire',
    annonces: '50 annonces/mois',
    photos: '20 photos/annonce',
    badge: true,
    support: 'Chat + Email',
    stats: 'Avancées',
    couleur: 'border-luxury-gold',
    bouton: 'Choisir',
    lien: '/inscription',
    populaire: true,
  },
  {
    nom: 'Business',
    prix: '70 000 FCFA',
    description: 'Pour les pros',
    annonces: 'Illimité',
    photos: '30 photos/annonce',
    badge: true,
    support: 'Dédié',
    stats: 'Complètes',
    couleur: 'border-luxury-green-dark',
    bouton: 'Choisir',
    lien: '/inscription',
  },
];

export default function TarifsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-luxury-sand-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl font-bold text-luxury-green-dark mb-4">
            Nos offres
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins et commencez à publier vos annonces
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-card p-8 border-2 ${plan.couleur} relative ${
                plan.populaire ? 'scale-105 shadow-elevated' : ''
              }`}
            >
              {plan.populaire && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-luxury-gold text-luxury-green-dark text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                  <Crown size={12} /> Populaire
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="font-display text-xl font-bold text-luxury-green-dark mb-2">
                  {plan.nom}
                </h3>
                <p className="text-3xl font-bold text-luxury-green">{plan.prix}</p>
                <p className="text-sm text-gray-400 mt-1">/mois</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-green-500" />
                  {plan.annonces}
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-green-500" />
                  {plan.photos}
                </li>
                <li className="flex items-center gap-2 text-sm">
                  {plan.badge ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <X size={16} className="text-red-400" />
                  )}
                  Badge vérifié
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-green-500" />
                  {plan.support}
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-green-500" />
                  Stats {plan.stats.toLowerCase()}
                </li>
              </ul>

              <Link
                href={plan.lien}
                className={`block text-center py-3 rounded-xl font-semibold transition ${
                  plan.populaire
                    ? 'btn-premium'
                    : 'btn-secondary'
                }`}
              >
                {plan.bouton}
              </Link>
            </div>
          ))}
        </div>

        {/* Tarifs 3 mois et annuels */}
        <div className="mt-16 text-center">
          <h2 className="font-display text-3xl font-bold text-luxury-green-dark mb-8">
            Économisez avec nos offres longues durées
          </h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm text-gray-600">
            <div className="bg-white rounded-xl p-4 shadow-card">
              <span className="font-bold text-luxury-green">-15%</span> sur 3 mois
            </div>
            <div className="bg-white rounded-xl p-4 shadow-card">
              <span className="font-bold text-luxury-green">-30%</span> sur 1 an
            </div>
            <div className="bg-white rounded-xl p-4 shadow-card">
              Paiement sécurisé via <span className="font-bold text-luxury-gold-dark">Mobile Money - PayPal - Cryptos</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}