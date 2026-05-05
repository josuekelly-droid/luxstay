// src/components/home/AvisSection.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface AvisItem {
  id: string;
  nom: string;
  role: string;
  commentaire: string;
  etoiles: number;
}

// Avis par défaut (hors base)
const AVIS_DEFAUT: AvisItem[] = [
  {
    id: 'default-1',
    nom: 'Marie S.',
    role: 'Acheteuse',
    commentaire: 'Grâce à LuxStay, j\'ai trouvé l\'appartement de mes rêves à Fidjrossè en moins d\'une semaine !',
    etoiles: 5,
  },
  {
    id: 'default-2',
    nom: 'Abdoul D.',
    role: 'Annonceur',
    commentaire: 'Mes annonces sont publiées rapidement et je reçois des appels tous les jours. Très efficace !',
    etoiles: 5,
  },
  {
    id: 'default-3',
    nom: 'Christelle K.',
    role: 'Acheteuse',
    commentaire: 'La vérification des annonces me rassure. J\'ai acheté ma parcelle en toute confiance.',
    etoiles: 4,
  },
  {
    id: 'default-4',
    nom: 'François T.',
    role: 'Agent immobilier',
    commentaire: 'Le système de boost est génial. Mes annonces sont toujours en tête des résultats.',
    etoiles: 5,
  },
  {
    id: 'default-5',
    nom: 'Aïssatou B.',
    role: 'Acheteuse',
    commentaire: 'Service client réactif et professionnel. Je recommande à 100% !',
    etoiles: 5,
  },
];

export default function AvisSection() {
  const [avis, setAvis] = useState<AvisItem[]>(AVIS_DEFAUT);
  const [scrollPos, setScrollPos] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Charger les avis de la base
  useEffect(() => {
    fetchAvis();
    // Défilement auto
    const interval = setInterval(() => {
      if (!isPaused && scrollRef.current) {
        setScrollPos(prev => {
          const maxScroll = (scrollRef.current?.scrollWidth || 0) - (scrollRef.current?.clientWidth || 0);
          const newPos = prev + 1;
          return newPos > maxScroll ? 0 : newPos;
        });
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Appliquer le scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollPos;
    }
  }, [scrollPos]);

  const fetchAvis = async () => {
    try {
      const res = await fetch('/api/avis');
      const data = await res.json();
      if (res.ok && data.avis.length > 0) {
        // Mélanger avec les avis par défaut
        const tousAvis = [...AVIS_DEFAUT, ...data.avis];
        // Mélanger aléatoirement
        setAvis(tousAvis.sort(() => Math.random() - 0.5));
      }
    } catch (error) {}
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl 2xl:max-w-[1400px]">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-luxury-gold font-semibold uppercase tracking-wider text-sm">✦ Témoignages</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-luxury-green-dark mt-2">
            Ce que nos utilisateurs disent
          </h2>
        </div>

        <div className="relative">
          {/* Gradient gauche */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          {/* Gradient droite */}
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-hidden scroll-smooth"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Dupliquer pour effet infini */}
            {[...avis, ...avis].map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex-shrink-0 w-[300px] sm:w-[350px] bg-luxury-sand-light rounded-2xl p-6 border border-luxury-sand/30"
              >
                <Quote size={24} className="text-luxury-gold/30 mb-3" />
                <p className="text-gray-600 text-sm mb-4 line-clamp-4 italic">
                  &ldquo;{item.commentaire}&rdquo;
                </p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < item.etoiles ? 'text-luxury-gold fill-luxury-gold' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-luxury-green rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.nom.split(' ').map(n => n.charAt(0)).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-luxury-green-dark text-sm">{item.nom}</p>
                    <p className="text-xs text-gray-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}