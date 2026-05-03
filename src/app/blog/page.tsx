// src/app/blog/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';

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
  tempsLecture: string;
}

const articles: Article[] = [
  {
    id: 1,
    titre: "Comment investir dans l'immobilier au Bénin en 2026",
    description: "Découvrez les meilleures stratégies pour investir dans l'immobilier béninois cette année.",
    contenu: `## Pourquoi investir au Bénin ?

Le marché immobilier béninois connaît une croissance remarquable en 2026. Voici les principales raisons d'investir :

### 1. Une économie en pleine expansion
Le Bénin affiche une croissance économique soutenue, portée par les investissements publics et privés dans les infrastructures.

### 2. Des prix encore accessibles
Comparé aux autres capitales de la sous-région, Cotonou offre des prix immobiliers encore abordables avec un fort potentiel de plus-value.

### 3. Une demande locative forte
La pression démographique et l'exode rural créent une demande constante de logements, particulièrement à Cotonou et Abomey-Calavi.

## Les meilleurs quartiers pour investir

- **Fidjrossè** : Quartier prisé, proche de la plage, idéal pour les villas
- **Haie Vive** : Centre des affaires, forte demande locative
- **Zongo** : Quartier en pleine transformation, prix attractifs

## Conseils pratiques

1. Vérifiez toujours le titre foncier avant d'acheter
2. Faites appel à un notaire pour sécuriser la transaction
3. Privilégiez les zones en développement pour maximiser la plus-value`,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    date: "2026-04-15",
    auteur: "LuxStay",
    categorie: "Investissement",
    slug: "investir-immobilier-benin-2026",
    tempsLecture: "5 min",
  },
  {
    id: 2,
    titre: "Top 5 des quartiers les plus recherchés à Cotonou",
    description: "Fidjrossè, Haie Vive, Zongo... Découvrez les quartiers les plus prisés de la capitale économique.",
    contenu: `## Les quartiers incontournables de Cotonou

### 1. Fidjrossè
Le quartier le plus prisé de Cotonou, connu pour sa proximité avec la plage et ses villas modernes.

### 2. Haie Vive
Le centre des affaires et des ambassades, idéal pour les expatriés et professionnels.

### 3. Zongo
Un quartier populaire en pleine mutation avec de nombreux projets immobiliers.

### 4. Les Cocotiers
Quartier dynamique proche des universités, parfait pour les étudiants et jeunes actifs.

### 5. Saint-Jean
Quartier résidentiel calme et familial, avec de belles maisons et jardins.`,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    date: "2026-04-10",
    auteur: "LuxStay",
    categorie: "Quartiers",
    slug: "top-quartiers-cotonou",
    tempsLecture: "4 min",
  },
  {
    id: 3,
    titre: "Acheter ou louer : quel choix pour le Bénin ?",
    description: "Analyse comparative entre achat et location immobilière au Bénin.",
    contenu: `## Acheter vs Louer au Bénin

### Les avantages de l'achat
- Constitution d'un patrimoine durable
- Plus-value à long terme
- Liberté d'aménagement totale
- Pas de loyer à payer

### Les avantages de la location
- Flexibilité géographique
- Pas de frais d'entretien majeurs
- Mobilité professionnelle facilitée
- Pas d'engagement long terme

### Notre recommandation
Si vous avez un projet à long terme et les moyens, l'achat est plus avantageux. Pour les courts séjours ou les budgets limités, privilégiez la location.`,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    date: "2026-04-05",
    auteur: "LuxStay",
    categorie: "Conseils",
    slug: "acheter-ou-louer-benin",
    tempsLecture: "3 min",
  },
  {
    id: 4,
    titre: "Les documents nécessaires pour acheter une parcelle au Bénin",
    description: "Guide complet des démarches administratives pour l'achat d'une parcelle.",
    contenu: `## Documents indispensables pour l'achat d'une parcelle

### 1. Le titre foncier
C'est le document le plus important. Il prouve la propriété du vendeur.

### 2. Le certificat de non-lotissement
Vérifiez que la parcelle n'est pas située dans une zone lotie par l'État.

### 3. Le plan de situation
Un document technique qui localise précisément la parcelle.

### 4. L'attestation de non-redevance
Prouve que toutes les taxes foncières ont été payées.

### 5. L'acte de vente notarié
Document final qui officialise la transaction.`,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    date: "2026-03-28",
    auteur: "LuxStay",
    categorie: "Guide",
    slug: "documents-achat-parcelle-benin",
    tempsLecture: "6 min",
  },
  {
    id: 5,
    titre: "Immobilier de luxe : les villas les plus chères du Bénin",
    description: "Tour d'horizon des propriétés d'exception disponibles sur le marché béninois.",
    contenu: `## Le marché du luxe au Bénin

Le segment de l'immobilier de luxe se développe rapidement au Bénin, notamment à :

- **Fidjrossè** : Villas avec piscine et vue mer
- **Akpakpa** : Résidences modernes avec finitions haut de gamme
- **Porto-Novo** : Propriétés historiques rénovées

Les prix peuvent atteindre plusieurs centaines de millions de FCFA pour les biens d'exception.`,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    date: "2026-03-20",
    auteur: "LuxStay",
    categorie: "Luxe",
    slug: "villas-luxe-benin",
    tempsLecture: "4 min",
  },
  {
    id: 6,
    titre: "Comment estimer le prix de votre bien immobilier ?",
    description: "Méthodes et astuces pour estimer correctement la valeur de votre propriété.",
    contenu: `## Méthodes d'estimation

### 1. La comparaison
Comparez avec les biens similaires vendus récemment dans le quartier.

### 2. Le coût de construction
Calculez le coût de reconstruction à neuf, moins la vétusté.

### 3. La valeur locative
Estimez le loyer annuel et multipliez par un coefficient (généralement 8 à 12).

### 4. Faites appel à un professionnel
Un agent immobilier ou un notaire pourra vous donner une estimation précise.`,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    date: "2026-03-15",
    auteur: "LuxStay",
    categorie: "Conseils",
    slug: "estimer-prix-bien-immobilier",
    tempsLecture: "3 min",
  },
];

const categories = ['Tous', 'Investissement', 'Quartiers', 'Conseils', 'Guide', 'Luxe'];

export default function BlogPage() {
  const [categorieActive, setCategorieActive] = useState('Tous');
  const [recherche, setRecherche] = useState('');

  const articlesFiltres = useMemo(() => {
    let filtres = articles;

    if (categorieActive !== 'Tous') {
      filtres = filtres.filter(a => a.categorie === categorieActive);
    }

    if (recherche.trim()) {
      const search = recherche.toLowerCase();
      filtres = filtres.filter(a =>
        a.titre.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search) ||
        a.categorie.toLowerCase().includes(search)
      );
    }

    return filtres;
  }, [categorieActive, recherche]);

  return (
    <main className="min-h-screen pt-28 pb-16 bg-luxury-sand-light">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-luxury-gold font-semibold uppercase tracking-wider text-sm">
            ✦ Blog LuxStay
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-luxury-green-dark mt-2 mb-4">
            Actualités & Conseils
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Restez informé des dernières tendances immobilières au Bénin et découvrez nos conseils d&apos;experts.
          </p>
        </div>

        {/* Recherche + Catégories */}
        <div className="max-w-3xl mx-auto mb-10 space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="input-luxury pl-12 py-3 text-sm"
            />
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategorieActive(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  categorieActive === cat
                    ? 'bg-luxury-green text-white shadow-luxury'
                    : 'bg-white text-luxury-green-dark hover:bg-luxury-green/10 border border-gray-200'
                }`}
              >
                {cat}
                {cat !== 'Tous' && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({articles.filter(a => a.categorie === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Articles */}
        {articlesFiltres.length === 0 ? (
          <div className="text-center py-16">
            <Search size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun article trouvé.</p>
            <button
              onClick={() => { setCategorieActive('Tous'); setRecherche(''); }}
              className="text-luxury-green font-semibold mt-2 hover:underline"
            >
              Réinitialiser les filtres
            </button>
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
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-white/90 text-luxury-green-dark text-xs px-2 py-1 rounded-full">
                      {article.tempsLecture}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {new Date(article.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={13} />
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
                    Lire la suite <ArrowRight size={15} />
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