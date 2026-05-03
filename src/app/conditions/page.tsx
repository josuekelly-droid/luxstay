// src/app/conditions/page.tsx
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function CGUPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-luxury-sand-light">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-luxury-green mb-8 transition">
          <ArrowLeft size={16} /> Retour à l&apos;accueil
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-luxury-green/10 rounded-xl flex items-center justify-center">
            <FileText size={24} className="text-luxury-green" />
          </div>
          <h1 className="font-display text-4xl font-bold text-luxury-green-dark">Conditions générales d&apos;utilisation</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8 space-y-6 text-gray-600">
          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">1. Acceptation des conditions</h2>
            <p>L&apos;utilisation de la plateforme LuxStay implique l&apos;acceptation pleine et entière des présentes conditions générales d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser le site.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">2. Services proposés</h2>
            <p>LuxStay est une plateforme de mise en relation entre propriétaires/agents immobiliers et acheteurs/locataires au Bénin. Nous proposons :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Publication d&apos;annonces immobilières</li>
              <li>Recherche de biens avec filtres</li>
              <li>Mise en relation avec les annonceurs</li>
              <li>Services optionnels de visibilité</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">3. Inscription et compte</h2>
            <p>Pour publier une annonce, vous devez créer un compte. Vous êtes responsable de la confidentialité de vos identifiants. Toute activité effectuée depuis votre compte est sous votre responsabilité.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">4. Règles de publication</h2>
            <p>Les annonces publiées doivent :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Être exactes et correspondre à des biens réels</li>
              <li>Ne pas contenir d&apos;informations trompeuses</li>
              <li>Respecter les lois béninoises en vigueur</li>
              <li>Ne pas porter atteinte aux droits des tiers</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">5. Abonnements et paiements</h2>
            <p>LuxStay propose des plans gratuits et payants. Les paiements sont traités de manière sécurisée via nos partenaires (FedaPay, PayPal). Les abonnements sont valables pour la durée choisie et se renouvellent automatiquement sauf résiliation.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">6. Résiliation</h2>
            <p>Vous pouvez supprimer votre compte à tout moment depuis votre profil. LuxStay se réserve le droit de suspendre ou supprimer un compte en cas de non-respect des présentes conditions.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">7. Droit applicable</h2>
            <p>Les présentes conditions sont régies par le droit béninois. Tout litige relatif à leur interprétation ou exécution sera soumis aux tribunaux compétents de Cotonou.</p>
          </section>
        </div>
      </div>
    </main>
  );
}