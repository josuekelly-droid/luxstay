// src/app/api/annonces/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET - Récupérer une annonce par ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params; // ✅ Attendre params

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const annonce = await prisma.annonce.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { ordre: 'asc' },
        },
      },
    });

    if (!annonce) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 });
    }

    if (annonce.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    return NextResponse.json({ annonce });
  } catch (error) {
    console.error('Erreur récupération annonce:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'annonce' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une annonce
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params; // ✅ Attendre params

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const annonceExistante = await prisma.annonce.findUnique({
      where: { id },
    });

    if (!annonceExistante) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 });
    }

    if (annonceExistante.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const data = await request.json();

    const annonce = await prisma.annonce.update({
      where: { id },
      data: {
        titre: data.titre,
        description: data.description,
        type: data.type,
        transaction: data.transaction,
        prix: parseFloat(data.prix),
        ville: data.ville,
        quartier: data.quartier,
        surface: data.surface ? parseFloat(data.surface) : null,
        chambres: data.chambres ? parseInt(data.chambres) : null,
        sallesBain: data.sallesBain ? parseInt(data.sallesBain) : null,
        meuble: data.meuble || false,
        climatisation: data.climatisation || false,
        piscine: data.piscine || false,
        parking: data.parking || false,
        wifi: data.wifi || false,
        groupeElectro: data.groupeElectro || false,
        gardien: data.gardien || false,
        balcon: data.balcon || false,
        statut: data.statut || 'BROUILLON',
      },
      include: {
        images: {
          orderBy: { ordre: 'asc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Annonce mise à jour avec succès',
      annonce,
    });
  } catch (error) {
    console.error('Erreur mise à jour annonce:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'annonce' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une annonce
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params; // ✅ Attendre params

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const annonce = await prisma.annonce.findUnique({
      where: { id },
    });

    if (!annonce) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 });
    }

    if (annonce.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    await prisma.annonce.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Annonce supprimée' });
  } catch (error) {
    console.error('Erreur suppression annonce:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}