// src/app/api/paiement/boost/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { creerTransactionFedaPay } from '@/lib/paiement/fedapay';
import { creerCommandePayPal } from '@/lib/paiement/paypal';
import { creerPaiementBinance } from '@/lib/paiement/binance';
import prisma from '@/lib/db';

const TARIFS_BOOST: Record<string, number> = {
  BOOST: 5000,
  EPINGLEE: 10000,
  PRIORITAIRE: 20000,
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { annonceId, type, modePaiement } = await request.json();

    if (!annonceId || !type || !TARIFS_BOOST[type]) {
      return NextResponse.json({ error: 'Type de boost invalide' }, { status: 400 });
    }

    const montant = TARIFS_BOOST[type];
    const description = `Boost ${type} - Annonce ${annonceId}`;
    let resultat: any = {};
    let devise = 'FCFA';

    try {
      switch (modePaiement) {
        case 'FEDAPAY':
          resultat = await creerTransactionFedaPay(montant, description, {
            email: session.user.email || '',
            nom: (session.user as any).nom || '',
            prenom: (session.user as any).prenom || '',
            telephone: (session.user as any).telephone || '',
          });
          break;

        case 'PAYPAL':
          devise = 'USD';
          const montantUSD = parseFloat((montant / 600).toFixed(2));
          resultat = await creerCommandePayPal(montantUSD, description);
          break;

        case 'BINANCE':
          devise = 'USDT';
          const montantUSDT = parseFloat((montant / 600).toFixed(2));
          resultat = await creerPaiementBinance(montantUSDT, 'USDT', description);
          break;

        default:
          return NextResponse.json(
            { error: 'Mode de paiement non supporté. Utilisez FEDAPAY, PAYPAL ou BINANCE' },
            { status: 400 }
          );
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la création du paiement' },
        { status: 500 }
      );
    }

    // Récupérer l'URL selon le mode de paiement
    const paymentUrl = resultat.url || resultat.approveUrl || resultat.checkoutUrl;

    if (!paymentUrl) {
      return NextResponse.json(
        { error: 'Impossible de créer le paiement. Vérifiez votre configuration.' },
        { status: 500 }
      );
    }

    // Enregistrer le paiement
    const paiement = await prisma.paiement.create({
      data: {
        userId: session.user.id,
        modePaiement,
        montant,
        devise,
        reference: resultat.transactionId || resultat.orderId || `BOOST_${Date.now()}`,
        statut: 'EN_ATTENTE',
        metaData: { annonceId, typeBoost: type },
      },
    });

    return NextResponse.json({
      success: true,
      paiementId: paiement.id,
      montant,
      devise,
      url: paymentUrl,
    });
  } catch (error: any) {
    console.error('Erreur paiement boost:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors du paiement' },
      { status: 500 }
    );
  }
}