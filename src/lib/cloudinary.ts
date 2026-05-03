// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload une image vers Cloudinary
 */
export async function uploadImage(
  file: File,
  folder: string = 'luxstay'
): Promise<CloudinaryUploadResult> {
  // Convertir le File en Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `luxstay/${folder}`,
        transformation: [
          { width: 1200, height: 800, crop: 'fill', gravity: 'auto' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
      },
      (error, result) => {
        if (error) {
          console.error('Erreur Cloudinary:', error);
          reject(error);
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        } else {
          reject(new Error('Aucun résultat de Cloudinary'));
        }
      }
    );

    // Écrire le buffer dans le stream d'upload
    uploadStream.end(buffer);
  });
}

/**
 * Supprime une image de Cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Erreur suppression image:', error);
    return false;
  }
}