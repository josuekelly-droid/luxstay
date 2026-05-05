// src/app/api/admin/avis/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET - Récupérer tous les avis
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const avis = await prisma.avis.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ avis });
  } catch (error) {
    console.error('Erreur admin avis:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Valider/Rejeter un avis
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id, valide } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    await prisma.avis.update({
      where: { id },
      data: { valide },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur validation avis:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer un avis
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    await prisma.avis.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Avis supprimé' });
  } catch (error) {
    console.error('Erreur suppression avis:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}