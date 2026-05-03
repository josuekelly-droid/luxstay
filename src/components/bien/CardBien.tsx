// src/components/bien/CardBien.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Maximize, Heart, Eye, Bath } from 'lucide-react';
import { BadgePremium, BadgeVerified, BadgeBoost } from '@/components/ui/Badges';
import { formatPrix } from '@/lib/utils';
import { useState } from 'react';

interface BienCardProps {
  bien: {
    id: string;
    slug?: string;
    titre: string;
    type: string;
    transaction: string;
    prix: number;
    ville: string;
    quartier: string;
    chambres?: number;
    sallesBain?: number;
    surface?: number;
    imagePrincipale: string;
    prioritaire: boolean;
    epinglee: boolean;
    boost: boolean;
    vues: number;
  };
}

export function CardBien({ bien }: BienCardProps) {
  const [isFavori, setIsFavori] = useState(false);

  const slug = bien.slug || bien.id;

  return (
    <div className="card-luxury overflow-hidden group">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={bien.imagePrincipale || '/images/placeholder-bien.webp'}
          alt={bien.titre}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {bien.prioritaire && <BadgePremium size="sm" />}
          {bien.epinglee && <BadgeVerified size="sm" />}
          {bien.boost && <BadgeBoost size="sm" />}
        </div>

        {/* Type transaction */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-luxury-green">
          {bien.transaction === 'VENTE' ? 'À vendre' : 'À louer'}
        </div>

        {/* Prix */}
        <div className="absolute bottom-3 left-3 bg-luxury-green/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
          <span className="text-xl font-bold">{formatPrix(bien.prix)}</span>
          <span className="text-sm ml-1">FCFA</span>
          {bien.transaction === 'LOCATION' && (
            <span className="text-sm text-gray-300">/mois</span>
          )}
        </div>

        {/* Bouton favori */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavori(!isFavori);
          }}
          className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all"
        >
          <Heart
            size={20}
            className={`transition-colors ${
              isFavori ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      {/* Contenu */}
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-luxury-green-dark mb-2 line-clamp-1">
          {bien.titre}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 mb-3">
          <MapPin size={16} className="text-luxury-gold flex-shrink-0" />
          <span className="text-sm truncate">
            {bien.quartier}, {bien.ville}
          </span>
        </div>

        {/* Caractéristiques */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          {bien.chambres !== undefined && bien.chambres > 0 && (
            <div className="flex items-center gap-1">
              <Bed size={16} className="text-luxury-green" />
              <span>{bien.chambres} ch.</span>
            </div>
          )}
          {bien.sallesBain !== undefined && bien.sallesBain > 0 && (
            <div className="flex items-center gap-1">
              <Bath size={16} className="text-luxury-green" />
              <span>{bien.sallesBain} sdb</span>
            </div>
          )}
          {bien.surface !== undefined && bien.surface > 0 && (
            <div className="flex items-center gap-1">
              <Maximize size={16} className="text-luxury-green" />
              <span>{bien.surface} m²</span>
            </div>
          )}
          <div className="flex items-center gap-1 ml-auto text-gray-400">
            <Eye size={16} />
            <span>{bien.vues}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/bien/${slug}`}
            className="flex-1 text-center bg-luxury-green text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-luxury-green-light transition-colors"
          >
            Voir détails
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavori(!isFavori);
            }}
            className="p-2 border border-luxury-sand rounded-xl hover:bg-luxury-gold/10 transition"
            title="Ajouter aux favoris"
          >
            <Heart
              size={20}
              className={`transition-colors ${
                isFavori ? 'fill-luxury-gold text-luxury-gold' : 'text-luxury-gold'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}