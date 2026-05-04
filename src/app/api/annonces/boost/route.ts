// src/app/api/annonces/boost/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

const TARIFS_BOOST = {
  BOOST: { prix: 5000, duree: 7 },      // 7 jours
  EPINGLEE: { prix: 10000, duree: 15 },  // 15 jours
  PRIORITAIRE: { prix: 20000, duree: 30 }, // 30 jours
};

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { annonceId, type } = await request.json();

    if (!annonceId || !type || !TARIFS_BOOST[type as keyof typeof TARIFS_BOOST]) {
      return NextResponse.json({ error: 'Type de boost invalide' }, { status: 400 });
    }

    // Vérifier que l'annonce appartient à l'utilisateur
    const annonce = await prisma.annonce.findFirst({
      where: { id: annonceId, userId: session.user.id },
    });

    if (!annonce) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 });
    }

    const { duree } = TARIFS_BOOST[type as keyof typeof TARIFS_BOOST];

    // Appliquer le boost
    const updateData: any = {
      boost: type === 'BOOST' ? true : annonce.boost,
      epinglee: type === 'EPINGLEE' ? true : annonce.epinglee,
      prioritaire: type === 'PRIORITAIRE' ? true : annonce.prioritaire,
      dateExpiration: new Date(Date.now() + duree * 24 * 60 * 60 * 1000),
    };

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

export async function GET() {
  return NextResponse.json({ tarifs: TARIFS_BOOST });
}