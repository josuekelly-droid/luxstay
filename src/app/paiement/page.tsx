// src/app/paiement/page.tsx
'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { CreditCard, Wallet, Bitcoin, Loader2, ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import PayPalButton from '@/components/paiement/PayPalButton';

type Plan = 'STANDARD' | 'PREMIUM' | 'BUSINESS';
type Duree = 'MENSUEL' | 'TROIS_MOIS' | 'ANNUEL';

const plans: Record<Plan, { nom: string; tarifs: Record<Duree, number> }> = {
  STANDARD: { nom: 'Standard', tarifs: { MENSUEL: 15000, TROIS_MOIS: 38250, ANNUEL: 126000 } },
  PREMIUM: { nom: 'Premium', tarifs: { MENSUEL: 35000, TROIS_MOIS: 89250, ANNUEL: 294000 } },
  BUSINESS: { nom: 'Business', tarifs: { MENSUEL: 70000, TROIS_MOIS: 178500, ANNUEL: 588000 } },
};

function PaiementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const planParam = (searchParams.get('plan') || 'PREMIUM') as Plan;
  const [duree, setDuree] = useState<Duree>('MENSUEL');
  const [modePaiement, setModePaiement] = useState('FEDAPAY');
  const [isLoading, setIsLoading] = useState(false);

  if (!session) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center bg-luxury-sand-light">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Connectez-vous pour continuer</p>
          <Link href="/connexion" className="btn-primary">Se connecter</Link>
        </div>
      </main>
    );
  }

  const plan = plans[planParam];
  const montant = plan.tarifs[duree];
  const formatPrix = (p: number) => new Intl.NumberFormat('fr-FR').format(p);

  const handlePayer = async () => {
    if (modePaiement === 'PAYPAL') return; // Géré par le bouton PayPal direct

    setIsLoading(true);

    try {
      const response = await fetch('/api/paiement/creer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planParam, duree, modePaiement }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.url || data.approveUrl || data.checkoutUrl) {
          window.location.href = data.url || data.approveUrl || data.checkoutUrl;
        } else {
          toast.success('Paiement initié !');
          router.push('/dashboard/abonnement');
        }
      } else {
        toast.error(data.error || 'Erreur lors du paiement');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-luxury-sand-light">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/tarifs" className="text-sm text-gray-500 hover:text-luxury-green flex items-center gap-1 mb-8">
          <ArrowLeft size={16} /> Retour aux tarifs
        </Link>

        <h1 className="font-display text-3xl font-bold text-luxury-green-dark mb-8 text-center">
          Finaliser le paiement
        </h1>

        <div className="bg-white rounded-2xl shadow-luxury p-8 space-y-8">
          {/* Résumé */}
          <div className="bg-luxury-sand-light rounded-xl p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Plan choisi</span>
              <span className="font-bold text-luxury-green-dark">{plan.nom}</span>
            </div>

            <div className="flex gap-2 mb-4">
              {(['MENSUEL', 'TROIS_MOIS', 'ANNUEL'] as Duree[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuree(d)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                    duree === d
                      ? 'bg-luxury-green text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-luxury-green'
                  }`}
                >
                  {d === 'MENSUEL' ? '1 mois' : d === 'TROIS_MOIS' ? '3 mois (-15%)' : '1 an (-30%)'}
                </button>
              ))}
            </div>

            <div className="flex justify-between text-2xl font-bold pt-3 border-t border-gray-200">
              <span className="text-luxury-green-dark">Total</span>
              <span className="text-luxury-green">{formatPrix(montant)} FCFA</span>
            </div>
          </div>

          {/* Mode de paiement */}
          <div>
            <h3 className="font-semibold text-luxury-green-dark mb-4">Mode de paiement</h3>
            <div className="grid gap-3">
              {[
                {
                  id: 'FEDAPAY',
                  label: 'Mobile Money',
                  description: 'MTN Mobile Money, Moov Money',
                  icon: <Wallet size={24} />,
                  couleur: 'border-luxury-gold',
                  bg: 'bg-luxury-gold/5',
                },
                {
                  id: 'PAYPAL',
                  label: 'PayPal / Carte bancaire',
                  description: 'Paiement direct par carte ou PayPal',
                  icon: <CreditCard size={24} />,
                  couleur: 'border-blue-600',
                  bg: 'bg-blue-50',
                },
                {
                  id: 'BINANCE',
                  label: 'Crypto (Binance Pay)',
                  description: 'Bitcoin, USDT, Ethereum',
                  icon: <Bitcoin size={24} />,
                  couleur: 'border-yellow-500',
                  bg: 'bg-yellow-50',
                },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setModePaiement(mode.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition ${
                    modePaiement === mode.id
                      ? `${mode.couleur} ${mode.bg}`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    modePaiement === mode.id ? mode.bg : 'bg-gray-100'
                  }`}>
                    {mode.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-luxury-green-dark">{mode.label}</p>
                    <p className="text-sm text-gray-500">{mode.description}</p>
                  </div>
                  {modePaiement === mode.id && (
                    <Check size={20} className="ml-auto text-luxury-green" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* PayPal Direct */}
          {modePaiement === 'PAYPAL' && (
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-3 text-center">
                Vous allez payer {formatPrix(montant)} FCFA (~{(montant / 600).toFixed(2)} USD)
              </p>
              <PayPalButton
                montant={montant}
                plan={planParam}
                duree={duree}
                onSuccess={() => {
                  toast.success('Abonnement activé !');
                  router.push('/dashboard/abonnement');
                }}
              />
            </div>
          )}

          {/* Bouton Payer pour FedaPay/Binance */}
          {modePaiement !== 'PAYPAL' && (
            <button
              onClick={handlePayer}
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <CreditCard size={24} />
              )}
              {isLoading ? 'Redirection...' : `Payer ${formatPrix(montant)} FCFA`}
            </button>
          )}

          <p className="text-xs text-gray-400 text-center">
            Paiement sécurisé. Vos données sont chiffrées et protégées.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function PaiementPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen pt-24 flex items-center justify-center bg-luxury-sand-light">
        <div className="w-8 h-8 border-4 border-luxury-green border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <PaiementContent />
    </Suspense>
  );
}