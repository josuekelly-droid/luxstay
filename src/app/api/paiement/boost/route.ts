// src/app/api/paiement/boost/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { creerTransactionFedaPay } from '@/lib/paiement/fedapay';
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

    if (modePaiement === 'FEDAPAY') {
      resultat = await creerTransactionFedaPay(montant, description, {
        email: session.user.email || '',
        nom: (session.user as any).nom || '',
        prenom: (session.user as any).prenom || '',
        telephone: (session.user as any).telephone || '',
      });
    }

    // Enregistrer le paiement
    const paiement = await prisma.paiement.create({
      data: {
        userId: session.user.id,
        modePaiement,
        montant,
        devise: 'FCFA',
        reference: resultat.transactionId || `BOOST_${Date.now()}`,
        statut: 'EN_ATTENTE',
        metaData: { annonceId, typeBoost: type },
      },
    });

    return NextResponse.json({
      success: true,
      paiementId: paiement.id,
      montant,
      url: resultat.url,
    });
  } catch (error: any) {
    console.error('Erreur paiement boost:', error);
    return NextResponse.json({ error: error.message || 'Erreur' }, { status: 500 });
  }
}