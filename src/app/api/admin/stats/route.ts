// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const [
      totalUtilisateurs,
      totalAnnonces,
      annoncesEnAttente,
      totalPaiements,
      revenuAgg,
      nouveauxUtilisateurs,
      totalAnnonceurs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.annonce.count(),
      prisma.annonce.count({ where: { statut: 'EN_ATTENTE' } }),
      prisma.paiement.count({ where: { statut: 'COMPLETE' } }),
      prisma.paiement.aggregate({
        where: { statut: 'COMPLETE' },
        _sum: { montant: true },
      }),
      prisma.user.count({
        where: {
          dateInscription: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.user.count({ where: { role: 'ANNOUNCER' } }),
    ]);

    const tauxConversion = totalUtilisateurs > 0
      ? Math.round((totalAnnonceurs / totalUtilisateurs) * 100)
      : 0;

    const stats = {
      totalUtilisateurs,
      totalAnnonces,
      annoncesEnAttente,
      totalPaiements,
      revenuTotal: revenuAgg._sum.montant || 0,
      nouveauxUtilisateurs,
      tauxConversion,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Erreur stats admin:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}