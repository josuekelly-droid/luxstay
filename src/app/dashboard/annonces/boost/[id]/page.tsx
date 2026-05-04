// src/app/dashboard/annonces/boost/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, TrendingUp, ArrowLeft, Zap, Pin, Crown, Check, Wallet, CreditCard, Bitcoin } from 'lucide-react';
import toast from 'react-hot-toast';

const options = [
  {
    id: 'BOOST',
    nom: 'Boost',
    prix: 5000,
    duree: 7,
    description: 'Votre annonce remonte en tête des résultats',
    icon: <Zap size={28} />,
    couleur: 'border-blue-500',
    bg: 'bg-blue-50',
  },
  {
    id: 'EPINGLEE',
    nom: 'Épinglée',
    prix: 10000,
    duree: 15,
    description: 'Annonce épinglée en haut + badge "Épinglé"',
    icon: <Pin size={28} />,
    couleur: 'border-luxury-gold',
    bg: 'bg-luxury-gold/5',
  },
  {
    id: 'PRIORITAIRE',
    nom: 'Prioritaire',
    prix: 20000,
    duree: 30,
    description: 'Page d\'accueil + badge "Premium"',
    icon: <Crown size={28} />,
    couleur: 'border-purple-500',
    bg: 'bg-purple-50',
  },
];

const modesPaiement = [
  { id: 'FEDAPAY', label: 'Mobile Money', icon: <Wallet size={20} />, couleur: 'border-luxury-gold' },
  { id: 'PAYPAL', label: 'PayPal', icon: <CreditCard size={20} />, couleur: 'border-blue-600' },
  { id: 'BINANCE', label: 'Crypto', icon: <Bitcoin size={20} />, couleur: 'border-yellow-500' },
];

export default function BoostAnnoncePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [selected, setSelected] = useState('');
  const [modePaiement, setModePaiement] = useState('FEDAPAY');
  const [isLoading, setIsLoading] = useState(false);
  const [annonce, setAnnonce] = useState<any>(null);

  useEffect(() => {
    if (id) fetchAnnonce();
  }, [id]);

  const fetchAnnonce = async () => {
    try {
      const res = await fetch(`/api/annonces/${id}`);
      const data = await res.json();
      if (res.ok) setAnnonce(data.annonce);
    } catch (error) {}
  };

  const handlePayer = async () => {
    if (!selected) {
      toast.error('Choisissez un type de boost');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/paiement/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ annonceId: id, type: selected, modePaiement }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Erreur lors de la création du paiement');
        return;
      }

      if (data.url) {
        // ✅ Rediriger vers la page de paiement sécurisée
        window.location.href = data.url;
      } else {
        toast.error('Paiement indisponible pour le moment.');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const boostChoisi = options.find(o => o.id === selected);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard/annonces" className="flex items-center gap-2 text-sm text-gray-500 hover:text-luxury-green">
        <ArrowLeft size={16} /> Retour
      </Link>

      <div>
        <h2 className="text-2xl font-bold text-luxury-green-dark">Booster votre annonce</h2>
        {annonce && <p className="text-gray-500 text-sm mt-1">{annonce.titre}</p>}
      </div>

      {/* Options de boost */}
      <div className="grid gap-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition ${
              selected === opt.id ? `${opt.couleur} ${opt.bg}` : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${selected === opt.id ? opt.bg : 'bg-gray-100'}`}>
              {opt.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-luxury-green-dark">{opt.nom}</h3>
              <p className="text-sm text-gray-500">{opt.description}</p>
              <p className="text-xs text-gray-400 mt-1">Durée : {opt.duree} jours</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-luxury-green">{opt.prix.toLocaleString('fr-FR')} FCFA</p>
              {selected === opt.id && <Check size={20} className="text-luxury-green ml-auto mt-1" />}
            </div>
          </button>
        ))}
      </div>

      {/* Mode de paiement */}
      {selected && (
        <div className="bg-white rounded-2xl shadow-card p-5 space-y-3">
          <h3 className="font-semibold text-luxury-green-dark text-sm">Mode de paiement</h3>
          <div className="flex gap-2">
            {modesPaiement.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setModePaiement(mode.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition ${
                  modePaiement === mode.id
                    ? `${mode.couleur} bg-gray-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {mode.icon}
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bouton Payer */}
      <button
        onClick={handlePayer}
        disabled={isLoading || !selected}
        className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <TrendingUp size={20} />
        )}
        {isLoading
          ? 'Redirection vers le paiement...'
          : `Payer ${boostChoisi?.prix.toLocaleString('fr-FR') || ''} FCFA${modePaiement === 'PAYPAL' ? ' (~' + (boostChoisi ? (boostChoisi.prix / 600).toFixed(2) : '0') + ' USD)' : ''}`
        }
      </button>
    </div>
  );
}