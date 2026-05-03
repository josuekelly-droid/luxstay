// src/lib/paiement/fedapay.ts
import axios from 'axios';

const FEDAPAY_API = process.env.FEDAPAY_ENVIRONMENT === 'live'
  ? 'https://api.fedapay.com/v1'
  : 'https://sandbox-api.fedapay.com/v1';

const FEDAPAY_SECRET = process.env.FEDAPAY_SECRET_KEY!;

interface FedaPayCustomer {
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
}

export async function creerTransactionFedaPay(
  montant: number,
  description: string,
  customer: FedaPayCustomer
) {
  try {
    const response = await axios.post(
      `${FEDAPAY_API}/transactions`,
      {
        amount: montant,
        description,
        currency: { iso: 'XOF' },
        customer: {
          email: customer.email,
          firstname: customer.prenom,
          lastname: customer.nom,
          phone_number: {
            number: customer.telephone,
            country: 'BJ',
          },
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/paiement/succes`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/paiement/annule`,
      },
      {
        headers: {
          Authorization: `Bearer ${FEDAPAY_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      token: response.data.token,
      url: response.data.url,
      transactionId: response.data.id,
    };
  } catch (error: any) {
    console.error('Erreur FedaPay:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Erreur FedaPay');
  }
}

export async function verifierTransactionFedaPay(transactionId: string) {
  try {
    const response = await axios.get(
      `${FEDAPAY_API}/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${FEDAPAY_SECRET}`,
        },
      }
    );

    return {
      status: response.data.status,
      montant: response.data.amount,
      reference: response.data.id,
    };
  } catch (error: any) {
    console.error('Erreur vérification FedaPay:', error.response?.data || error.message);
    throw new Error('Erreur vérification FedaPay');
  }
}