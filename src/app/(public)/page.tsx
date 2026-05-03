// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, MapPin, Building2, Home, TreePine, 
  Shield, Zap, HeadphonesIcon, ArrowRight,
  Star, ChevronRight, Bed, Maximize, Eye, Loader2
} from 'lucide-react';
import Button from '@/components/ui/Button';

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
  vues: number;
  prioritaire: boolean;
  images: { url: string }[];
}

export default function HomePage() {
  const [biensVedette, setBiensVedette] = useState<Annonce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recherche, setRecherche] = useState({
    type: '',
    transaction: '',
    ville: '',
    prixMax: '',
  });

  useEffect(() => {
    fetchBiensVedette();
  }, []);

  const fetchBiensVedette = async () => {
    try {
      const response = await fetch('/api/biens?limit=6&tri=recent');
      const data = await response.json();
      if (response.ok) {
        setBiensVedette(data.annonces);
      }
    } catch (error) {
      console.error('Erreur chargement biens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrix = (prix: number) => new Intl.NumberFormat('fr-FR').format(Math.round(prix));

  const rechercheUrl = `/recherche?type=${recherche.type}&transaction=${recherche.transaction}&ville=${recherche.ville}&prixMax=${recherche.prixMax}`;

  return (
    <main>
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-luxury-green-dark via-luxury-green to-luxury-green-light">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <div>
              <div className="inline-flex items-center gap-2 bg-luxury-gold/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Star size={16} className="text-luxury-gold fill-luxury-gold" />
                <span className="text-luxury-gold-light text-sm">La référence immobilière au Bénin</span>
              </div>
              
              <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6">
                Trouvez votre
                <span className="block text-luxury-gold">chez-vous idéal</span>
              </h1>
              
              <p className="text-lg text-gray-300 mb-8 max-w-lg">
                Des milliers de biens vérifiés à Cotonou, Porto-Novo, Parakou et partout au Bénin.
                Achetez, louez ou investissez en toute confiance.
              </p>
              
              {/* Stats */}
              <div className="flex gap-8 mb-8">
                <div>
                  <span className="text-3xl font-bold text-luxury-gold">5 200+</span>
                  <p className="text-sm text-gray-400">Biens disponibles</p>
                </div>
                <div>
                  <span className="text-3xl font-bold text-luxury-gold">1 800+</span>
                  <p className="text-sm text-gray-400">Clients satisfaits</p>
                </div>
                <div>
                  <span className="text-3xl font-bold text-luxury-gold">12</span>
                  <p className="text-sm text-gray-400">Villes couvertes</p>
                </div>
              </div>
              
              <Link href="/recherche">
                <Button variant="premium" size="lg">
                  Explorer les biens
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
            
            {/* Image */}
            <div className="hidden lg:block relative">
              <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-elevated">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                  alt="Villa de luxe au Bénin"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Carte flottante */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-luxury p-4 w-64 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-luxury-green/10 rounded-xl flex items-center justify-center">
                    <Home size={24} className="text-luxury-green" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-luxury-green-dark">+5 annonces/jour</p>
                    <p className="text-xs text-gray-500">Cotonou & environs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Vague décorative */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 30C480 40 600 80 720 85C840 90 960 60 1080 45C1200 30 1320 30 1380 30L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V60Z" 
                  fill="#F9F6F0"/>
          </svg>
        </div>
      </section>
      
      {/* ========== BARRE DE RECHERCHE ========== */}
      <section className="py-12 bg-luxury-sand-light">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-luxury p-6 max-w-5xl mx-auto -mt-24 relative z-20">
            <div className="grid md:grid-cols-5 gap-4">
              <select 
                className="input-luxury"
                value={recherche.type}
                onChange={(e) => setRecherche({...recherche, type: e.target.value})}
              >
                <option value="">Type de bien</option>
                <option value="APPARTEMENT">Appartement</option>
                <option value="MAISON">Maison</option>
                <option value="VILLA">Villa</option>
                <option value="PARCELLE">Parcelle</option>
                <option value="STUDIO">Studio</option>
              </select>
              
              <select 
                className="input-luxury"
                value={recherche.transaction}
                onChange={(e) => setRecherche({...recherche, transaction: e.target.value})}
              >
                <option value="">Transaction</option>
                <option value="VENTE">Vente</option>
                <option value="LOCATION">Location</option>
              </select>
              
              <select 
                className="input-luxury"
                value={recherche.ville}
                onChange={(e) => setRecherche({...recherche, ville: e.target.value})}
              >
                <option value="">Ville</option>
                <option value="Cotonou">Cotonou</option>
                <option value="Abomey-Calavi">Abomey-Calavi</option>
                <option value="Porto-Novo">Porto-Novo</option>
                <option value="Parakou">Parakou</option>
              </select>
              
              <input
                type="number"
                placeholder="Budget max (FCFA)"
                className="input-luxury"
                value={recherche.prixMax}
                onChange={(e) => setRecherche({...recherche, prixMax: e.target.value})}
              />
              
              <Link href={rechercheUrl}>
                <Button variant="primary" className="w-full">
                  <Search size={20} />
                  Rechercher
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* ========== BIENS EN VEDETTE ========== */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-luxury-gold font-semibold uppercase tracking-wider text-sm">
              ✦ Sélection LuxStay
            </span>
            <h2 className="font-display text-4xl font-bold text-luxury-green-dark mt-2">
              Biens en vedette
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Découvrez notre sélection exclusive de biens immobiliers vérifiés
              dans les meilleurs quartiers du Bénin
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={40} className="text-luxury-green animate-spin" />
            </div>
          ) : biensVedette.length === 0 ? (
            <div className="text-center py-12">
              <Home size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun bien disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {biensVedette.map((bien) => (
                <Link
                  key={bien.id}
                  href={`/bien/${bien.id}`}
                  className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-luxury transition group"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={bien.images[0]?.url || '/placeholder-bien.jpg'}
                      alt={bien.titre}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-luxury-green text-white text-xs px-3 py-1 rounded-full">
                        {bien.transaction === 'VENTE' ? 'À vendre' : 'À louer'}
                      </span>
                    </div>
                    {bien.prioritaire && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-luxury-gold text-luxury-green-dark text-xs px-3 py-1 rounded-full font-bold">
                          Premium
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-luxury-green/90 text-white px-3 py-1 rounded-lg text-sm font-bold">
                      {formatPrix(bien.prix)} FCFA
                      {bien.transaction === 'LOCATION' && <span className="text-xs">/mois</span>}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-luxury-green-dark mb-2 line-clamp-1 group-hover:text-luxury-green transition">
                      {bien.titre}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                      <MapPin size={14} className="text-luxury-gold flex-shrink-0" />
                      <span className="truncate">{bien.quartier}, {bien.ville}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {bien.chambres && (
                        <span className="flex items-center gap-1"><Bed size={14} /> {bien.chambres}</span>
                      )}
                      {bien.surface && (
                        <span className="flex items-center gap-1"><Maximize size={14} /> {bien.surface} m²</span>
                      )}
                      <span className="flex items-center gap-1 ml-auto"><Eye size={14} /> {bien.vues}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link href="/recherche">
              <Button variant="secondary" size="lg">
                Voir tous les biens
                <ChevronRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* ========== POURQUOI LUXSTAY ========== */}
      <section className="py-20 bg-luxury-green text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold">
              Pourquoi choisir <span className="text-luxury-gold">LuxStay</span> ?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Shield size={32} />, titre: 'Biens vérifiés', description: 'Chaque annonce est vérifiée par notre équipe avant publication' },
              { icon: <Zap size={32} />, titre: 'Paiement sécurisé', description: 'Transactions 100% sécurisées avec Mobile Money, PayPal et Crypto' },
              { icon: <HeadphonesIcon size={32} />, titre: 'Support local', description: 'Une équipe basée au Bénin pour vous accompagner' },
              { icon: <Search size={32} />, titre: 'Recherche avancée', description: 'Filtres précis pour trouver exactement ce que vous cherchez' },
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition">
                <div className="w-16 h-16 bg-luxury-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-luxury-gold">
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{feature.titre}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ========== CATÉGORIES ========== */}
      <section className="py-20 bg-luxury-sand-light">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-center text-luxury-green-dark mb-12">
            Explorer par catégorie
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Building2 size={48} />, titre: 'Appartements', nombre: '2 400+', lien: '/recherche?type=APPARTEMENT', couleur: 'from-luxury-green to-luxury-green-light' },
              { icon: <Home size={48} />, titre: 'Maisons & Villas', nombre: '1 800+', lien: '/recherche?type=VILLA', couleur: 'from-luxury-gold to-luxury-gold-dark' },
              { icon: <TreePine size={48} />, titre: 'Parcelles', nombre: '1 000+', lien: '/recherche?type=PARCELLE', couleur: 'from-luxury-green-dark to-luxury-green' },
            ].map((cat, index) => (
              <Link key={index} href={cat.lien}>
                <div className={`relative rounded-2xl overflow-hidden h-64 bg-gradient-to-br ${cat.couleur} group cursor-pointer`}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                    <div className="mb-4 transform group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-2">{cat.titre}</h3>
                    <p className="text-white/80">{cat.nombre} biens</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* ========== DEVENIR ANNONCEUR ========== */}
      <section className="py-20 bg-gradient-to-r from-luxury-gold to-luxury-gold-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl font-bold text-luxury-green-dark mb-4">
            Vous êtes propriétaire ou agent immobilier ?
          </h2>
          <p className="text-luxury-green-dark/80 text-lg mb-8 max-w-2xl mx-auto">
            Publiez vos annonces sur LuxStay et touchez des milliers d&apos;acheteurs potentiels au Bénin
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/tarifs">
              <Button variant="primary" size="lg">
                Voir nos offres
              </Button>
            </Link>
            <Link href="/inscription">
              <Button variant="secondary" size="lg" className="border-luxury-green-dark text-luxury-green-dark hover:bg-luxury-green-dark hover:text-white">
                Créer un compte gratuit
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}