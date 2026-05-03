// src/app/dashboard/favoris/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Trash2, Loader2, Eye, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface Favori {
  id: string;
  annonce: {
    id: string;
    titre: string;
    prix: number;
    ville: string;
    quartier: string;
    transaction: string;
    images: { url: string }[];
  };
  createdAt: string;
}

export default function FavorisPage() {
  const [favoris, setFavoris] = useState<Favori[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFavoris();
  }, []);

  const fetchFavoris = async () => {
    try {
      const response = await fetch('/api/favoris');
      const data = await response.json();
      if (response.ok) {
        setFavoris(data.favoris);
      }
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`/api/favoris/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setFavoris(prev => prev.filter(f => f.id !== id));
        toast.success('Retiré des favoris');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const formatPrix = (prix: number) => new Intl.NumberFormat('fr-FR').format(Math.round(prix));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={40} className="text-luxury-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-luxury-green-dark">Mes favoris</h2>

      {favoris.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <Heart size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Aucun favori</h3>
          <p className="text-gray-400 mb-4">Ajoutez des biens en favoris pour les retrouver facilement.</p>
          <Link href="/recherche" className="btn-primary inline-flex items-center gap-2">
            Découvrir des biens
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoris.map((favori) => (
            <div key={favori.id} className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-luxury transition group">
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={favori.annonce.images[0]?.url || '/placeholder-bien.jpg'}
                  alt={favori.annonce.titre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handleRemove(favori.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-red-50 transition"
                >
                  <Heart size={18} className="fill-red-500 text-red-500" />
                </button>
                <div className="absolute bottom-3 left-3 bg-luxury-green/90 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  {formatPrix(favori.annonce.prix)} FCFA
                </div>
              </div>

              {/* Infos */}
              <div className="p-4">
                <h3 className="font-semibold text-luxury-green-dark line-clamp-1 mb-2">
                  {favori.annonce.titre}
                </h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                  <MapPin size={14} className="text-luxury-gold" />
                  <span>{favori.annonce.quartier}, {favori.annonce.ville}</span>
                </div>
                <Link
                  href={`/bien/${favori.annonce.id}`}
                  className="btn-primary w-full text-center text-sm flex items-center justify-center gap-2"
                >
                  <Eye size={16} /> Voir le bien
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}