// src/app/api/admin/config/check/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const config = await prisma.configuration.findUnique({
      where: { cle: 'maintenance' },
    });

    return NextResponse.json({
      maintenance: config?.valeur === 'true',
    });
  } catch (error) {
    return NextResponse.json({ maintenance: false });
  }
}