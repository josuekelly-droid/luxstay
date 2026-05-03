// src/app/admin/annonces/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, CheckCircle, XCircle, Eye, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface AnnonceAdmin {
  id: string;
  titre: string;
  prix: number;
  ville: string;
  quartier: string;
  statut: string;
  datePublication: string | null;
  user: {
    nom: string;
    prenom: string;
    email: string;
  };
  images: { url: string }[];
}

export default function AdminAnnoncesPage() {
  const [annonces, setAnnonces] = useState<AnnonceAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtre, setFiltre] = useState('EN_ATTENTE');

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      const response = await fetch('/api/admin/annonces');
      const data = await response.json();
      if (response.ok) {
        setAnnonces(data.annonces);
      }
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidation = async (id: string, statut: string) => {
    try {
      const response = await fetch(`/api/admin/annonces/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut }),
      });

      if (response.ok) {
        setAnnonces(prev => prev.map(a => a.id === id ? { ...a, statut } : a));
        toast.success(statut === 'PUBLIEE' ? 'Annonce approuvée' : 'Annonce refusée');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const annoncesFiltrees = filtre === 'tous'
    ? annonces
    : annonces.filter(a => a.statut === filtre);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={40} className="text-luxury-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-luxury-green-dark">Validation des annonces</h2>
        <p className="text-gray-500 text-sm mt-1">
          {annonces.filter(a => a.statut === 'EN_ATTENTE').length} annonce(s) en attente
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl shadow-card p-4 flex flex-wrap gap-3">
        {[
          { value: 'tous', label: 'Toutes' },
          { value: 'EN_ATTENTE', label: 'En attente' },
          { value: 'PUBLIEE', label: 'Approuvées' },
          { value: 'REFUSEE', label: 'Refusées' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltre(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filtre === f.value
                ? 'bg-luxury-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Annonces */}
      <div className="space-y-4">
        {annoncesFiltrees.map((annonce) => (
          <div key={annonce.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-48 h-40 sm:h-auto relative bg-gray-100 flex-shrink-0">
                {annonce.images[0] ? (
                  <Image
                    src={annonce.images[0].url}
                    alt={annonce.titre}
                    fill
                    sizes="192px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    Pas d&apos;image
                  </div>
                )}
              </div>

              <div className="flex-1 p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-semibold text-luxury-green-dark">{annonce.titre}</h3>
                    <p className="text-sm text-gray-500">
                      {annonce.prix.toLocaleString('fr-FR')} FCFA • {annonce.quartier}, {annonce.ville}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Par {annonce.user.prenom} {annonce.user.nom} ({annonce.user.email})
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    annonce.statut === 'PUBLIEE' ? 'bg-green-100 text-green-700' :
                    annonce.statut === 'REFUSEE' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {annonce.statut === 'PUBLIEE' ? 'Approuvée' :
                     annonce.statut === 'REFUSEE' ? 'Refusée' : 'En attente'}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Link
                    href={`/bien/${annonce.id}`}
                    target="_blank"
                    className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                    title="Prévisualiser"
                  >
                    <Eye size={18} />
                  </Link>

                  {annonce.statut === 'EN_ATTENTE' && (
                    <>
                      <button
                        onClick={() => handleValidation(annonce.id, 'PUBLIEE')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition"
                      >
                        <CheckCircle size={16} /> Approuver
                      </button>
                      <button
                        onClick={() => handleValidation(annonce.id, 'REFUSEE')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition"
                      >
                        <XCircle size={16} /> Refuser
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}