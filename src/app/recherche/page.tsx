// src/app/recherche/page.tsx
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  MapPin,
  Bed,
  Maximize,
  Heart,
  Eye,
  Loader2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Annonce {
  id: string;
  titre: string;
  prix: number;
  type: string;
  transaction: string;
  ville: string;
  quartier: string;
  chambres: number | null;
  surface: number | null;
  statut: string;
  vues: number;
  prioritaire: boolean;
  epinglee: boolean;
  images: { url: string }[];
  _count: { favoris: number };
}

function RechercheContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filtresAvances, setFiltresAvances] = useState(false);

  const [filtres, setFiltres] = useState({
    type: searchParams.get('type') || '',
    transaction: searchParams.get('transaction') || '',
    ville: searchParams.get('ville') || '',
    prixMin: searchParams.get('prixMin') || '',
    prixMax: searchParams.get('prixMax') || '',
    chambres: '',
    surfaceMin: '',
    tri: 'recent',
    recherche: '',
  });

  const fetchAnnonces = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '9');
      if (filtres.type) params.set('type', filtres.type);
      if (filtres.transaction) params.set('transaction', filtres.transaction);
      if (filtres.ville) params.set('ville', filtres.ville);
      if (filtres.prixMin) params.set('prixMin', filtres.prixMin);
      if (filtres.prixMax) params.set('prixMax', filtres.prixMax);
      if (filtres.chambres) params.set('chambres', filtres.chambres);
      if (filtres.surfaceMin) params.set('surfaceMin', filtres.surfaceMin);
      if (filtres.tri) params.set('tri', filtres.tri);
      if (filtres.recherche) params.set('recherche', filtres.recherche);

      const response = await fetch(`/api/biens?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setAnnonces(data.annonces);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, filtres]);

  useEffect(() => {
    fetchAnnonces();
  }, [fetchAnnonces]);

  const formatPrix = (prix: number) => new Intl.NumberFormat('fr-FR').format(Math.round(prix));

  const handleChange = (field: string, value: string) => {
    setFiltres(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAnnonces();
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-luxury-sand-light">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-luxury-green-dark mb-8 text-center">
          Rechercher un bien
        </h1>

        <div className="bg-white rounded-2xl shadow-luxury p-6 max-w-4xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ville, quartier ou mot-clé..."
                value={filtres.recherche}
                onChange={(e) => handleChange('recherche', e.target.value)}
                className="input-luxury pl-10"
              />
            </div>
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Search size={20} /> Rechercher
            </button>
          </form>

          <div className="flex flex-wrap gap-3 mt-4">
            <select value={filtres.type} onChange={(e) => handleChange('type', e.target.value)} className="input-luxury text-sm w-auto">
              <option value="">Type de bien</option>
              <option value="APPARTEMENT">Appartement</option>
              <option value="MAISON">Maison</option>
              <option value="VILLA">Villa</option>
              <option value="STUDIO">Studio</option>
              <option value="DUPLEX">Duplex</option>
              <option value="PARCELLE">Parcelle</option>
            </select>
            <select value={filtres.transaction} onChange={(e) => handleChange('transaction', e.target.value)} className="input-luxury text-sm w-auto">
              <option value="">Transaction</option>
              <option value="VENTE">Vente</option>
              <option value="LOCATION">Location</option>
            </select>
            <select value={filtres.ville} onChange={(e) => handleChange('ville', e.target.value)} className="input-luxury text-sm w-auto">
              <option value="">Ville</option>
              <option value="Cotonou">Cotonou</option>
              <option value="Abomey-Calavi">Abomey-Calavi</option>
              <option value="Porto-Novo">Porto-Novo</option>
              <option value="Parakou">Parakou</option>
              <option value="Natitingou">Natitingou</option>
            </select>
            <select value={filtres.tri} onChange={(e) => handleChange('tri', e.target.value)} className="input-luxury text-sm w-auto">
              <option value="recent">Plus récents</option>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
              <option value="vues">Plus vus</option>
            </select>
            <button onClick={() => setFiltresAvances(!filtresAvances)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${filtresAvances ? 'bg-luxury-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <SlidersHorizontal size={16} /> Filtres avancés
            </button>
          </div>

          {filtresAvances && (
            <div className="grid sm:grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Prix min (FCFA)</label>
                <input type="number" value={filtres.prixMin} onChange={(e) => handleChange('prixMin', e.target.value)} className="input-luxury text-sm" placeholder="0" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Prix max (FCFA)</label>
                <input type="number" value={filtres.prixMax} onChange={(e) => handleChange('prixMax', e.target.value)} className="input-luxury text-sm" placeholder="100000000" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Chambres min</label>
                <select value={filtres.chambres} onChange={(e) => handleChange('chambres', e.target.value)} className="input-luxury text-sm">
                  <option value="">Toutes</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4 text-sm text-gray-500">
          {total} bien{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={40} className="text-luxury-green animate-spin" />
          </div>
        ) : annonces.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-16 text-center">
            <Search size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">Aucun bien trouvé</h3>
            <p className="text-gray-400">Essayez de modifier vos critères de recherche.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {annonces.map((annonce) => (
                <Link key={annonce.id} href={`/bien/${annonce.id}`} className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-luxury transition group">
                  <div className="relative h-52 overflow-hidden">
                    <Image src={annonce.images[0]?.url || '/placeholder-bien.jpg'} alt={annonce.titre} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-luxury-green text-white text-xs px-3 py-1 rounded-full">{annonce.transaction === 'VENTE' ? 'À vendre' : 'À louer'}</span>
                      {annonce.prioritaire && <span className="bg-luxury-gold text-luxury-green-dark text-xs px-3 py-1 rounded-full font-bold">Premium</span>}
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <button className="p-2 bg-white/90 rounded-full hover:bg-white transition"><Heart size={18} className="text-gray-400 hover:text-red-500" /></button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-luxury-green-dark mb-2 line-clamp-1">{annonce.titre}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                      <MapPin size={14} className="text-luxury-gold flex-shrink-0" /><span className="truncate">{annonce.quartier}, {annonce.ville}</span>
                    </div>
                    <div className="text-xl font-bold text-luxury-green mb-3">{formatPrix(annonce.prix)} FCFA{annonce.transaction === 'LOCATION' && <span className="text-sm font-normal text-gray-500">/mois</span>}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {annonce.chambres && <span className="flex items-center gap-1"><Bed size={14} /> {annonce.chambres}</span>}
                      {annonce.surface && <span className="flex items-center gap-1"><Maximize size={14} /> {annonce.surface} m²</span>}
                      <span className="flex items-center gap-1 ml-auto"><Eye size={14} /> {annonce.vues}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-3 rounded-xl bg-white shadow-card hover:bg-gray-50 disabled:opacity-50 transition"><ChevronLeft size={20} /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1).map((p, i, arr) => (
                  <span key={p}>
                    {i > 0 && arr[i - 1] !== p - 1 && <span className="px-2 text-gray-400">...</span>}
                    <button onClick={() => setPage(p)} className={`w-10 h-10 rounded-xl font-medium transition ${page === p ? 'bg-luxury-green text-white' : 'bg-white shadow-card hover:bg-gray-50 text-gray-600'}`}>{p}</button>
                  </span>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-3 rounded-xl bg-white shadow-card hover:bg-gray-50 disabled:opacity-50 transition"><ChevronRight size={20} /></button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function RecherchePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen pt-24 flex items-center justify-center bg-luxury-sand-light">
        <div className="w-8 h-8 border-4 border-luxury-green border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <RechercheContent />
    </Suspense>
  );
}