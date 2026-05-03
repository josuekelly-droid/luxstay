import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { nom, prenom, email } = await request.json();

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { nom, prenom, email },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}