// src/app/api/biens/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const annonce = await prisma.annonce.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { ordre: 'asc' },
        },
        user: {
          select: {
            nom: true,
            prenom: true,
            telephone: true,
            email: true,
          },
        },
      },
    });

    if (!annonce) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 });
    }

    // Incrémenter les vues
    await prisma.annonce.update({
      where: { id },
      data: { vues: { increment: 1 } },
    });

    return NextResponse.json({ annonce });
  } catch (error) {
    console.error('Erreur récupération bien:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du bien' },
      { status: 500 }
    );
  }
}