// src/app/api/signalements/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { annonceId, type, description } = await request.json();

    const signalement = await prisma.signalement.create({
      data: {
        userId: session.user.id,
        annonceId,
        type: type || 'AUTRE',
        description: description || '',
      },
    });

    return NextResponse.json({ success: true, signalement }, { status: 201 });
  } catch (error) {
    console.error('Erreur signalement:', error);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}