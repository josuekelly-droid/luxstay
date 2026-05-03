// src/app/confidentialite/page.tsx
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-luxury-sand-light">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-luxury-green mb-8 transition">
          <ArrowLeft size={16} /> Retour à l&apos;accueil
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-luxury-gold/10 rounded-xl flex items-center justify-center">
            <Lock size={24} className="text-luxury-gold" />
          </div>
          <h1 className="font-display text-4xl font-bold text-luxury-green-dark">Politique de confidentialité</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8 space-y-6 text-gray-600">
          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">1. Collecte des données</h2>
            <p>Lors de votre inscription sur LuxStay, nous collectons les informations suivantes : nom, prénom, adresse email, numéro de téléphone. Ces données sont nécessaires à la création et à la gestion de votre compte.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Créer et gérer votre compte</li>
              <li>Vous mettre en relation avec des acheteurs ou vendeurs</li>
              <li>Vous envoyer des notifications concernant vos annonces</li>
              <li>Améliorer nos services</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">3. Partage des données</h2>
            <p>Vos données personnelles ne sont jamais vendues à des tiers. Elles sont uniquement partagées avec les utilisateurs intéressés par vos annonces (nom, prénom, téléphone, email).</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">4. Sécurité</h2>
            <p>Nous mettons en œuvre toutes les mesures techniques nécessaires pour protéger vos données : chiffrement SSL, accès restreint aux données, authentification sécurisée.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">5. Cookies</h2>
            <p>Le site utilise des cookies pour améliorer votre expérience utilisateur (session de connexion, préférences). Vous pouvez les désactiver dans les paramètres de votre navigateur.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">6. Vos droits</h2>
            <p>Conformément à la loi béninoise, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement</li>
              <li>Droit à la portabilité</li>
            </ul>
            <p className="mt-2">Pour exercer ces droits, contactez-nous à <strong className="text-luxury-green">luxstay-bj@outlook.com</strong>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}