// src/components/paiement/PayPalButton.tsx
'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';

interface PayPalButtonProps {
  montant: number;
  plan: string;
  duree: string;
  onSuccess: () => void;
}

export default function PayPalButton({ montant, plan, duree, onSuccess }: PayPalButtonProps) {
  const montantUSD = Number((montant / 600).toFixed(2));

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-600 text-sm font-medium">⚠️ Client ID PayPal manquant</p>
        <p className="text-red-500 text-xs mt-1">Ajoutez NEXT_PUBLIC_PAYPAL_CLIENT_ID dans vos variables d&apos;environnement.</p>
      </div>
    );
  }

  if (montantUSD <= 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-600 text-sm">Montant invalide</p>
      </div>
    );
  }

  const initialOptions = {
    clientId: clientId,
    currency: 'USD',
    intent: 'capture',
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{ layout: 'vertical', shape: 'pill', label: 'pay', tagline: false }}
        createOrder={async () => {
          const res = await fetch('/api/paiement/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ montantUSD, plan, duree }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Erreur création commande');
          return data.orderId;
        }}
        onApprove={async (data) => {
          const res = await fetch('/api/paiement/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderID, plan, duree, montant }),
          });
          const result = await res.json();
          if (result.success) {
            toast.success(result.message || 'Paiement réussi !');
            onSuccess();
          } else {
            toast.error(result.error || 'Erreur');
          }
        }}
        onError={() => toast.error('Erreur de paiement PayPal')}
        onCancel={() => toast.error('Paiement annulé')}
      />
    </PayPalScriptProvider>
  );
}