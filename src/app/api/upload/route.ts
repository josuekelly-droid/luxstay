// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé - Veuillez vous connecter' },
        { status: 401 }
      );
    }

    // Récupérer les fichiers du FormData
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Aucune image fournie' },
        { status: 400 }
      );
    }

    // Limiter le nombre de fichiers
    if (files.length > 20) {
      return NextResponse.json(
        { error: 'Maximum 20 images par upload' },
        { status: 400 }
      );
    }

    // Vérifier les types de fichiers
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Type de fichier non supporté: ${file.type}. Types acceptés: JPG, PNG, WebP, AVIF` },
          { status: 400 }
        );
      }
      // Limiter la taille à 10MB
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `Fichier trop volumineux: ${file.name} (max 10MB)` },
          { status: 400 }
        );
      }
    }

    // Upload de toutes les images vers Cloudinary
    const uploadPromises = files.map((file) =>
      uploadImage(file, `annonces/${session.user.id}`)
    );

    const results = await Promise.all(uploadPromises);

    // Formater la réponse
    const images = results.map((result, index) => ({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      principale: index === 0,
      ordre: index,
    }));

    return NextResponse.json({
      success: true,
      images,
      count: images.length,
      message: `${images.length} image(s) uploadée(s) avec succès`,
    });
  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json(
      {
        error: "Erreur lors de l'upload des images",
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}