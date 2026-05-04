// src/app/api/admin/utilisateurs/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// PUT - Bloquer/Débloquer un utilisateur
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

// DELETE - Supprimer définitivement un utilisateur
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id } = await params;

    // Empêcher de supprimer son propre compte
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur n'est pas admin
    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Impossible de supprimer un administrateur' },
        { status: 400 }
      );
    }

    // Supprimer dans l'ordre pour éviter les contraintes de clé étrangère
    await prisma.$transaction([
      // 1. Favoris
      prisma.favori.deleteMany({ where: { userId: id } }),
      // 2. Images (via annonces)
      prisma.image.deleteMany({ where: { annonce: { userId: id } } }),
      // 3. Annonces
      prisma.annonce.deleteMany({ where: { userId: id } }),
      // 4. Messages
      prisma.message.deleteMany({
        where: { OR: [{ expediteurId: id }, { destinataireId: id }] },
      }),
      // 5. Notifications
      prisma.notification.deleteMany({ where: { userId: id } }),
      // 6. Paiements
      prisma.paiement.deleteMany({ where: { userId: id } }),
      // 7. Abonnements
      prisma.abonnement.deleteMany({ where: { userId: id } }),
      // 8. Sessions
      prisma.session.deleteMany({ where: { userId: id } }),
      // 9. Signalements
      prisma.signalement.deleteMany({ where: { userId: id } }),
    ]);

    // Enfin, supprimer l'utilisateur
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé définitivement avec toutes ses données',
    });
  } catch (error: any) {
    console.error('Erreur suppression utilisateur:', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}