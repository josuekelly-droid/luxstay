// src/app/api/cron/expire-abonnements/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Vérifier la clé secrète pour sécuriser l'accès
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const maintenant = new Date();
    let compteur = 0;

    // Trouver tous les abonnements payants expirés mais encore marqués "actif"
    const abonnementsExpires = await prisma.abonnement.findMany({
      where: {
        actif: true,
        fin: { lt: maintenant },
        plan: { not: 'GRATUIT' }, // On ne touche pas aux gratuits
      },
      include: {
        user: {
          select: { email: true },
        },
      },
    });

    console.log(`🔍 ${abonnementsExpires.length} abonnement(s) expiré(s) trouvé(s)`);

    for (const abo of abonnementsExpires) {
      // 1. Désactiver l'ancien abonnement
      await prisma.abonnement.update({
        where: { id: abo.id },
        data: { actif: false },
      });

      // 2. Créer un abonnement gratuit par défaut
      await prisma.abonnement.create({
        data: {
          userId: abo.userId,
          plan: 'GRATUIT',
          duree: 'MENSUEL',
          debut: maintenant,
          fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          annoncesMax: 5,
          photosParAnnonce: 5,
          annoncesUtilisees: 0,
        },
      });

      compteur++;
      console.log(`✅ Abonnement ${abo.plan} expiré pour ${abo.user.email} → GRATUIT`);
    }

    return NextResponse.json({
      success: true,
      expires: compteur,
      message: `${compteur} abonnement(s) expiré(s) et remplacé(s) par GRATUIT`,
    });
  } catch (error) {
    console.error('Erreur cron expiration:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}