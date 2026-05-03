// src/app/a-propos/page.tsx
import { Shield, Users, Target, Heart } from 'lucide-react';

export default function AProposPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-luxury-sand-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl font-bold text-luxury-green-dark mb-4">
            À propos de LuxStay
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            La plateforme immobilière de référence au Bénin qui connecte acheteurs, locataires et propriétaires
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-16">
          {[
            { icon: <Target size={32} />, titre: 'Notre mission', desc: 'Faciliter l\'accès au logement et à l\'investissement immobilier au Bénin' },
            { icon: <Shield size={32} />, titre: 'Confiance', desc: 'Toutes les annonces sont vérifiées par notre équipe' },
            { icon: <Users size={32} />, titre: 'Communauté', desc: 'Des milliers d\'utilisateurs nous font confiance' },
            { icon: <Heart size={32} />, titre: 'Engagement', desc: 'Un support local basé à Cotonou' },
          ].map((item, i) => (
            <div key={i} className="text-center bg-white rounded-2xl shadow-card p-6">
              <div className="w-16 h-16 bg-luxury-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-luxury-gold">
                {item.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-luxury-green-dark mb-2">{item.titre}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}