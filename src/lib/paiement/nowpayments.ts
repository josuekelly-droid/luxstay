// src/lib/paiement/nowpayments.ts
const NOWPAYMENTS_API = 'https://api.nowpayments.io/v1';
const API_KEY = process.env.NOWPAYMENTS_API_KEY!;

interface NowPaymentsResponse {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  pay_amount: number;
  pay_currency: string;
  price_amount: number;
  price_currency: string;
  invoice_url: string;
}

export async function creerPaiementCrypto(
  montantUSD: number,
  description: string,
  crypto: string = 'usdtbsc'
) {
  try {
    console.log('NowPayments - Création paiement:', { montantUSD, crypto, description });

    const response = await fetch(`${NOWPAYMENTS_API}/invoice`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: montantUSD,
        price_currency: 'usd',
        pay_currency: crypto,
        order_id: `LUXSTAY_${Date.now()}`,
        order_description: description.substring(0, 255),
        ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/nowpayments`,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/paiement/succes`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/paiement/annule`,
      }),
    });

    const data = await response.json();
    console.log('NowPayments - Réponse:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('Erreur NowPayments:', data);
      throw new Error(data.message || 'Erreur NowPayments');
    }

    return {
      paymentId: data.payment_id || data.id,
      invoiceUrl: data.invoice_url,
      payAddress: data.pay_address,
      payAmount: data.pay_amount,
      payCurrency: data.pay_currency,
      url: data.invoice_url, // Pour la redirection
    };
  } catch (error: any) {
    console.error('Erreur NowPayments:', error.message);
    throw new Error(error.message || 'Erreur NowPayments');
  }
}