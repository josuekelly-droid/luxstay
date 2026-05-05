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
    let compteurAbonnements = 0;
    let compteurBoosts = 0;
    let compteurPaiementsExpires = 0;

    // ==========================================
    // 1. GÉRER LES ABONNEMENTS EXPIRÉS
    // ==========================================
    const abonnementsExpires = await prisma.abonnement.findMany({
      where: {
        actif: true,
        fin: { lt: maintenant },
        plan: { not: 'GRATUIT' },
      },
      include: {
        user: { select: { email: true } },
      },
    });

    console.log(`🔍 ${abonnementsExpires.length} abonnement(s) expiré(s) trouvé(s)`);

    for (const abo of abonnementsExpires) {
      await prisma.abonnement.update({
        where: { id: abo.id },
        data: { actif: false },
      });

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

      compteurAbonnements++;
      console.log(`✅ Abonnement ${abo.plan} expiré pour ${abo.user.email} → GRATUIT`);
    }

    // ==========================================
    // 2. DÉSACTIVER LES BOOSTS EXPIRÉS
    // ==========================================
    const boostsExpires = await prisma.annonce.findMany({
      where: {
        OR: [
          { boost: true },
          { epinglee: true },
          { prioritaire: true },
        ],
        dateExpiration: { lt: maintenant },
      },
      select: { id: true, titre: true, boost: true, epinglee: true, prioritaire: true },
    });

    console.log(`🔍 ${boostsExpires.length} boost(s) expiré(s) trouvé(s)`);

    for (const annonce of boostsExpires) {
      const typesExpires = [];
      if (annonce.boost) typesExpires.push('Boost');
      if (annonce.epinglee) typesExpires.push('Épinglée');
      if (annonce.prioritaire) typesExpires.push('Prioritaire');

      await prisma.annonce.update({
        where: { id: annonce.id },
        data: {
          boost: false,
          epinglee: false,
          prioritaire: false,
          dateExpiration: null,
        },
      });

      compteurBoosts++;
      console.log(`✅ Boost expiré pour "${annonce.titre}" → ${typesExpires.join(', ')} désactivé(s)`);
    }

    // ==========================================
    // 3. GÉRER LES PAIEMENTS CRYPTO EXPIRÉS
    // ==========================================
    const delaiExpiration = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes

    const paiementsExpires = await prisma.paiement.findMany({
      where: {
        modePaiement: 'NOWPAYMENTS',
        statut: 'EN_ATTENTE',
        createdAt: { lt: delaiExpiration },
      },
      select: { id: true, reference: true },
    });

    console.log(`🔍 ${paiementsExpires.length} paiement(s) crypto expiré(s) trouvé(s)`);

    for (const p of paiementsExpires) {
      await prisma.paiement.update({
        where: { id: p.id },
        data: { statut: 'ECHOUE' },
      });

      compteurPaiementsExpires++;
      console.log(`✅ Paiement crypto expiré: ${p.reference} → ECHOUE`);
    }

    return NextResponse.json({
      success: true,
      abonnementsExpires: compteurAbonnements,
      boostsExpires: compteurBoosts,
      paiementsExpires: compteurPaiementsExpires,
      message: `${compteurAbonnements} abonnement(s), ${compteurBoosts} boost(s) et ${compteurPaiementsExpires} paiement(s) crypto traités`,
    });
  } catch (error) {
    console.error('Erreur cron expiration:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}