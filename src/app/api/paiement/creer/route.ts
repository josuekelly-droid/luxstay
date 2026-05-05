// src/app/api/paiement/creer/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { creerTransactionFedaPay } from '@/lib/paiement/fedapay';
import { creerCommandePayPal } from '@/lib/paiement/paypal';
import { creerPaiementBinance } from '@/lib/paiement/binance';
import { creerPaiementCrypto } from '@/lib/paiement/nowpayments';

type Plan = 'STANDARD' | 'PREMIUM' | 'BUSINESS';
type Duree = 'MENSUEL' | 'TROIS_MOIS' | 'ANNUEL';
type ModePaiement = 'FEDAPAY' | 'MOBILE_MONEY' | 'PAYPAL' | 'BINANCE' | 'NOWPAYMENTS';

interface PaiementResult {
  token?: string;
  url?: string;
  transactionId?: string;
  orderId?: string;
  status?: string;
  approveUrl?: string;
  checkoutUrl?: string;
  invoiceUrl?: string;
}

const tarifs: Record<Plan, Record<Duree, number>> = {
  STANDARD: { MENSUEL: 15000, TROIS_MOIS: 38250, ANNUEL: 126000 },
  PREMIUM: { MENSUEL: 35000, TROIS_MOIS: 89250, ANNUEL: 294000 },
  BUSINESS: { MENSUEL: 70000, TROIS_MOIS: 178500, ANNUEL: 588000 },
};

export async function POST(request: Request) {
  let paiementId: string | null = null;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé - Veuillez vous connecter' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan, duree, modePaiement } = body as {
      plan: Plan;
      duree: Duree;
      modePaiement: ModePaiement;
    };

    if (!plan || !duree || !modePaiement) {
      return NextResponse.json(
        { error: 'Paramètres manquants : plan, duree, modePaiement' },
        { status: 400 }
      );
    }

    if (!tarifs[plan]) {
      return NextResponse.json({ error: `Plan invalide : ${plan}` }, { status: 400 });
    }

    if (!tarifs[plan][duree]) {
      return NextResponse.json({ error: `Durée invalide : ${duree}` }, { status: 400 });
    }

    const montant = tarifs[plan][duree];
    const userId = session.user.id;

    // Enregistrer le paiement AVANT d'appeler la plateforme
    const reference = `LUXSTAY_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const paiement = await prisma.paiement.create({
      data: {
        userId: userId,
        modePaiement: modePaiement,
        montant: montant,
        devise: 'FCFA',
        reference: reference,
        statut: 'EN_ATTENTE',
      },
    });

    paiementId = paiement.id;

    // Appeler la plateforme de paiement
    let resultat: PaiementResult = {};

    switch (modePaiement) {
      case 'FEDAPAY':
      case 'MOBILE_MONEY':
        resultat = await creerTransactionFedaPay(
          montant,
          `Abonnement LuxStay ${plan} - ${duree}`,
          {
            email: session.user.email || '',
            nom: (session.user as any).nom || '',
            prenom: (session.user as any).prenom || '',
            telephone: (session.user as any).telephone || '',
          }
        );
        break;

      case 'PAYPAL':
        resultat = await creerCommandePayPal(
          Number((montant / 600).toFixed(2)),
          `Abonnement LuxStay ${plan} - ${duree}`
        );
        break;

      case 'BINANCE':
        resultat = await creerPaiementBinance(
          Number((montant / 600).toFixed(2)),
          'USDT',
          `Abonnement LuxStay ${plan} - ${duree}`
        );
        break;

      case 'NOWPAYMENTS':
        const nowpaymentsResult = await creerPaiementCrypto(
          Number((montant / 600).toFixed(2)),
          `Abonnement LuxStay ${plan} - ${duree}`,
          'usdtbsc'
        );
        resultat = {
          url: nowpaymentsResult.invoiceUrl,
          transactionId: nowpaymentsResult.paymentId,
        };
        break;

      default:
        await prisma.paiement.update({
          where: { id: paiementId },
          data: { statut: 'ECHOUE' },
        });
        return NextResponse.json(
          { error: `Mode de paiement non supporté : ${modePaiement}` },
          { status: 400 }
        );
    }

    // Mettre à jour la référence avec l'ID de transaction réel
    const refFinale = resultat.transactionId || resultat.orderId || reference;

    await prisma.paiement.update({
      where: { id: paiementId },
      data: {
        reference: refFinale,
        metaData: resultat as any,
      },
    });

    return NextResponse.json({
      success: true,
      paiementId: paiement.id,
      montant,
      devise: 'FCFA',
      reference: refFinale,
      modePaiement,
      ...resultat,
    });
  } catch (error: any) {
    console.error('Erreur création paiement:', error);

    // Marquer le paiement comme échoué si la plateforme a planté
    if (paiementId) {
      try {
        await prisma.paiement.update({
          where: { id: paiementId },
          data: { statut: 'ECHOUE' },
        });
      } catch (updateError) {
        console.error('Erreur mise à jour statut échoué:', updateError);
      }
    }

    return NextResponse.json(
      {
        error: error.message || 'Erreur lors de la création du paiement',
        details: error.message,
      },
      { status: 500 }
    );
  }
}