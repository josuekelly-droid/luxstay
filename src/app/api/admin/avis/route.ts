// src/app/api/admin/avis/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }

  const avis = await prisma.avis.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ avis });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }

  const { id, valide } = await request.json();
  await prisma.avis.update({ where: { id }, data: { valide } });

  return NextResponse.json({ success: true });
}