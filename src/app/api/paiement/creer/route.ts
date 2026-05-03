// src/app/api/paiement/creer/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { creerTransactionFedaPay } from '@/lib/paiement/fedapay';
import { creerCommandePayPal } from '@/lib/paiement/paypal';
import { creerPaiementBinance } from '@/lib/paiement/binance';

type Plan = 'STANDARD' | 'PREMIUM' | 'BUSINESS';
type Duree = 'MENSUEL' | 'TROIS_MOIS' | 'ANNUEL';
type ModePaiement = 'FEDAPAY' | 'MOBILE_MONEY' | 'PAYPAL' | 'BINANCE';

// Interface unique pour tous les types de résultats de paiement
interface PaiementResult {
  token?: string;
  url?: string;
  transactionId?: string;
  orderId?: string;
  status?: string;
  approveUrl?: string;
  checkoutUrl?: string;
}

const tarifs: Record<Plan, Record<Duree, number>> = {
  STANDARD: {
    MENSUEL: 15000,
    TROIS_MOIS: 38250,
    ANNUEL: 126000,
  },
  PREMIUM: {
    MENSUEL: 35000,
    TROIS_MOIS: 89250,
    ANNUEL: 294000,
  },
  BUSINESS: {
    MENSUEL: 70000,
    TROIS_MOIS: 178500,
    ANNUEL: 588000,
  },
};

export async function POST(request: Request) {
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
        {
          error: 'Paramètres manquants',
          required: { plan: 'STANDARD|PREMIUM|BUSINESS', duree: 'MENSUEL|TROIS_MOIS|ANNUEL', modePaiement: 'FEDAPAY|MOBILE_MONEY|PAYPAL|BINANCE' },
        },
        { status: 400 }
      );
    }

    if (!tarifs[plan]) {
      return NextResponse.json(
        { error: `Plan invalide : ${plan}` },
        { status: 400 }
      );
    }

    if (!tarifs[plan][duree]) {
      return NextResponse.json(
        { error: `Durée invalide : ${duree}` },
        { status: 400 }
      );
    }

    const montant = tarifs[plan][duree];
    const userId = session.user.id;

    // Typé correctement
    let resultat: PaiementResult = {};

    switch (modePaiement) {
      case 'FEDAPAY':
      case 'MOBILE_MONEY':
        resultat = await creerTransactionFedaPay(
          montant,
          `Abonnement LuxStay ${plan} - ${duree}`,
          {
            email: session.user.email || '',
            nom: session.user.nom || '',
            prenom: session.user.prenom || '',
            telephone: session.user.telephone || '',
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

      default:
        return NextResponse.json(
          {
            error: `Mode de paiement non supporté : ${modePaiement}`,
            modesDisponibles: ['FEDAPAY', 'MOBILE_MONEY', 'PAYPAL', 'BINANCE'],
          },
          { status: 400 }
        );
    }

    // Générer une référence unique
    const reference = 
      resultat.transactionId || 
      resultat.orderId || 
      `LUXSTAY_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Enregistrer le paiement
    const paiement = await prisma.paiement.create({
      data: {
        userId: userId,
        modePaiement: modePaiement,
        montant: montant,
        devise: modePaiement === 'PAYPAL' || modePaiement === 'BINANCE' ? 'USD' : 'FCFA',
        reference: reference,
        statut: 'EN_ATTENTE',
        metaData: resultat as any,
      },
    });

    return NextResponse.json({
      success: true,
      paiementId: paiement.id,
      montant,
      devise: paiement.devise,
      reference: paiement.reference,
      modePaiement,
      ...resultat,
    });
  } catch (error) {
    console.error('Erreur création paiement:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la création du paiement',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}