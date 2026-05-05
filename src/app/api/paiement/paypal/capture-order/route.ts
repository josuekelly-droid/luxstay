// src/app/api/paiement/paypal/capture-order/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { capturerPaiementPayPal } from '@/lib/paiement/paypal';
import prisma from '@/lib/db';

type PlanType = 'GRATUIT' | 'STANDARD' | 'PREMIUM' | 'BUSINESS';
type DureeType = 'MENSUEL' | 'TROIS_MOIS' | 'ANNUEL';

const annoncesParPlan: Record<PlanType, number> = {
  GRATUIT: 5, STANDARD: 15, PREMIUM: 50, BUSINESS: 999999,
};
const photosParPlan: Record<PlanType, number> = {
  GRATUIT: 5, STANDARD: 10, PREMIUM: 20, BUSINESS: 30,
};
const dureeEnJours: Record<DureeType, number> = {
  MENSUEL: 30, TROIS_MOIS: 90, ANNUEL: 365,
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { orderId, plan, duree, montant, paiementId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'OrderId manquant' }, { status: 400 });
    }

    try {
      // Capturer le paiement PayPal
      const capture = await capturerPaiementPayPal(orderId);

      if (!capture.success) {
        // Marquer le paiement comme échoué
        if (paiementId) {
          await prisma.paiement.update({
            where: { id: paiementId },
            data: { statut: 'ECHOUE' },
          });
        }
        return NextResponse.json({ error: 'Échec de la capture du paiement' }, { status: 400 });
      }

      const planType: PlanType = (plan as PlanType) || 'STANDARD';
      const dureeType: DureeType = (duree as DureeType) || 'MENSUEL';
      const jours = dureeEnJours[dureeType] || 30;

      // Mettre à jour le paiement existant (créé dans create-order)
      if (paiementId) {
        await prisma.paiement.update({
          where: { id: paiementId },
          data: {
            statut: 'COMPLETE',
            transactionId: capture.captureId,
            datePaiement: new Date(),
          },
        });
      }

      // Désactiver les anciens abonnements
      await prisma.abonnement.updateMany({
        where: { userId: session.user.id, actif: true },
        data: { actif: false },
      });

      // Passer en ANNOUNCER
      await prisma.user.update({
        where: { id: session.user.id },
        data: { role: 'ANNOUNCER' },
      });

      // Créer le nouvel abonnement
      await prisma.abonnement.create({
        data: {
          userId: session.user.id,
          plan: planType,
          duree: dureeType,
          debut: new Date(),
          fin: new Date(Date.now() + jours * 24 * 60 * 60 * 1000),
          annoncesMax: annoncesParPlan[planType],
          photosParAnnonce: photosParPlan[planType],
          ...(paiementId ? { paiement: { connect: { id: paiementId } } } : {}),
        },
      });

      return NextResponse.json({
        success: true,
        message: `Paiement réussi - Abonnement ${planType} activé pour ${dureeType === 'MENSUEL' ? '1 mois' : dureeType === 'TROIS_MOIS' ? '3 mois' : '1 an'}`,
      });
    } catch (captureError: any) {
      // Si la capture échoue, marquer le paiement comme échoué
      if (paiementId) {
        await prisma.paiement.update({
          where: { id: paiementId },
          data: { statut: 'ECHOUE' },
        });
      }
      throw captureError;
    }
  } catch (error: any) {
    console.error('Erreur capture-order PayPal:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur capture commande' },
      { status: 500 }
    );
  }
}