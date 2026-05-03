// src/app/parcelles/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Maximize, Eye, Loader2, ArrowLeft } from 'lucide-react';

interface Annonce {
  id: string;
  titre: string;
  prix: number;
  transaction: string;
  ville: string;
  quartier: string;
  surface: number | null;
  vues: number;
  images: { url: string }[];
}

export default function ParcellesPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      const response = await fetch('/api/biens?type=PARCELLE&limit=9');
      const data = await response.json();
      if (response.ok) setAnnonces(data.annonces);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrix = (prix: number) => new Intl.NumberFormat('fr-FR').format(Math.round(prix));

  return (
    <main className="min-h-screen pt-24 pb-16 bg-luxury-sand-light">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-luxury-green mb-6 transition">
          <ArrowLeft size={16} /> Retour à l&apos;accueil
        </Link>

        <h1 className="font-display text-4xl font-bold text-luxury-green-dark mb-2">Parcelles</h1>
        <p className="text-gray-500 mb-8">Découvrez toutes les parcelles disponibles au Bénin</p>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="text-luxury-green animate-spin" />
          </div>
        ) : annonces.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Aucune parcelle disponible pour le moment.</p>
            <Link href="/recherche" className="btn-primary mt-4 inline-flex items-center gap-2">
              Voir tous les biens
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map((annonce) => (
              <Link key={annonce.id} href={`/bien/${annonce.id}`} className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-luxury transition group">
                <div className="relative h-52 overflow-hidden">
                  <Image src={annonce.images[0]?.url || '/placeholder-bien.jpg'} alt={annonce.titre} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-luxury-green text-white text-xs px-3 py-1 rounded-full">
                      {annonce.transaction === 'VENTE' ? 'À vendre' : 'À louer'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-luxury-green-dark mb-2 line-clamp-1">{annonce.titre}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                    <MapPin size={14} className="text-luxury-gold" />
                    <span>{annonce.quartier}, {annonce.ville}</span>
                  </div>
                  <div className="text-xl font-bold text-luxury-green mb-3">
                    {formatPrix(annonce.prix)} FCFA
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    {annonce.surface && <span className="flex items-center gap-1"><Maximize size={14} /> {annonce.surface} m²</span>}
                    <span className="flex items-center gap-1 ml-auto"><Eye size={14} /> {annonce.vues}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}