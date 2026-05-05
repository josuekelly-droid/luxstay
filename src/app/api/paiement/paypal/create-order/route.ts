// src/app/api/paiement/paypal/create-order/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { creerCommandePayPal } from '@/lib/paiement/paypal';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { montantUSD, plan, duree, montant } = await request.json();

    if (!montantUSD || !plan || !duree) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    // Créer la commande PayPal
    const resultat = await creerCommandePayPal(montantUSD, `LuxStay ${plan} - ${duree}`);

    // Créer le paiement EN_ATTENTE dans la base
    const paiement = await prisma.paiement.create({
      data: {
        userId: session.user.id,
        modePaiement: 'PAYPAL',
        montant: montant || 0,
        devise: 'FCFA',
        reference: resultat.orderId,
        statut: 'EN_ATTENTE',
        metaData: { plan, duree, type: 'abonnement' },
      },
    });

    return NextResponse.json({
      orderId: resultat.orderId,
      paiementId: paiement.id,
    });
  } catch (error: any) {
    console.error('Erreur create-order PayPal:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur création commande' },
      { status: 500 }
    );
  }
}