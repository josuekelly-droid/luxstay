// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Éviter d'appeler la DB à chaque requête
export async function middleware(request: NextRequest) {
  // Ignorer les assets statiques et les APIs
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/maintenance') ||
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/connexion') ||
    request.nextUrl.pathname.startsWith('/favicon') ||
    request.nextUrl.pathname.startsWith('/icon') ||
    request.nextUrl.pathname.startsWith('/og-image')
  ) {
    return NextResponse.next();
  }

  try {
    // Vérifier le mode maintenance via une API interne
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const response = await fetch(`${appUrl}/api/admin/config/check`);
    
    if (response.ok) {
      const { maintenance } = await response.json();
      
      if (maintenance && !request.nextUrl.pathname.startsWith('/maintenance')) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }
  } catch (error) {
    // Si l'API échoue, on laisse passer
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|maintenance|admin|connexion|favicon|icon|og-image).*)'],
};