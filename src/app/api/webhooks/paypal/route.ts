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

      // Trouver le paiement correspondant
      const paiement = await prisma.paiement.findFirst({
        where: {
          modePaiement: 'PAYPAL',
          statut: 'EN_ATTENTE',
        },
        orderBy: { createdAt: 'desc' },
      });

      if (paiement) {
        // Mettre à jour le statut du paiement
        await prisma.paiement.update({
          where: { id: paiement.id },
          data: {
            statut: 'COMPLETE',
            transactionId: captureId,
            reference: orderId || captureId,
            datePaiement: new Date(),
          },
        });

        // Activer l'abonnement
        await activerAbonnement(paiement.userId, paiement.id);

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
  // 1. Désactiver les anciens abonnements
  await prisma.abonnement.updateMany({
    where: { userId, actif: true },
    data: { actif: false },
  });

  // ✅ PASSER EN ANNONCEUR
  await prisma.user.update({
    where: { id: userId },
    data: { role: 'ANNOUNCER' },
  });

  // 2. Récupérer le paiement
  const paiement = await prisma.paiement.findUnique({
    where: { id: paiementId },
  });

  if (!paiement) return;

  // 3. Déterminer le plan et la durée
  const plan: PlanType = determinerPlan(paiement.montant);
  const duree: DureeType = determinerDuree(paiement.montant, plan);

  // 4. Créer le nouvel abonnement
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