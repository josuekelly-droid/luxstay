// src/app/api/auth/magic-link/verify/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/connexion?error=invalid', request.url));
    }

    
    const magicToken = await prisma.magicToken.findUnique({
      where: { token },
    });

    if (!magicToken || new Date() > new Date(magicToken.expires)) {
      
      if (magicToken) {
        await prisma.magicToken.delete({ where: { id: magicToken.id } });
      }
      return NextResponse.redirect(new URL('/connexion?error=expired', request.url));
    }

    
    const user = await prisma.user.findUnique({
      where: { email: magicToken.email },
    });

    if (!user || user.bloque) {
      return NextResponse.redirect(new URL('/connexion?error=invalid', request.url));
    }

    // Supprimer le token (usage unique)
    await prisma.magicToken.delete({ where: { id: magicToken.id } });

    
    await prisma.user.update({
      where: { id: user.id },
      data: { derniereConnexion: new Date() },
    });

    
    const dashboardUrl = user.role === 'ADMIN' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  } catch (error) {
    console.error('Erreur vérification magic link:', error);
    return NextResponse.redirect(new URL('/connexion?error=server', request.url));
  }
}