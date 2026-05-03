// src/app/api/annonces/creer/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé - Veuillez vous connecter' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const data = await request.json();

    // Validation des champs obligatoires
    if (!data.titre || !data.prix || !data.description || !data.ville) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants : titre, prix, description, ville' },
        { status: 400 }
      );
    }

    if (!data.images || data.images.length === 0) {
      return NextResponse.json(
        { error: 'Au moins une image est requise' },
        { status: 400 }
      );
    }

    // ==========================================
    // VÉRIFICATION ET GESTION DE L'ABONNEMENT
    // ==========================================

    // 1. Récupérer l'abonnement actif
    let abonnement = await prisma.abonnement.findFirst({
      where: { userId, actif: true },
    });

    // 2. Vérifier si l'abonnement a expiré
    if (abonnement && new Date() > new Date(abonnement.fin)) {
      // Désactiver l'abonnement expiré
      await prisma.abonnement.update({
        where: { id: abonnement.id },
        data: { actif: false },
      });

      // Créer automatiquement un abonnement gratuit
      abonnement = await prisma.abonnement.create({
        data: {
          userId,
          plan: 'GRATUIT',
          duree: 'MENSUEL',
          debut: new Date(),
          fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          annoncesMax: 5,
          photosParAnnonce: 5,
          annoncesUtilisees: 0,
        },
      });
    }

    // 3. Si aucun abonnement n'existe, créer un gratuit
    if (!abonnement) {
      abonnement = await prisma.abonnement.create({
        data: {
          userId,
          plan: 'GRATUIT',
          duree: 'MENSUEL',
          debut: new Date(),
          fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          annoncesMax: 5,
          photosParAnnonce: 5,
          annoncesUtilisees: 0,
        },
      });
    }

    // 4. Vérifier les limites d'annonces
    const annoncesActives = await prisma.annonce.count({
      where: {
        userId,
        statut: { in: ['PUBLIEE', 'EN_ATTENTE'] },
      },
    });

    if (annoncesActives >= abonnement.annoncesMax) {
      return NextResponse.json(
        {
          error: `Limite de ${abonnement.annoncesMax} annonces atteinte. Passez à un plan supérieur pour publier plus d'annonces.`,
        },
        { status: 403 }
      );
    }

    // ==========================================
    // CRÉATION DE L'ANNONCE
    // ==========================================

    const annonce = await prisma.annonce.create({
      data: {
        userId,
        titre: data.titre,
        description: data.description || '',
        type: data.type || 'APPARTEMENT',
        transaction: data.transaction || 'VENTE',
        prix: parseFloat(data.prix),
        ville: data.ville,
        quartier: data.quartier || '',
        surface: data.surface || null,
        chambres: data.chambres || null,
        sallesBain: data.sallesBain || null,
        meuble: data.meuble || false,
        climatisation: data.climatisation || false,
        piscine: data.piscine || false,
        parking: data.parking || false,
        wifi: data.wifi || false,
        groupeElectro: data.groupeElectro || false,
        gardien: data.gardien || false,
        balcon: data.balcon || false,
        statut: 'EN_ATTENTE',
        images: {
          create: data.images.map((img: any, index: number) => ({
            url: img.url,
            publicId: img.publicId || `temp_${Date.now()}_${index}`,
            principale: img.principale !== undefined ? img.principale : index === 0,
            ordre: img.ordre || index,
          })),
        },
      },
      include: {
        images: { orderBy: { ordre: 'asc' } },
      },
    });

    // Mettre à jour le compteur d'annonces utilisées
    await prisma.abonnement.update({
      where: { id: abonnement.id },
      data: { annoncesUtilisees: abonnement.annoncesUtilisees + 1 },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Annonce créée avec succès',
        annonce: {
          id: annonce.id,
          titre: annonce.titre,
          statut: annonce.statut,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur création annonce:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'annonce' },
      { status: 500 }
    );
  }
}