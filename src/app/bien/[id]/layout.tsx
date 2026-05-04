// src/app/bien/[id]/layout.tsx
import type { Metadata } from 'next';
import prisma from '@/lib/db';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;

    const annonce = await prisma.annonce.findUnique({
      where: { id },
      include: {
        images: { where: { principale: true }, take: 1 },
      },
    });

    if (!annonce) {
      return {
        title: 'Annonce introuvable - LuxStay',
      };
    }

    const prixFormat = new Intl.NumberFormat('fr-FR').format(Math.round(annonce.prix));
    const type = annonce.transaction === 'VENTE' ? 'à vendre' : 'à louer';

    return {
      title: `${annonce.titre} - ${prixFormat} FCFA - LuxStay`,
      description: `${annonce.titre} ${type} à ${annonce.quartier}, ${annonce.ville}. ${annonce.description?.substring(0, 150)}...`,
      openGraph: {
        title: `${annonce.titre} - ${prixFormat} FCFA`,
        description: `${annonce.titre} ${type} à ${annonce.quartier}, ${annonce.ville}.`,
        images: annonce.images[0]?.url
          ? [{ url: annonce.images[0].url, width: 1200, height: 630 }]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: annonce.titre,
        description: `${prixFormat} FCFA - ${annonce.quartier}, ${annonce.ville}`,
        images: annonce.images[0]?.url || '',
      },
    };
  } catch (error) {
    return {
      title: 'LuxStay - Immobilier Bénin',
    };
  }
}

export default function BienLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}