// src/app/mentions-legales/page.tsx
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-luxury-sand-light">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-luxury-green mb-8 transition">
          <ArrowLeft size={16} /> Retour à l&apos;accueil
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-luxury-green/10 rounded-xl flex items-center justify-center">
            <Shield size={24} className="text-luxury-green" />
          </div>
          <h1 className="font-display text-4xl font-bold text-luxury-green-dark">Mentions légales</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8 space-y-6 text-gray-600">
          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">1. Informations légales</h2>
            <p>Le site internet <strong className="text-luxury-green">LuxStay</strong> est édité par la société LuxStay SARL, au capital de 1 000 000 FCFA, immatriculée au Registre du Commerce et du Crédit Mobilier de Cotonou sous le numéro RB/COT/2026-XXXX.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Siège social : Haie Vive, Cotonou, Bénin</li>
              <li>Téléphone : +229 54 66 62 68</li>
              <li>Email : luxstay-bj@outlook.com</li>
              <li>Directeur de publication : LuxStay</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">2. Hébergement</h2>
            <p>Le site LuxStay est hébergé par :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Vercel Inc.</li>
              <li>340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
              <li>Site web : https://vercel.com</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">3. Propriété intellectuelle</h2>
            <p>L&apos;ensemble du contenu du site LuxStay (textes, images, logos, marques) est protégé par le droit d&apos;auteur et le droit des marques. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">4. Protection des données</h2>
            <p>Conformément à la loi n°2017-20 du 20 avril 2017 portant code du numérique en République du Bénin, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données personnelles. Pour l&apos;exercer, contactez-nous à <strong>luxstay-bj@outlook.com</strong>.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">5. Limitation de responsabilité</h2>
            <p>LuxStay s&apos;efforce de fournir des informations exactes et vérifiées. Cependant, nous ne pouvons garantir l&apos;exactitude des annonces publiées par les utilisateurs. LuxStay agit en tant qu&apos;intermédiaire et ne saurait être tenu responsable des transactions entre acheteurs et vendeurs.</p>
          </section>
        </div>
      </div>
    </main>
  );
}