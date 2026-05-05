// src/app/api/paiement/paypal/create-order/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { creerCommandePayPal } from '@/lib/paiement/paypal';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { montantUSD, plan, duree } = await request.json();

    if (!montantUSD || !plan || !duree) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    const resultat = await creerCommandePayPal(montantUSD, `LuxStay ${plan} - ${duree}`);

    return NextResponse.json({ orderId: resultat.orderId });
  } catch (error: any) {
    console.error('Erreur create-order PayPal:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur création commande' },
      { status: 500 }
    );
  }
}