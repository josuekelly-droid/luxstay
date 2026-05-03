// src/app/api/favoris/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET - Récupérer les favoris
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const favoris = await prisma.favori.findMany({
      where: { userId: session.user.id },
      include: {
        annonce: {
          include: {
            images: {
              where: { principale: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ favoris });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}

// POST - Ajouter un favori
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { annonceId } = await request.json();

    const favori = await prisma.favori.create({
      data: {
        userId: session.user.id,
        annonceId,
      },
    });

    return NextResponse.json({ favori }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}