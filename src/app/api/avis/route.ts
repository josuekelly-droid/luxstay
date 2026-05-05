// src/app/api/avis/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const avis = await prisma.avis.findMany({
      where: { valide: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, nom: true, role: true, commentaire: true, etoiles: true },
    });
    return NextResponse.json({ avis });
  } catch (error) {
    return NextResponse.json({ avis: [] });
  }
}