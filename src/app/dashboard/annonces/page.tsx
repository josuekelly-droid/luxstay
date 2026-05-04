// src/app/dashboard/annonces/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle, Search, Filter, Eye, Edit, Trash2, Loader2, TrendingUp } from 'lucide-react';
import { BadgeStatut, BadgeBoost } from '@/components/ui/Badges';
import toast from 'react-hot-toast';

// Type pour les annonces
interface Annonce {
  id: string;
  titre: string;
  prix: number;
  transaction: string;
  ville: string;
  quartier: string;
  statut: string;
  boost: boolean;
  prioritaire: boolean;
  epinglee: boolean;
  vues: number;
  datePublication: string | null;
  images: { url: string; principale: boolean }[];
  _count?: { favoris: number };
}

export default function MesAnnoncesPage() {
  const router = useRouter();
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtre, setFiltre] = useState('tous');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Charger les annonces depuis l'API
  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      const response = await fetch('/api/annonces');
      const data = await response.json();

      if (response.ok) {
        setAnnonces(data.annonces || []);
      } else {
        toast.error(data.error || 'Erreur lors du chargement');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les annonces
  const annoncesFiltrees = filtre === 'tous'
    ? annonces
    : annonces.filter(a => a.statut === filtre);

  // Supprimer une annonce
  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.')) {
      return;
    }

    setDeleteId(id);

    try {
      const response = await fetch(`/api/annonces/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAnnonces(annonces.filter(a => a.id !== id));
        toast.success('Annonce supprimée avec succès');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setDeleteId(null);
    }
  };

  // Image principale ou placeholder
  const getImagePrincipale = (annonce: Annonce) => {
    const imgPrincipale = annonce.images?.find(img => img.principale);
    return imgPrincipale?.url || annonce.images?.[0]?.url || '/placeholder-bien.jpg';
  };

  // Formater le prix
  const formatPrix = (prix: number) => {
    return new Intl.NumberFormat('fr-FR').format(Math.round(prix));
  };

  // Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={40} className="text-luxury-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-luxury-green-dark">Mes annonces</h2>
          <p className="text-gray-500 text-sm mt-1">
            {annonces.length} annonce{annonces.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <Link
          href="/dashboard/annonces/creer"
          className="btn-primary flex items-center gap-2 self-start"
        >
          <PlusCircle size={20} />
          Publier une annonce
        </Link>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl shadow-card p-4 flex flex-wrap gap-3 items-center">
        <Filter size={18} className="text-gray-400" />
        {[
          { value: 'tous', label: 'Toutes' },
          { value: 'PUBLIEE', label: 'Publiées' },
          { value: 'EN_ATTENTE', label: 'En attente' },
          { value: 'REFUSEE', label: 'Refusées' },
          { value: 'EXPIREE', label: 'Expirées' },
          { value: 'BROUILLON', label: 'Brouillons' },
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
            {f.value !== 'tous' && (
              <span className="ml-1 text-xs">
                ({annonces.filter(a => a.statut === f.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Liste des annonces */}
      {annoncesFiltrees.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          {annonces.length === 0 ? (
            <>
              <PlusCircle size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">
                Vous n&apos;avez pas encore d&apos;annonce
              </h3>
              <p className="text-gray-400 mb-4">
                Publiez votre première annonce dès maintenant !
              </p>
              <Link
                href="/dashboard/annonces/creer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <PlusCircle size={20} /> Publier une annonce
              </Link>
            </>
          ) : (
            <>
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">
                Aucune annonce trouvée
              </h3>
              <p className="text-gray-400">
                Aucune annonce ne correspond au filtre &quot;{filtre.toLowerCase()}&quot;
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {annoncesFiltrees.map((annonce) => (
            <div
              key={annonce.id}
              className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-luxury transition"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="sm:w-48 h-48 sm:h-auto relative bg-gray-100 flex-shrink-0">
                  <img
                    src={getImagePrincipale(annonce)}
                    alt={annonce.titre}
                    className="w-full h-full object-cover"
                  />
                  {annonce.boost && (
                    <div className="absolute top-2 left-2">
                      <BadgeBoost size="sm" />
                    </div>
                  )}
                  {annonce.prioritaire && (
                    <div className="absolute top-2 right-2">
                      <span className="badge-premium text-xs">Prioritaire</span>
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-luxury-green-dark line-clamp-1">
                        {annonce.titre}
                      </h3>
                      <BadgeStatut statut={annonce.statut} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                      <span className="font-bold text-luxury-green text-lg">
                        {formatPrix(annonce.prix)} FCFA
                        {annonce.transaction === 'LOCATION' && (
                          <span className="text-sm font-normal">/mois</span>
                        )}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>{annonce.quartier}, {annonce.ville}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{annonce.transaction === 'VENTE' ? 'À vendre' : 'À louer'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Eye size={16} />
                      <span>{annonce.vues} vues</span>
                      {annonce.datePublication && (
                        <>
                          <span>•</span>
                          <span>
                            Publiée le {new Date(annonce.datePublication).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </>
                      )}
                      {annonce.statut === 'BROUILLON' && (
                        <span className="text-luxury-gold-dark">• Brouillon</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Voir / Prévisualiser */}
                      <Link
                        href={`/bien/${annonce.id}`}
                        target="_blank"
                        className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                        title="Prévisualiser l'annonce"
                      >
                        <Eye size={18} />
                      </Link>

                      {/* Modifier */}
                      <Link
                        href={`/dashboard/annonces/modifier/${annonce.id}`}
                        className="p-2 rounded-lg hover:bg-luxury-green/10 transition text-luxury-green"
                        title="Modifier l'annonce"
                      >
                        <Edit size={18} />
                      </Link>

                      {/* Booster */}
                      <Link
                        href={`/dashboard/annonces/boost/${annonce.id}`}
                        className="p-2 rounded-lg hover:bg-luxury-gold/10 transition text-luxury-gold"
                        title="Booster l'annonce"
                      >
                        <TrendingUp size={18} />
                      </Link>

                      {/* Supprimer */}
                      <button
                        onClick={() => handleDelete(annonce.id)}
                        disabled={deleteId === annonce.id}
                        className="p-2 rounded-lg hover:bg-red-50 transition text-red-500 disabled:opacity-50"
                        title="Supprimer l'annonce"
                      >
                        {deleteId === annonce.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}