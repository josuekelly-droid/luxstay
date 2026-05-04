// src/app/api/webhooks/fedapay/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

type PlanType = 'GRATUIT' | 'STANDARD' | 'PREMIUM' | 'BUSINESS';

const TARIFS_BOOST: Record<string, number> = {
  BOOST: 5000,
  EPINGLEE: 10000,
  PRIORITAIRE: 20000,
};

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

        // Vérifier si c'est un paiement de boost
        const metaData = paiement.metaData as any;
        if (metaData?.annonceId && metaData?.typeBoost) {
          await activerBoost(metaData.annonceId, metaData.typeBoost);
          console.log(`✅ Boost ${metaData.typeBoost} activé pour annonce ${metaData.annonceId}`);
        } else {
          // Sinon c'est un abonnement
          await activerAbonnement(paiement.userId, paiement.id);
        }

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
  await prisma.abonnement.updateMany({
    where: { userId, actif: true },
    data: { actif: false },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { role: 'ANNOUNCER' },
  });

  const paiement = await prisma.paiement.findUnique({
    where: { id: paiementId },
  });

  if (!paiement) return;

  const plan: PlanType = paiement.montant >= 70000 ? 'BUSINESS' :
                          paiement.montant >= 35000 ? 'PREMIUM' :
                          paiement.montant >= 15000 ? 'STANDARD' : 'GRATUIT';

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
      duree: 'MENSUEL',
      debut: new Date(),
      fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      annoncesMax,
      photosParAnnonce,
      paiement: { connect: { id: paiementId } },
    },
  });
}

async function activerBoost(annonceId: string, type: string) {
  const durees: Record<string, number> = {
    BOOST: 7,
    EPINGLEE: 15,
    PRIORITAIRE: 30,
  };

  const duree = durees[type] || 7;

  const updateData: any = {
    dateExpiration: new Date(Date.now() + duree * 24 * 60 * 60 * 1000),
  };

  if (type === 'BOOST') updateData.boost = true;
  if (type === 'EPINGLEE') updateData.epinglee = true;
  if (type === 'PRIORITAIRE') updateData.prioritaire = true;

  await prisma.annonce.update({
    where: { id: annonceId },
    data: updateData,
  });
}