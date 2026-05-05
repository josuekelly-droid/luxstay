// src/app/api/paiement/boost/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { creerTransactionFedaPay } from '@/lib/paiement/fedapay';
import { creerCommandePayPal } from '@/lib/paiement/paypal';
import { creerPaiementBinance } from '@/lib/paiement/binance';
import { creerPaiementCrypto } from '@/lib/paiement/nowpayments';
import prisma from '@/lib/db';

const TARIFS_BOOST: Record<string, number> = {
  BOOST: 5000,
  EPINGLEE: 10000,
  PRIORITAIRE: 20000,
};

export async function POST(request: Request) {
  let paiementId: string | null = null;

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

    // Enregistrer le paiement AVANT d'appeler la plateforme
    const paiement = await prisma.paiement.create({
      data: {
        userId: session.user.id,
        modePaiement,
        montant,
        devise: 'FCFA',
        reference: `BOOST_${Date.now()}`,
        statut: 'EN_ATTENTE',
        metaData: { annonceId, typeBoost: type },
      },
    });

    paiementId = paiement.id;

    // Appeler la plateforme de paiement
    let resultat: any = {};

    switch (modePaiement) {
      case 'FEDAPAY':
        resultat = await creerTransactionFedaPay(montant, description, {
          email: session.user.email || '',
          nom: (session.user as any).nom || '',
          prenom: (session.user as any).prenom || '',
          telephone: (session.user as any).telephone || '',
        });
        break;

      case 'PAYPAL': {
        const montantUSD = parseFloat((montant / 600).toFixed(2));
        resultat = await creerCommandePayPal(montantUSD, description);
        break;
      }

      case 'BINANCE': {
        const montantUSDT = parseFloat((montant / 600).toFixed(2));
        resultat = await creerPaiementBinance(montantUSDT, 'USDT', description);
        break;
      }

      case 'NOWPAYMENTS': {
        const montantUSD = parseFloat((montant / 600).toFixed(2));
        const nowpaymentsResult = await creerPaiementCrypto(montantUSD, description, 'usdtbsc');
        resultat = {
          url: nowpaymentsResult.invoiceUrl,
          transactionId: nowpaymentsResult.paymentId,
        };
        break;
      }

      default:
        await prisma.paiement.update({
          where: { id: paiementId },
          data: { statut: 'ECHOUE' },
        });
        return NextResponse.json(
          { error: 'Mode de paiement non supporté.' },
          { status: 400 }
        );
    }

    // Récupérer l'URL
    const paymentUrl = resultat.url || resultat.approveUrl || resultat.checkoutUrl || resultat.invoiceUrl;

    if (!paymentUrl) {
      await prisma.paiement.update({
        where: { id: paiementId },
        data: { statut: 'ECHOUE' },
      });
      return NextResponse.json(
        { error: 'Impossible de créer le paiement. Vérifiez votre configuration.' },
        { status: 500 }
      );
    }

    // Mettre à jour la référence avec l'ID réel
    await prisma.paiement.update({
      where: { id: paiementId },
      data: {
        reference: resultat.transactionId || resultat.orderId || paiement.reference,
        metaData: { annonceId, typeBoost: type },
      },
    });

    return NextResponse.json({
      success: true,
      paiementId: paiement.id,
      montant,
      devise: 'FCFA',
      url: paymentUrl,
    });
  } catch (error: any) {
    console.error('Erreur paiement boost:', error);

    if (paiementId) {
      try {
        await prisma.paiement.update({
          where: { id: paiementId },
          data: { statut: 'ECHOUE' },
        });
      } catch (updateError) {}
    }

    return NextResponse.json(
      { error: error.message || 'Erreur lors du paiement' },
      { status: 500 }
    );
  }
}