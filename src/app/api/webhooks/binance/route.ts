// src/app/api/webhooks/binance/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import crypto from 'crypto';

const BINANCE_SECRET = process.env.BINANCE_SECRET_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const signature = request.headers.get('BinancePay-Signature');
    const timestamp = request.headers.get('BinancePay-Timestamp');
    const nonce = request.headers.get('BinancePay-Nonce');

    // Vérifier la signature Binance
    const payload = timestamp + '\n' + nonce + '\n' + JSON.stringify(body) + '\n';
    const expectedSignature = crypto
      .createHmac('sha512', BINANCE_SECRET)
      .update(payload)
      .digest('hex')
      .toUpperCase();

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
    }

    // Vérifier si le paiement est réussi
    if (body.bizStatus === 'PAY_SUCCESS') {
      const transactionId = body.bizId;

      const paiement = await prisma.paiement.findFirst({
        where: {
          modePaiement: 'BINANCE',
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
          await activerBoostBinance(metaData.annonceId, metaData.typeBoost);
          console.log(`✅ Boost Binance ${metaData.typeBoost} activé pour annonce ${metaData.annonceId}`);
        } else {
          await activerAbonnementBinance(paiement.userId, paiement.id);
        }

        console.log(`✅ Paiement Binance validé: ${transactionId}`);
      }
    }

    return NextResponse.json({ returnCode: 'SUCCESS', returnMessage: 'OK' });
  } catch (error) {
    console.error('Erreur webhook Binance:', error);
    return NextResponse.json({ returnCode: 'FAIL', returnMessage: 'Erreur' }, { status: 500 });
  }
}

async function activerAbonnementBinance(userId: string, paiementId: string) {
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

async function activerBoostBinance(annonceId: string, type: string) {
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