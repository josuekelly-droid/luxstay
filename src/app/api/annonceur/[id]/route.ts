// src/app/api/annonceur/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Récupérer l'annonceur
    const annonceur = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        avatar: true,
        dateInscription: true,
        abonnements: {
          where: { actif: true },
          select: { plan: true },
          take: 1,
        },
      },
    });

    if (!annonceur) {
      return NextResponse.json({ error: 'Annonceur introuvable' }, { status: 404 });
    }

    // Récupérer ses annonces publiées
    const annonces = await prisma.annonce.findMany({
      where: {
        userId: id,
        statut: 'PUBLIEE',
      },
      include: {
        images: {
          where: { principale: true },
          take: 1,
        },
        _count: {
          select: { favoris: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ annonceur, annonces });
  } catch (error) {
    console.error('Erreur annonceur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}