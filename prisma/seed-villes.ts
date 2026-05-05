// prisma/seed-villes.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏙️  Ajout des villes du Bénin...\n');

  const villes = [
    {
      nom: 'Cotonou', slug: 'cotonou',
      quartiers: ['Fidjrossè', 'Haie Vive', 'Zongo', 'Jonquet', 'Les Cocotiers', 'Saint-Jean', 'Ganhi', 'Akpakpa', 'Gbegamey'],
    },
    {
      nom: 'Abomey-Calavi', slug: 'abomey-calavi',
      quartiers: ['Agori', 'Zopah', 'Fifadji', 'Tokpa-Zoungo', 'Godomey'],
    },
    {
      nom: 'Porto-Novo', slug: 'porto-novo',
      quartiers: ['Djassin', 'Ouando', 'Tokpota', 'Akindin'],
    },
    {
      nom: 'Parakou', slug: 'parakou',
      quartiers: ['Titirou', 'Kpébié', 'Banikanni', 'Ganou'],
    },
    {
      nom: 'Natitingou', slug: 'natitingou',
      quartiers: ['Centre-Ville', 'Perma', 'Yokossi'],
    },
    {
      nom: 'Djougou', slug: 'djougou',
      quartiers: ['Centre-Ville', 'Kilmakou', 'Baria'],
    },
    {
      nom: 'Bohicon', slug: 'bohicon',
      quartiers: ['Centre-Ville', 'Ahouamè', 'Sodohomè'],
    },
    {
      nom: 'Abomey', slug: 'abomey',
      quartiers: ['Centre-Ville', 'Hountondji', 'Zongo'],
    },
    {
      nom: 'Lokossa', slug: 'lokossa',
      quartiers: ['Centre-Ville', 'Agamé', 'Koudo'],
    },
    {
      nom: 'Ouidah', slug: 'ouidah',
      quartiers: ['Centre-Ville', 'Zomaï', 'Gbéna'],
    },
    {
      nom: 'Grand-Popo', slug: 'grand-popo',
      quartiers: ['Centre-Ville', 'Agoué', 'Hilla-Condji'],
    },
    {
      nom: 'Kandi', slug: 'kandi',
      quartiers: ['Centre-Ville', 'Kéféri', 'Sonsoro'],
    },
    {
      nom: 'Malanville', slug: 'malanville',
      quartiers: ['Centre-Ville', 'Gaya', 'Bodjécali'],
    },
    {
      nom: 'Dassa-Zoumè', slug: 'dassa-zoume',
      quartiers: ['Centre-Ville', 'Gankpétin', 'Sokouhoué'],
    },
    {
      nom: 'Savalou', slug: 'savalou',
      quartiers: ['Centre-Ville', 'Agbado', 'Zaffé'],
    },
    {
      nom: 'Allada', slug: 'allada',
      quartiers: ['Centre-Ville', 'Sékou', 'Atokou'],
    },
    {
      nom: 'Sèmè-Kpodji', slug: 'seme-kpodji',
      quartiers: ['Centre-Ville', 'Djèrègbé', 'Tohouè'],
    },
  ];

  for (const ville of villes) {
    await prisma.ville.upsert({
      where: { slug: ville.slug },
      update: {},
      create: {
        nom: ville.nom,
        slug: ville.slug,
        quartiers: {
          create: ville.quartiers.map(q => ({
            nom: q,
            slug: q.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          })),
        },
      },
    });
    console.log(`✅ ${ville.nom} - ${ville.quartiers.length} quartiers`);
  }

  console.log(`\n🎉 ${villes.length} villes ajoutées !`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());