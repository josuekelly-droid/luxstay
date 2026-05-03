// src/app/blog/[slug]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Clock, Tag, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

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
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200",
    date: "2026-04-15",
    auteur: "LuxStay",
    categorie: "Investissement",
    slug: "investir-immobilier-benin-2026",
    tempsLecture: "5 min",
  },
  {
    id: 2,
    titre: "Top 5 des quartiers les plus recherchés à Cotonou",
    description: "Fidjrossè, Haie Vive, Zongo... Découvrez les quartiers les plus prisés.",
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
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
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
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
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
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200",
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
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
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
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
    date: "2026-03-15",
    auteur: "LuxStay",
    categorie: "Conseils",
    slug: "estimer-prix-bien-immobilier",
    tempsLecture: "3 min",
  },
];

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const article = articles.find(a => a.slug === slug);
  const articlesSimilaires = article
    ? articles.filter(a => a.categorie === article.categorie && a.id !== article.id).slice(0, 3)
    : [];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.titre,
          text: article?.description,
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié !');
    }
  };

  if (!article) {
    return (
      <main className="min-h-screen pt-28 pb-16 bg-luxury-sand-light">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-luxury-green-dark mb-4">Article introuvable</h1>
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={20} /> Retour au blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-16 bg-luxury-sand-light">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-luxury-green mb-8 transition">
          <ArrowLeft size={16} /> Retour au blog
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Article */}
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
              <span className="flex items-center gap-1"><Calendar size={15} />{new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="flex items-center gap-1"><User size={15} />{article.auteur}</span>
              <span className="flex items-center gap-1"><Clock size={15} />{article.tempsLecture}</span>
              <span className="flex items-center gap-1"><Tag size={15} />{article.categorie}</span>
              <button onClick={handleShare} className="flex items-center gap-1 text-gray-400 hover:text-luxury-green ml-auto">
                <Share2 size={15} /> Partager
              </button>
            </div>

            {/* Titre */}
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-luxury-green-dark mb-8">
              {article.titre}
            </h1>

            {/* Contenu */}
            <div className="prose prose-lg max-w-none">
              {article.contenu.split('\n\n').map((paragraphe, i) => {
                if (paragraphe.startsWith('## ')) {
                  return <h2 key={i} className="font-display text-2xl font-bold text-luxury-green-dark mt-8 mb-4">{paragraphe.replace('## ', '')}</h2>;
                }
                if (paragraphe.startsWith('### ')) {
                  return <h3 key={i} className="font-display text-xl font-bold text-luxury-green-dark mt-6 mb-3">{paragraphe.replace('### ', '')}</h3>;
                }
                if (paragraphe.startsWith('- ')) {
                  return (
                    <ul key={i} className="list-disc pl-5 space-y-1 mb-4">
                      {paragraphe.split('\n').filter(l => l.startsWith('- ')).map((li, j) => (
                        <li key={j} className="text-gray-600">{li.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                }
                if (paragraphe.startsWith('1. ') || paragraphe.startsWith('2. ') || paragraphe.startsWith('3. ') || paragraphe.startsWith('4. ') || paragraphe.startsWith('5. ')) {
                  return (
                    <ol key={i} className="list-decimal pl-5 space-y-1 mb-4">
                      {paragraphe.split('\n').filter(l => /^\d\./.test(l)).map((li, j) => (
                        <li key={j} className="text-gray-600">{li.replace(/^\d\.\s*/, '')}</li>
                      ))}
                    </ol>
                  );
                }
                return <p key={i} className="text-gray-600 leading-relaxed mb-4">{paragraphe}</p>;
              })}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-28">
              <h3 className="font-display text-lg font-bold text-luxury-green-dark mb-4">Articles similaires</h3>
              {articlesSimilaires.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun article similaire.</p>
              ) : (
                <div className="space-y-4">
                  {articlesSimilaires.map((sim) => (
                    <Link key={sim.id} href={`/blog/${sim.slug}`} className="flex items-start gap-3 group">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image src={sim.image} alt={sim.titre} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-luxury-green-dark line-clamp-2 group-hover:text-luxury-green transition">{sim.titre}</h4>
                        <p className="text-xs text-gray-400 mt-1">{new Date(sim.date).toLocaleDateString('fr-FR')} • {sim.tempsLecture}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link href="/blog" className="block text-center mt-6 text-luxury-green font-semibold text-sm hover:underline">
                Voir tous les articles →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}