// src/app/api/webhooks/paypal/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

type PlanType = 'GRATUIT' | 'STANDARD' | 'PREMIUM' | 'BUSINESS';
type DureeType = 'MENSUEL' | 'TROIS_MOIS' | 'ANNUEL';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const eventType = body.event_type;

    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = body.resource;
      const captureId = resource.id;
      const orderId = resource.supplementary_data?.related_ids?.order_id;

      const paiement = await prisma.paiement.findFirst({
        where: {
          modePaiement: 'PAYPAL',
          statut: 'EN_ATTENTE',
        },
        orderBy: { createdAt: 'desc' },
      });

      if (paiement) {
        await prisma.paiement.update({
          where: { id: paiement.id },
          data: {
            statut: 'COMPLETE',
            transactionId: captureId,
            reference: orderId || captureId,
            datePaiement: new Date(),
          },
        });

        // Vérifier si c'est un paiement de boost
        const metaData = paiement.metaData as any;
        if (metaData?.annonceId && metaData?.typeBoost) {
          await activerBoost(metaData.annonceId, metaData.typeBoost);
          console.log(`✅ Boost PayPal ${metaData.typeBoost} activé pour annonce ${metaData.annonceId}`);
        } else {
          await activerAbonnement(paiement.userId, paiement.id);
        }

        console.log(`✅ Paiement PayPal validé: ${captureId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erreur webhook PayPal:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// ==========================================
// FONCTIONS UTILITAIRES
// ==========================================

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

  const plan: PlanType = determinerPlan(paiement.montant);
  const duree: DureeType = determinerDuree(paiement.montant, plan);

  await prisma.abonnement.create({
    data: {
      userId,
      plan,
      duree,
      debut: new Date(),
      fin: new Date(Date.now() + dureeEnJours(duree) * 24 * 60 * 60 * 1000),
      annoncesMax: annoncesParPlan(plan),
      photosParAnnonce: photosParPlan(plan),
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

function determinerPlan(montant: number): PlanType {
  if (montant >= 70000) return 'BUSINESS';
  if (montant >= 35000) return 'PREMIUM';
  if (montant >= 15000) return 'STANDARD';
  return 'GRATUIT';
}

function determinerDuree(montant: number, plan: PlanType): DureeType {
  const tarifs: Record<PlanType, Record<DureeType, number>> = {
    GRATUIT:  { MENSUEL: 0,      TROIS_MOIS: 0,      ANNUEL: 0       },
    STANDARD: { MENSUEL: 15000,  TROIS_MOIS: 38250,  ANNUEL: 126000  },
    PREMIUM:  { MENSUEL: 35000,  TROIS_MOIS: 89250,  ANNUEL: 294000  },
    BUSINESS: { MENSUEL: 70000,  TROIS_MOIS: 178500, ANNUEL: 588000  },
  };

  const planTarifs = tarifs[plan];
  if (montant === planTarifs.ANNUEL) return 'ANNUEL';
  if (montant === planTarifs.TROIS_MOIS) return 'TROIS_MOIS';
  return 'MENSUEL';
}

function dureeEnJours(duree: DureeType): number {
  switch (duree) {
    case 'ANNUEL': return 365;
    case 'TROIS_MOIS': return 90;
    default: return 30;
  }
}

function annoncesParPlan(plan: PlanType): number {
  switch (plan) {
    case 'BUSINESS': return 999999;
    case 'PREMIUM': return 50;
    case 'STANDARD': return 15;
    default: return 5;
  }
}

function photosParPlan(plan: PlanType): number {
  switch (plan) {
    case 'BUSINESS': return 30;
    case 'PREMIUM': return 20;
    case 'STANDARD': return 10;
    default: return 5;
  }
}