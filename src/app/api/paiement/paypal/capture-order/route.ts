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

    const { orderId, plan, duree, montant } = await request.json();

    if (!orderId || !plan || !duree || !montant) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    // Capturer le paiement PayPal
    const capture = await capturerPaiementPayPal(orderId);

    if (!capture.success) {
      return NextResponse.json({ error: 'Échec de la capture du paiement' }, { status: 400 });
    }

    const planType: PlanType = plan;
    const dureeType: DureeType = duree;
    const jours = dureeEnJours[dureeType] || 30;

    // Enregistrer le paiement
    const paiement = await prisma.paiement.create({
      data: {
        userId: session.user.id,
        modePaiement: 'PAYPAL',
        montant,
        devise: 'FCFA',
        reference: orderId,
        transactionId: capture.captureId,
        statut: 'COMPLETE',
        datePaiement: new Date(),
        metaData: { plan, duree },
      },
    });

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
        paiement: { connect: { id: paiement.id } },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Paiement réussi - Abonnement ${plan} activé pour ${dureeType === 'MENSUEL' ? '1 mois' : dureeType === 'TROIS_MOIS' ? '3 mois' : '1 an'}`,
    });
  } catch (error: any) {
    console.error('Erreur capture-order PayPal:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur capture commande' },
      { status: 500 }
    );
  }
}