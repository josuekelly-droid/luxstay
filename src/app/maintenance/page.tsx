// src/app/maintenance/page.tsx
import Link from 'next/link';
import { Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-luxury-sand-light px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-luxury-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Wrench size={40} className="text-luxury-gold" />
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-luxury-gold">LUX</span>
            <span className="text-luxury-green">STAY</span>
          </h1>
        </div>

        <h2 className="font-display text-2xl font-bold text-luxury-green-dark mb-4">
          Site en maintenance
        </h2>
        <p className="text-gray-500 mb-2">
          Nous effectuons actuellement des améliorations pour vous offrir une meilleure expérience.
        </p>
        <p className="text-gray-400 text-sm">
          Veuillez revenir dans quelques instants.
        </p>
      </div>
    </main>
  );
}