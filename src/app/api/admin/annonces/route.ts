import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const annonces = await prisma.annonce.findMany({
      include: {
        user: { select: { nom: true, prenom: true, email: true } },
        images: { where: { principale: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ annonces });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}