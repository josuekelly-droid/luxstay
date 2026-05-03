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

    const [annoncesActives, vuesTotal, messagesNouveaux, favorisTotal, abonnement] = await Promise.all([
      prisma.annonce.count({
        where: { userId, statut: { in: ['PUBLIEE', 'EN_ATTENTE'] } },
      }),
      prisma.annonce.aggregate({
        where: { userId },
        _sum: { vues: true },
      }),
      prisma.message.count({
        where: { destinataireId: userId, lu: false },
      }),
      prisma.favori.count({
        where: { userId },
      }),
      prisma.abonnement.findFirst({
        where: { userId, actif: true },
      }),
    ]);

    return NextResponse.json({
      stats: {
        annoncesActives,
        vuesTotal: vuesTotal._sum.vues || 0,
        messagesNouveaux,
        favorisTotal,
        planActuel: abonnement?.plan || 'GRATUIT',
        annoncesMax: abonnement?.annoncesMax || 5,
        annoncesUtilisees: abonnement?.annoncesUtilisees || 0,
        photosParAnnonce: abonnement?.photosParAnnonce || 5,
        expireLe: abonnement?.fin || null,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}