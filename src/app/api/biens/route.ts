// src/app/api/biens/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const type = searchParams.get('type') || '';
    const transaction = searchParams.get('transaction') || '';
    const ville = searchParams.get('ville') || '';
    const prixMin = searchParams.get('prixMin') || '';
    const prixMax = searchParams.get('prixMax') || '';
    const chambres = searchParams.get('chambres') || '';
    const surfaceMin = searchParams.get('surfaceMin') || '';
    const tri = searchParams.get('tri') || 'recent';
    const rechercheBrute = searchParams.get('recherche') || '';

    // Nettoyer la recherche : garder uniquement lettres, chiffres, espaces, accents et tirets
    const recherche = rechercheBrute.replace(/[^a-zA-Z0-9À-ÿ\s-]/g, '').trim();

    // Construire les filtres
    const where: any = {
      statut: 'PUBLIEE',
    };

    if (type) where.type = type;
    if (transaction) where.transaction = transaction;
    if (ville) where.ville = ville;
    if (chambres) where.chambres = { gte: parseInt(chambres) };
    if (prixMin) where.prix = { ...where.prix, gte: parseFloat(prixMin) };
    if (prixMax) where.prix = { ...where.prix, lte: parseFloat(prixMax) };
    if (surfaceMin) where.surface = { gte: parseFloat(surfaceMin) };
    if (recherche) {
      where.OR = [
        { titre: { contains: recherche, mode: 'insensitive' } },
        { description: { contains: recherche, mode: 'insensitive' } },
        { quartier: { contains: recherche, mode: 'insensitive' } },
      ];
    }

    // Tri par défaut : boostés en premier, puis selon le choix utilisateur
    let orderBy: any[] = [
      { prioritaire: 'desc' },
      { epinglee: 'desc' },
      { boost: 'desc' },
    ];

    // Ajouter le tri utilisateur après les boosts
    switch (tri) {
      case 'prix_asc':
        orderBy.push({ prix: 'asc' });
        break;
      case 'prix_desc':
        orderBy.push({ prix: 'desc' });
        break;
      case 'surface_asc':
        orderBy.push({ surface: 'asc' });
        break;
      case 'surface_desc':
        orderBy.push({ surface: 'desc' });
        break;
      case 'vues':
        orderBy.push({ vues: 'desc' });
        break;
      default:
        orderBy.push({ createdAt: 'desc' });
        break;
    }

    // Compter le total
    const total = await prisma.annonce.count({ where });

    // Récupérer les annonces
    const annonces = await prisma.annonce.findMany({
      where,
      include: {
        images: {
          where: { principale: true },
          take: 1,
        },
        _count: {
          select: { favoris: true },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    // Récupérer les villes disponibles pour les filtres
    const villes = await prisma.ville.findMany({
      where: { active: true },
      select: { nom: true, slug: true },
    });

    return NextResponse.json({
      annonces,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
      filtres: {
        villes,
        types: ['APPARTEMENT', 'MAISON', 'VILLA', 'STUDIO', 'DUPLEX', 'PARCELLE'],
      },
    });
  } catch (error) {
    console.error('Erreur recherche:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche' },
      { status: 500 }
    );
  }
}