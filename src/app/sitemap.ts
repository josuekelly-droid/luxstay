// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import prisma from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://luxstay-bj.vercel.app').replace(/\/$/, '');

  
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/recherche`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/appartements`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/parcelles`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/tarifs`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/a-propos`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/donner-avis`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/confidentialite`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/conditions`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/connexion`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/inscription`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/maintenance`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.1 },
  ];

  
  const articles = [
    'investir-immobilier-benin-2026',
    'top-quartiers-cotonou',
    'acheter-ou-louer-benin',
    'documents-achat-parcelle-benin',
    'villas-luxe-benin',
    'estimer-prix-bien-immobilier',
  ];

  const blogPages = articles.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  
  let annoncesPages: MetadataRoute.Sitemap = [];
  let annonceursPages: MetadataRoute.Sitemap = [];

  try {
    
    const annonces = await prisma.annonce.findMany({
      where: { statut: 'PUBLIEE' },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });

    annoncesPages = annonces.map(annonce => ({
      url: `${baseUrl}/bien/${annonce.id}`,
      lastModified: annonce.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    
    const annonceurs = await prisma.user.findMany({
      where: {
        role: 'ANNOUNCER',
        annonces: { some: { statut: 'PUBLIEE' } },
      },
      select: { id: true, updatedAt: true },
    });

    annonceursPages = annonceurs.map(user => ({
      url: `${baseUrl}/annonceur/${user.id}`,
      lastModified: user.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));
  } catch (error) {
    console.error('Erreur sitemap dynamique:', error);
  }

  return [
    ...staticPages,
    ...blogPages,
    ...annoncesPages,
    ...annonceursPages,
  ];
}