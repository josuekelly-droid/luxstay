// src/app/api/avis/donner/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour donner votre avis' },
        { status: 401 }
      );
    }

    const { nom, role, commentaire, etoiles } = await request.json();

    if (!nom || !commentaire || !etoiles) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const avis = await prisma.avis.create({
      data: {
        nom,
        role: role || 'Acheteur',
        commentaire,
        etoiles: Math.min(5, Math.max(1, etoiles)),
        valide: false,
      },
    });

    return NextResponse.json({ success: true, avis }, { status: 201 });
  } catch (error) {
    console.error('Erreur création avis:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}