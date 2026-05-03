// src/app/api/messages/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET - Récupérer les messages de l'utilisateur
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: {
        destinataireId: session.user.id,
      },
      include: {
        expediteur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
          },
        },
        annonce: {
          select: {
            id: true,
            titre: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Erreur messages:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Envoyer un message
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { destinataireId, contenu, annonceId } = await request.json();

    if (!destinataireId || !contenu) {
      return NextResponse.json({ error: 'Destinataire et contenu requis' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        expediteurId: session.user.id,
        destinataireId,
        contenu,
        annonceId: annonceId || null,
      },
      include: {
        expediteur: {
          select: { nom: true, prenom: true },
        },
        annonce: {
          select: { titre: true },
        },
      },
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error) {
    console.error('Erreur envoi message:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'envoi' }, { status: 500 });
  }
}