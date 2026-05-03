// src/app/api/admin/utilisateurs/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id } = await params;
    const { bloque } = await request.json();

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { id },
      data: { bloque },
    });

    if (bloque) {
      // Supprimer toutes les sessions actives → déconnexion immédiate
      await prisma.session.deleteMany({
        where: { userId: id },
      });

      // Archiver toutes ses annonces → disparaissent du site
      await prisma.annonce.updateMany({
        where: { userId: id },
        data: { statut: 'ARCHIVEE' },
      });
    } else {
      // Si débloqué, remettre les annonces en brouillon
      await prisma.annonce.updateMany({
        where: { userId: id, statut: 'ARCHIVEE' },
        data: { statut: 'BROUILLON' },
      });
    }

    return NextResponse.json({
      success: true,
      message: bloque
        ? 'Utilisateur bloqué, déconnecté et annonces archivées'
        : 'Utilisateur débloqué et annonces restaurées en brouillon',
    });
  } catch (error) {
    console.error('Erreur gestion utilisateur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}