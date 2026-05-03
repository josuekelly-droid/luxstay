// src/app/blog/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface Article {
  id: number;
  titre: string;
  description: string;
  contenu: string;
  image: string;
  date: string;
  auteur: string;
  categorie: string;
  slug: string;
}

const articles: Article[] = [
  {
    id: 1,
    titre: "Comment investir dans l'immobilier au Bénin en 2026",
    description: "Découvrez les meilleures stratégies pour investir dans l'immobilier béninois cette année.",
    contenu: "Contenu détaillé de l'article...",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600",
    date: "2026-04-15",
    auteur: "LuxStay",
    categorie: "Investissement",
    slug: "investir-immobilier-benin-2026",
  },
  {
    id: 2,
    titre: "Top 5 des quartiers les plus recherchés à Cotonou",
    description: "Fidjrossè, Haie Vive, Zongo... Découvrez les quartiers les plus prisés de la capitale économique.",
    contenu: "Contenu détaillé de l'article...",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
    date: "2026-04-10",
    auteur: "LuxStay",
    categorie: "Quartiers",
    slug: "top-quartiers-cotonou",
  },
  {
    id: 3,
    titre: "Acheter ou louer : quel choix pour le Bénin ?",
    description: "Analyse comparative entre achat et location immobilière au Bénin.",
    contenu: "Contenu détaillé de l'article...",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
    date: "2026-04-05",
    auteur: "LuxStay",
    categorie: "Conseils",
    slug: "acheter-ou-louer-benin",
  },
  {
    id: 4,
    titre: "Les documents nécessaires pour acheter une parcelle au Bénin",
    description: "Guide complet des démarches administratives pour l'achat d'une parcelle.",
    contenu: "Contenu détaillé de l'article...",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600",
    date: "2026-03-28",
    auteur: "LuxStay",
    categorie: "Guide",
    slug: "documents-achat-parcelle-benin",
  },
  {
    id: 5,
    titre: "Immobilier de luxe : les villas les plus chères du Bénin",
    description: "Tour d'horizon des propriétés d'exception disponibles sur le marché béninois.",
    contenu: "Contenu détaillé de l'article...",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",
    date: "2026-03-20",
    auteur: "LuxStay",
    categorie: "Luxe",
    slug: "villas-luxe-benin",
  },
  {
    id: 6,
    titre: "Comment estimer le prix de votre bien immobilier ?",
    description: "Méthodes et astuces pour estimer correctement la valeur de votre propriété.",
    contenu: "Contenu détaillé de l'article...",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
    date: "2026-03-15",
    auteur: "LuxStay",
    categorie: "Conseils",
    slug: "estimer-prix-bien-immobilier",
  },
];

const categories = ['Tous', 'Investissement', 'Quartiers', 'Conseils', 'Guide', 'Luxe'];

export default function BlogPage() {
  const [categorieActive, setCategorieActive] = useState('Tous');

  const articlesFiltres = useMemo(() => {
    if (categorieActive === 'Tous') return articles;
    return articles.filter(article => article.categorie === categorieActive);
  }, [categorieActive]);

  return (
    <main className="min-h-screen pt-24 pb-16 bg-luxury-sand-light">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-luxury-gold font-semibold uppercase tracking-wider text-sm">
            ✦ Blog LuxStay
          </span>
          <h1 className="font-display text-5xl font-bold text-luxury-green-dark mt-2 mb-4">
            Actualités & Conseils
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Restez informé des dernières tendances immobilières au Bénin et découvrez nos conseils d&apos;experts.
          </p>
        </div>

        {/* Catégories dynamiques */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategorieActive(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
                categorieActive === cat
                  ? 'bg-luxury-green text-white shadow-luxury'
                  : 'bg-white text-luxury-green-dark hover:bg-luxury-green/10 border border-gray-200'
              }`}
            >
              {cat}
              {cat !== 'Tous' && (
                <span className="ml-2 text-xs opacity-70">
                  ({articles.filter(a => a.categorie === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Articles filtrés */}
        {articlesFiltres.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Aucun article dans cette catégorie pour le moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articlesFiltres.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-luxury transition group"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.titre}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-luxury-gold text-luxury-green-dark text-xs font-bold px-3 py-1 rounded-full">
                      {article.categorie}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(article.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {article.auteur}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-luxury-green-dark mb-2 line-clamp-2 group-hover:text-luxury-green transition">
                    {article.titre}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {article.description}
                  </p>

                  <span className="text-luxury-green font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Lire la suite <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}