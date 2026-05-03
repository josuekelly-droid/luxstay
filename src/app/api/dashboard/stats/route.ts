// src/app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const userId = session.user.id;

    // Stats annonces
    const annoncesActives = await prisma.annonce.count({
      where: { userId, statut: { in: ['PUBLIEE', 'EN_ATTENTE'] } },
    });

    const vuesTotal = await prisma.annonce.aggregate({
      where: { userId },
      _sum: { vues: true },
    });

    // Messages non lus
    const messagesNouveaux = await prisma.message.count({
      where: { destinataireId: userId, lu: false },
    });

    // Favoris
    const favorisTotal = await prisma.favori.count({
      where: { userId },
    });

    // Abonnement
    const abonnement = await prisma.abonnement.findFirst({
      where: { userId, actif: true },
    });

    const stats = {
      annoncesActives,
      vuesTotal: vuesTotal._sum.vues || 0,
      messagesNouveaux,
      favorisTotal,
      planActuel: abonnement?.plan || 'GRATUIT',
      annoncesMax: abonnement?.annoncesMax || 5,
      annoncesUtilisees: abonnement?.annoncesUtilisees || 0,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Erreur stats:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}