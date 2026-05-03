// src/app/blog/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Share2, Clock, Tag } from 'lucide-react';

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

// Base de données d'articles (même que la page blog)
const articles: Article[] = [
  {
    id: 1,
    titre: "Comment investir dans l'immobilier au Bénin en 2026",
    description: "Découvrez les meilleures stratégies pour investir dans l'immobilier béninois cette année.",
    contenu: `## Pourquoi investir au Bénin ?

Le marché immobilier béninois connaît une croissance remarquable en 2026. Voici les principales raisons d'investir :

### 1. Une économie en pleine expansion
Le Bénin affiche une croissance économique soutenue, portée par les investissements publics et privés.

### 2. Des prix encore accessibles
Comparé aux autres capitales de la sous-région, Cotonou offre des prix immobiliers encore abordables.

### 3. Une demande locative forte
La pression démographique et l'exode rural créent une demande constante de logements.

## Les meilleurs quartiers pour investir

- **Fidjrossè** : Quartier prisé, proche de la plage
- **Haie Vive** : Centre des affaires, forte demande
- **Zongo** : Quartier en pleine transformation

## Conseils pratiques

1. Vérifiez toujours le titre foncier
2. Faites appel à un notaire
3. Privilégiez les zones en développement`,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200",
    date: "2026-04-15",
    auteur: "LuxStay",
    categorie: "Investissement",
    slug: "investir-immobilier-benin-2026",
  },
  {
    id: 2,
    titre: "Top 5 des quartiers les plus recherchés à Cotonou",
    description: "Fidjrossè, Haie Vive, Zongo... Découvrez les quartiers les plus prisés.",
    contenu: `## Les quartiers incontournables de Cotonou

### 1. Fidjrossè
Le quartier le plus prisé de Cotonou, connu pour sa proximité avec la plage.

### 2. Haie Vive
Le centre des affaires et des ambassades.

### 3. Zongo
Un quartier populaire en pleine mutation.

### 4. Les Cocotiers
Idéal pour les étudiants et jeunes actifs.

### 5. Saint-Jean
Quartier résidentiel calme et familial.`,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
    date: "2026-04-10",
    auteur: "LuxStay",
    categorie: "Quartiers",
    slug: "top-quartiers-cotonou",
  },
  {
    id: 3,
    titre: "Acheter ou louer : quel choix pour le Bénin ?",
    description: "Analyse comparative entre achat et location immobilière au Bénin.",
    contenu: `## Acheter vs Louer au Bénin

### Les avantages de l'achat
- Constitution d'un patrimoine
- Plus-value à long terme
- Liberté d'aménagement

### Les avantages de la location
- Flexibilité géographique
- Pas de frais d'entretien
- Mobilité professionnelle

### Notre recommandation
Si vous avez un projet à long terme, l'achat est plus avantageux. Pour les courts séjours, privilégiez la location.`,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
    date: "2026-04-05",
    auteur: "LuxStay",
    categorie: "Conseils",
    slug: "acheter-ou-louer-benin",
  },
];

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [articlesSimilaires, setArticlesSimilaires] = useState<Article[]>([]);

  useEffect(() => {
    if (slug) {
      const found = articles.find(a => a.slug === slug);
      setArticle(found || null);

      if (found) {
        const similaires = articles
          .filter(a => a.categorie === found.categorie && a.id !== found.id)
          .slice(0, 3);
        setArticlesSimilaires(similaires);
      }
    }
  }, [slug]);

  if (!article) {
    return (
      <main className="min-h-screen pt-24 pb-16 bg-luxury-sand-light">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-luxury-green-dark mb-4">Article introuvable</h1>
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={20} /> Retour au blog
          </Link>
        </div>
      </main>
    );
  }

  // Convertir le markdown simple en HTML basique
  const contenuHtml = article.contenu
    .replace(/^## (.*$)/gim, '<h2 class="font-display text-2xl font-bold text-luxury-green-dark mt-8 mb-4">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="font-display text-xl font-bold text-luxury-green-dark mt-6 mb-3">$1</h3>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 text-gray-600">$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 mb-1 text-gray-600">$1. $2</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-luxury-green-dark">$1</strong>')
    .replace(/\n\n/g, '</p><p class="text-gray-600 leading-relaxed mb-4">')
    .replace(/^(.+)$/gim, '<p class="text-gray-600 leading-relaxed mb-4">$1</p>');

  return (
    <main className="min-h-screen pt-24 pb-16 bg-luxury-sand-light">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/blog" className="text-sm text-gray-500 hover:text-luxury-green flex items-center gap-1">
            <ArrowLeft size={16} /> Retour au blog
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Article principal */}
          <article className="lg:col-span-2">
            {/* Image */}
            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-8">
              <Image
                src={article.image}
                alt={article.titre}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4">
                <span className="bg-luxury-gold text-luxury-green-dark text-xs font-bold px-3 py-1 rounded-full">
                  {article.categorie}
                </span>
              </div>
            </div>

            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {new Date(article.date).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <User size={16} />
                {article.auteur}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} />
                5 min de lecture
              </span>
              <span className="flex items-center gap-1">
                <Tag size={16} />
                {article.categorie}
              </span>
              <button className="flex items-center gap-1 text-gray-400 hover:text-luxury-green transition ml-auto">
                <Share2 size={16} /> Partager
              </button>
            </div>

            {/* Titre */}
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-luxury-green-dark mb-6">
              {article.titre}
            </h1>

            {/* Contenu */}
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: contenuHtml }}
            />
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Articles similaires */}
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h3 className="font-display text-lg font-bold text-luxury-green-dark mb-4">
                Articles similaires
              </h3>

              {articlesSimilaires.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun article similaire.</p>
              ) : (
                <div className="space-y-4">
                  {articlesSimilaires.map((similaire) => (
                    <Link
                      key={similaire.id}
                      href={`/blog/${similaire.slug}`}
                      className="flex items-start gap-3 group"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={similaire.image}
                          alt={similaire.titre}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-luxury-green-dark line-clamp-2 group-hover:text-luxury-green transition">
                          {similaire.titre}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(similaire.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href="/blog"
                className="block text-center mt-6 text-luxury-green font-semibold text-sm hover:underline"
              >
                Voir tous les articles →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}