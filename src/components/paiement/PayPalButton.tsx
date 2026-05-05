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

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: 'USD',
    intent: 'capture',
  };

  if (montantUSD <= 0) {
    return <p className="text-red-500 text-sm">Montant invalide</p>;
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{ layout: 'vertical', shape: 'pill', label: 'pay' }}
        createOrder={async () => {
          const res = await fetch('/api/paiement/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ montantUSD, plan, duree }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
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