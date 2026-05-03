// src/app/api/annonces/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET - Récupérer les annonces de l'utilisateur connecté
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const annonces = await prisma.annonce.findMany({
      where: { userId: session.user.id },
      include: {
        images: {
          orderBy: { ordre: 'asc' },
        },
        _count: {
          select: { favoris: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ annonces });
  } catch (error) {
    console.error('Erreur récupération annonces:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des annonces' },
      { status: 500 }
    );
  }
}