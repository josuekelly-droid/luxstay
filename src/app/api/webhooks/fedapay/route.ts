// src/app/api/webhooks/fedapay/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

type PlanType = 'GRATUIT' | 'STANDARD' | 'PREMIUM' | 'BUSINESS';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.status === 'approved') {
      const transactionId = body.id;

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

        await activerAbonnement(paiement.userId, paiement.id);

        console.log(`✅ Paiement FedaPay validé: ${transactionId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erreur webhook FedaPay:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

async function activerAbonnement(userId: string, paiementId: string) {
  // Désactiver les anciens abonnements
  await prisma.abonnement.updateMany({
    where: { userId, actif: true },
    data: { actif: false },
  });

  const paiement = await prisma.paiement.findUnique({
    where: { id: paiementId },
  });

  if (!paiement) return;

  const plan: PlanType = paiement.montant >= 70000 ? 'BUSINESS' :
                          paiement.montant >= 35000 ? 'PREMIUM' :
                          paiement.montant >= 15000 ? 'STANDARD' : 'GRATUIT';

  const duree = 'MENSUEL';

  const annoncesMax = plan === 'BUSINESS' ? 999999 :
                      plan === 'PREMIUM' ? 50 :
                      plan === 'STANDARD' ? 15 : 5;

  const photosParAnnonce = plan === 'BUSINESS' ? 30 :
                            plan === 'PREMIUM' ? 20 :
                            plan === 'STANDARD' ? 10 : 5;

  await prisma.abonnement.create({
    data: {
      userId,
      plan,
      duree,
      debut: new Date(),
      fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      annoncesMax,
      photosParAnnonce,
      paiement: { connect: { id: paiementId } }, // ✅ Correction ici
    },
  });
}