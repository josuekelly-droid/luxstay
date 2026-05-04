// src/app/api/annonces/boost/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

const TARIFS_BOOST = {
  BOOST: { prix: 5000, duree: 7 },
  EPINGLEE: { prix: 10000, duree: 15 },
  PRIORITAIRE: { prix: 20000, duree: 30 },
};

// GET - Récupérer les tarifs des boosts
export async function GET() {
  return NextResponse.json({ tarifs: TARIFS_BOOST });
}

// PUT - Activer un boost (appelé par le webhook après paiement)
export async function PUT(request: Request) {
  try {
    // Vérifier si l'appel vient du webhook (cron) ou d'un utilisateur
    const authHeader = request.headers.get('authorization');
    const isWebhook = authHeader === `Bearer ${process.env.CRON_SECRET}`;

    const { annonceId, type } = await request.json();

    if (!annonceId || !type || !TARIFS_BOOST[type as keyof typeof TARIFS_BOOST]) {
      return NextResponse.json({ error: 'Type de boost invalide' }, { status: 400 });
    }

    // Si ce n'est pas le webhook, vérifier que l'utilisateur est propriétaire
    if (!isWebhook) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      }

      const annonce = await prisma.annonce.findFirst({
        where: { id: annonceId, userId: session.user.id },
      });

      if (!annonce) {
        return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 });
      }
    }

    // Récupérer l'annonce (pour le webhook)
    const annonce = await prisma.annonce.findUnique({
      where: { id: annonceId },
    });

    if (!annonce) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 });
    }

    const { duree } = TARIFS_BOOST[type as keyof typeof TARIFS_BOOST];

    // Appliquer le boost sans écraser les autres boosts existants
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

    return NextResponse.json({
      success: true,
      message: `Boost ${type} activé pour ${duree} jours`,
    });
  } catch (error) {
    console.error('Erreur boost:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}