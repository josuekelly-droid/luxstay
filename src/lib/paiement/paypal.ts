// src/lib/paiement/paypal.ts
import axios from 'axios';

const PAYPAL_API = process.env.PAYPAL_ENVIRONMENT === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  const response = await axios({
    method: 'post',
    url: `${PAYPAL_API}/v1/oauth2/token`,
    data: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data.access_token;
}

export async function creerCommandePayPal(montantUSD: number, description: string) {
  try {
    const accessToken = await getAccessToken();

    const response = await axios({
      method: 'post',
      url: `${PAYPAL_API}/v2/checkout/orders`,
      data: {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: montantUSD.toFixed(2),
            },
            description: description.substring(0, 127),
          },
        ],
        application_context: {
          brand_name: 'LuxStay',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/paiement/succes?method=paypal`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/paiement/annule`,
        },
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const approveLink = response.data.links.find(
      (link: any) => link.rel === 'approve'
    );

    return {
      orderId: response.data.id,
      status: response.data.status,
      approveUrl: approveLink?.href,
    };
  } catch (error: any) {
    console.error('Erreur PayPal:', error.response?.data || error.message);
    throw new Error('Erreur PayPal');
  }
}

export async function capturerPaiementPayPal(orderId: string) {
  try {
    const accessToken = await getAccessToken();

    const response = await axios({
      method: 'post',
      url: `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      success: true,
      captureId: response.data.purchase_units[0].payments.captures[0].id,
      status: response.data.status,
      montant: response.data.purchase_units[0].payments.captures[0].amount.value,
    };
  } catch (error: any) {
    console.error('Erreur capture PayPal:', error.response?.data || error.message);
    throw new Error('Erreur capture PayPal');
  }
}