// src/app/api/webhooks/fedapay/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Vérifier si la transaction est réussie
    if (body.status === 'approved') {
      const transactionId = body.id;

      // Trouver le paiement
      const paiement = await prisma.paiement.findFirst({
        where: {
          modePaiement: { in: ['FEDAPAY', 'MOBILE_MONEY'] },
          statut: 'EN_ATTENTE',
        },
        orderBy: { createdAt: 'desc' },
      });

      if (paiement) {
        await prisma.paiement.update({
          where: { id: paiement.id },
          data: {
            statut: 'COMPLETE',
            transactionId,
            datePaiement: new Date(),
          },
        });

        // Activer l'abonnement (même fonction que PayPal)
        await activerAbonnementFedaPay(paiement.userId, paiement.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erreur webhook FedaPay:', error);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}

async function activerAbonnementFedaPay(userId: string, paiementId: string) {
  await prisma.abonnement.updateMany({
    where: { userId, actif: true },
    data: { actif: false },
  });

  const paiement = await prisma.paiement.findUnique({
    where: { id: paiementId },
  });

  if (!paiement) return;

  const plan = paiement.montant >= 70000 ? 'BUSINESS' :
               paiement.montant >= 35000 ? 'PREMIUM' :
               paiement.montant >= 15000 ? 'STANDARD' : 'GRATUIT';

  const duree = 'MENSUEL';

  await prisma.abonnement.create({
    data: {
      userId,
      plan,
      duree,
      debut: new Date(),
      fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      annoncesMax: plan === 'BUSINESS' ? 999999 : plan === 'PREMIUM' ? 50 : plan === 'STANDARD' ? 15 : 5,
      photosParAnnonce: plan === 'BUSINESS' ? 30 : plan === 'PREMIUM' ? 20 : plan === 'STANDARD' ? 10 : 5,
      paiementId,
    },
  });
}