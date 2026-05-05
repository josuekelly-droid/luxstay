// src/app/api/webhooks/nowpayments/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-nowpayments-sig');

    console.log('📥 Webhook NowPayments reçu:', body.payment_status);

    // Vérifier si le paiement est terminé
    if (body.payment_status === 'finished' || body.payment_status === 'confirmed') {
      const paymentId = body.payment_id;
      const orderId = body.order_id;

      const paiement = await prisma.paiement.findFirst({
        where: {
          modePaiement: 'NOWPAYMENTS',
          statut: 'EN_ATTENTE',
        },
        orderBy: { createdAt: 'desc' },
      });

      if (paiement) {
        await prisma.paiement.update({
          where: { id: paiement.id },
          data: {
            statut: 'COMPLETE',
            transactionId: paymentId,
            reference: orderId || paymentId,
            datePaiement: new Date(),
          },
        });

        // Vérifier si c'est un paiement de boost
        const metaData = paiement.metaData as any;
        if (metaData?.annonceId && metaData?.typeBoost) {
          await activerBoostNowPayments(metaData.annonceId, metaData.typeBoost);
          console.log(`✅ Boost NowPayments ${metaData.typeBoost} activé pour annonce ${metaData.annonceId}`);
        } else {
          await activerAbonnementNowPayments(paiement.userId, paiement.id);
        }

        console.log(`✅ Paiement NowPayments validé: ${paymentId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erreur webhook NowPayments:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

async function activerAbonnementNowPayments(userId: string, paiementId: string) {
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

  const plan = paiement.montant >= 70000 ? 'BUSINESS' :
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

async function activerBoostNowPayments(annonceId: string, type: string) {
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