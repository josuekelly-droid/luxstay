// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { nom, prenom, email, telephone, password, role } = await request.json();

    if (!nom || !prenom || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cette adresse email est déjà utilisée' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Déterminer les limites selon le rôle
    const userRole = role === 'ANNOUNCER' ? 'ANNOUNCER' : 'USER';
    const annoncesMax = userRole === 'ANNOUNCER' ? 5 : 0; // Gratuit = 5 pour annonceur
    const photosParAnnonce = userRole === 'ANNOUNCER' ? 5 : 0;

    const user = await prisma.user.create({
      data: {
        nom,
        prenom,
        email,
        telephone: telephone || '',
        password: hashedPassword,
        role: userRole,
        emailVerifie: false,
        abonnements: {
          create: {
            plan: 'GRATUIT',
            duree: 'MENSUEL',
            debut: new Date(),
            fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            annoncesMax,
            photosParAnnonce,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Compte créé avec succès',
        user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur inscription:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    );
  }
}