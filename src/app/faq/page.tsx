// src/app/faq/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Comment publier une annonce ?",
    reponse: "Créez un compte gratuitement, connectez-vous à votre dashboard, puis cliquez sur « Publier une annonce ». Remplissez les informations du bien, ajoutez des photos et soumettez l'annonce pour validation."
  },
  {
    question: "Combien coûte la publication d'une annonce ?",
    reponse: "Le plan gratuit permet de publier 5 annonces par mois. Pour plus d'annonces, vous pouvez souscrire à nos plans payants : Standard (15 annonces), Premium (50 annonces) ou Business (illimité)."
  },
  {
    question: "Comment sont vérifiées les annonces ?",
    reponse: "Chaque annonce est examinée par notre équipe avant publication. Nous vérifions la cohérence des informations et luttons contre les annonces frauduleuses."
  },
  {
    question: "Quels modes de paiement sont acceptés ?",
    reponse: "Nous acceptons les paiements par Mobile Money (MTN, Moov), PayPal pour les cartes bancaires internationales, et Binance Pay pour les cryptomonnaies."
  },
  {
    question: "Puis-je modifier mon annonce après publication ?",
    reponse: "Oui, vous pouvez modifier votre annonce à tout moment depuis votre dashboard. Les modifications sont soumises à validation si l'annonce était déjà publiée."
  },
  {
    question: "Comment contacter un annonceur ?",
    reponse: "Sur la page détail d'un bien, vous pouvez appeler directement l'annonceur ou lui envoyer un message privé via la plateforme."
  },
  {
    question: "Comment signaler une annonce suspecte ?",
    reponse: "Sur chaque page de bien, vous trouverez un bouton « Signaler cette annonce ». Notre équipe examinera votre signalement dans les plus brefs délais."
  },
  {
    question: "Mes données sont-elles protégées ?",
    reponse: "Oui, conformément à la loi béninoise sur la protection des données. Consultez notre politique de confidentialité pour plus de détails."
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen pt-24 pb-16 bg-luxury-sand-light">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-luxury-green mb-8 transition">
          <ArrowLeft size={16} /> Retour à l&apos;accueil
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-luxury-gold/10 rounded-xl flex items-center justify-center">
            <HelpCircle size={24} className="text-luxury-gold" />
          </div>
          <h1 className="font-display text-4xl font-bold text-luxury-green-dark">Foire aux questions</h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left transition"
              >
                <h3 className="font-display text-lg font-bold text-luxury-green-dark pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  size={20}
                  className={`text-luxury-green flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-6 text-gray-600">{faq.reponse}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}