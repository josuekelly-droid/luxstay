// prisma/seed.ts
import { PrismaClient, Role, PlanAbonnement, DureeAbonnement, TypeBien, Transaction, StatutAnnonce, ModePaiement } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed LuxStay sur Neon PostgreSQL...\n');

  // ==========================================
  // 1. NETTOYAGE DE LA BASE
  // ==========================================
  console.log('🧹 Nettoyage des tables existantes...');
  
  await prisma.favori.deleteMany();
  await prisma.message.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.image.deleteMany();
  await prisma.annonce.deleteMany();
  await prisma.paiement.deleteMany();
  await prisma.abonnement.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.quartier.deleteMany();
  await prisma.ville.deleteMany();
  
  console.log('✅ Base nettoyée\n');

  // ==========================================
  // 2. CRÉATION DES UTILISATEURS
  // ==========================================
  console.log('👤 Création des utilisateurs...');
  
  const hashedPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@luxstay.bj',
      password: hashedPassword,
      nom: 'Admin',
      prenom: 'LuxStay',
      telephone: '+22997000000',
      role: 'ADMIN',
      emailVerifie: true,
    },
  });

  const annonceur1 = await prisma.user.create({
    data: {
      email: 'annonceur1@luxstay.bj',
      password: hashedPassword,
      nom: 'Kodjo',
      prenom: 'Mensah',
      telephone: '+22997000001',
      role: 'ANNOUNCER',
      emailVerifie: true,
    },
  });

  const annonceur2 = await prisma.user.create({
    data: {
      email: 'annonceur2@luxstay.bj',
      password: hashedPassword,
      nom: 'Aminata',
      prenom: 'Diallo',
      telephone: '+22997000002',
      role: 'ANNOUNCER',
      emailVerifie: true,
    },
  });

  const userSimple = await prisma.user.create({
    data: {
      email: 'user@luxstay.bj',
      password: hashedPassword,
      nom: 'Jean',
      prenom: 'Dupont',
      telephone: '+22997000003',
      role: 'USER',
      emailVerifie: true,
    },
  });

  console.log('✅ 4 utilisateurs créés (admin, annonceur1, annonceur2, user)\n');

  // ==========================================
  // 3. CRÉATION DES ABONNEMENTS
  // ==========================================
  console.log('💎 Création des abonnements...');

  await prisma.abonnement.create({
    data: {
      userId: annonceur1.id,
      plan: 'PREMIUM',
      duree: 'ANNUEL',
      debut: new Date(),
      fin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      annoncesMax: 50,
      photosParAnnonce: 20,
      annoncesUtilisees: 3,
    },
  });

  await prisma.abonnement.create({
    data: {
      userId: annonceur2.id,
      plan: 'STANDARD',
      duree: 'MENSUEL',
      debut: new Date(),
      fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      annoncesMax: 15,
      photosParAnnonce: 10,
      annoncesUtilisees: 3,
    },
  });

  await prisma.abonnement.create({
    data: {
      userId: userSimple.id,
      plan: 'GRATUIT',
      duree: 'MENSUEL',
      debut: new Date(),
      fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      annoncesMax: 5,
      photosParAnnonce: 5,
      annoncesUtilisees: 0,
    },
  });

  console.log('✅ Abonnements créés\n');

  // ==========================================
  // 4. CRÉATION DES VILLES ET QUARTIERS
  // ==========================================
  console.log('🏙️  Création des villes du Bénin...');

  const cotonou = await prisma.ville.create({
    data: {
      nom: 'Cotonou',
      slug: 'cotonou',
      quartiers: {
        create: [
          { nom: 'Fidjrossè', slug: 'fidjrosse' },
          { nom: 'Haie Vive', slug: 'haie-vive' },
          { nom: 'Zongo', slug: 'zongo' },
          { nom: 'Jonquet', slug: 'jonquet' },
          { nom: 'Les Cocotiers', slug: 'les-cocotiers' },
          { nom: 'Saint-Jean', slug: 'saint-jean' },
          { nom: 'Ganhi', slug: 'ganhi' },
          { nom: 'Akpakpa', slug: 'akpakpa' },
          { nom: 'Gbegamey', slug: 'gbegamey' },
        ],
      },
    },
  });

  const calavi = await prisma.ville.create({
    data: {
      nom: 'Abomey-Calavi',
      slug: 'abomey-calavi',
      quartiers: {
        create: [
          { nom: 'Agori', slug: 'agori' },
          { nom: 'Zopah', slug: 'zopah' },
          { nom: 'Fifadji', slug: 'fifadji' },
          { nom: 'Tokpa-Zoungo', slug: 'tokpa-zoungo' },
          { nom: 'Godomey', slug: 'godomey' },
        ],
      },
    },
  });

  const portoNovo = await prisma.ville.create({
    data: {
      nom: 'Porto-Novo',
      slug: 'porto-novo',
      quartiers: {
        create: [
          { nom: 'Djassin', slug: 'djassin' },
          { nom: 'Ouando', slug: 'ouando' },
          { nom: 'Tokpota', slug: 'tokpota' },
          { nom: 'Akindin', slug: 'akindin' },
        ],
      },
    },
  });

  const parakou = await prisma.ville.create({
    data: {
      nom: 'Parakou',
      slug: 'parakou',
      quartiers: {
        create: [
          { nom: 'Titirou', slug: 'titirou' },
          { nom: 'Kpébié', slug: 'kpebie' },
          { nom: 'Banikanni', slug: 'banikanni' },
        ],
      },
    },
  });

  const natitingou = await prisma.ville.create({
    data: {
      nom: 'Natitingou',
      slug: 'natitingou',
      quartiers: {
        create: [
          { nom: 'Centre-Ville', slug: 'centre-ville' },
          { nom: 'Perma', slug: 'perma' },
        ],
      },
    },
  });

  console.log('✅ 5 villes créées avec leurs quartiers\n');

  // ==========================================
  // 5. CRÉATION DES ANNONCES
  // ==========================================
  console.log('🏠 Création des annonces...');

  const annonce1 = await prisma.annonce.create({
    data: {
      userId: annonceur1.id,
      titre: 'Villa Moderne avec Piscine - Fidjrossè',
      description: 'Magnifique villa moderne entièrement meublée avec piscine, climatisation, parking et groupe électrogène. Idéale pour famille ou investissement. Située dans un quartier calme et sécurisé de Fidjrossè, proche de la plage.',
      type: 'VILLA',
      transaction: 'VENTE',
      prix: 85000000,
      ville: 'Cotonou',
      quartier: 'Fidjrossè',
      chambres: 4,
      sallesBain: 3,
      surface: 350,
      piscine: true,
      climatisation: true,
      parking: true,
      groupeElectro: true,
      meuble: true,
      statut: 'PUBLIEE',
      prioritaire: true,
      datePublication: new Date(),
      vues: 245,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', publicId: 'seed_villa_1', principale: true, ordre: 0 },
          { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', publicId: 'seed_villa_2', ordre: 1 },
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', publicId: 'seed_villa_3', ordre: 2 },
        ],
      },
    },
  });

  const annonce2 = await prisma.annonce.create({
    data: {
      userId: annonceur1.id,
      titre: 'Appartement Standing - Haie Vive',
      description: 'Appartement de luxe au cœur de Cotonou, proche de toutes les commodités. Cuisine équipée, salon spacieux, chambres climatisées. Idéal pour expatriés ou professionnels.',
      type: 'APPARTEMENT',
      transaction: 'LOCATION',
      prix: 350000,
      ville: 'Cotonou',
      quartier: 'Haie Vive',
      chambres: 3,
      sallesBain: 2,
      surface: 150,
      climatisation: true,
      parking: true,
      meuble: true,
      wifi: true,
      statut: 'PUBLIEE',
      boost: true,
      datePublication: new Date(),
      vues: 189,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', publicId: 'seed_appt_1', principale: true, ordre: 0 },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', publicId: 'seed_appt_2', ordre: 1 },
        ],
      },
    },
  });

  const annonce3 = await prisma.annonce.create({
    data: {
      userId: annonceur2.id,
      titre: 'Parcelle Viabilisée - Abomey-Calavi',
      description: 'Belle parcelle de 500m² dans un quartier en plein développement. Titre foncier disponible. Proche de la voie principale. Idéal pour construction résidentielle ou investissement.',
      type: 'PARCELLE',
      transaction: 'VENTE',
      prix: 12000000,
      ville: 'Abomey-Calavi',
      quartier: 'Zopah',
      surface: 500,
      statut: 'PUBLIEE',
      datePublication: new Date(),
      vues: 120,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', publicId: 'seed_parcelle_1', principale: true, ordre: 0 },
        ],
      },
    },
  });

  const annonce4 = await prisma.annonce.create({
    data: {
      userId: annonceur2.id,
      titre: 'Studio Meublé - Les Cocotiers',
      description: 'Studio moderne entièrement meublé, idéal pour étudiant ou jeune professionnel. Proche des universités et des restaurants.',
      type: 'STUDIO',
      transaction: 'LOCATION',
      prix: 150000,
      ville: 'Cotonou',
      quartier: 'Les Cocotiers',
      chambres: 1,
      sallesBain: 1,
      surface: 35,
      meuble: true,
      wifi: true,
      balcon: true,
      statut: 'PUBLIEE',
      datePublication: new Date(),
      vues: 312,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800', publicId: 'seed_studio_1', principale: true, ordre: 0 },
        ],
      },
    },
  });

  const annonce5 = await prisma.annonce.create({
    data: {
      userId: annonceur1.id,
      titre: 'Maison Familiale avec Jardin - Saint-Jean',
      description: 'Grande maison familiale avec jardin, parfaite pour une grande famille. Garage, espace vert, quartier résidentiel calme. Proche des écoles et du marché.',
      type: 'MAISON',
      transaction: 'VENTE',
      prix: 45000000,
      ville: 'Cotonou',
      quartier: 'Saint-Jean',
      chambres: 5,
      sallesBain: 3,
      surface: 280,
      parking: true,
      gardien: true,
      statut: 'PUBLIEE',
      epinglee: true,
      datePublication: new Date(),
      vues: 156,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', publicId: 'seed_maison_1', principale: true, ordre: 0 },
          { url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800', publicId: 'seed_maison_2', ordre: 1 },
        ],
      },
    },
  });

  const annonce6 = await prisma.annonce.create({
    data: {
      userId: annonceur2.id,
      titre: 'Duplex Premium - Porto-Novo',
      description: 'Superbe duplex dans le centre de Porto-Novo. Finitions haut de gamme, escalier en marbre, toit terrasse avec vue panoramique.',
      type: 'DUPLEX',
      transaction: 'VENTE',
      prix: 65000000,
      ville: 'Porto-Novo',
      quartier: 'Djassin',
      chambres: 4,
      sallesBain: 3,
      surface: 220,
      climatisation: true,
      parking: true,
      statut: 'PUBLIEE',
      datePublication: new Date(),
      vues: 98,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', publicId: 'seed_duplex_1', principale: true, ordre: 0 },
        ],
      },
    },
  });

  const annonce7 = await prisma.annonce.create({
    data: {
      userId: annonceur1.id,
      titre: 'Terrain Commercial - Ganhi',
      description: 'Terrain idéal pour projet commercial au cœur du quartier d\'affaires. Grande visibilité, accès facile. Titre foncier disponible.',
      type: 'PARCELLE',
      transaction: 'VENTE',
      prix: 150000000,
      ville: 'Cotonou',
      quartier: 'Ganhi',
      surface: 800,
      statut: 'PUBLIEE',
      boost: true,
      datePublication: new Date(),
      vues: 423,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', publicId: 'seed_terrain_1', principale: true, ordre: 0 },
        ],
      },
    },
  });

  console.log('✅ 7 annonces créées avec images\n');

  // ==========================================
  // 6. CRÉATION DE FAVORIS (pour tester)
  // ==========================================
  console.log('❤️  Création de favoris...');

  await prisma.favori.createMany({
    data: [
      { userId: userSimple.id, annonceId: annonce1.id },
      { userId: userSimple.id, annonceId: annonce4.id },
      { userId: annonceur2.id, annonceId: annonce1.id },
    ],
  });

  console.log('✅ 3 favoris créés\n');

  // ==========================================
  // 7. CRÉATION DE MESSAGES (pour tester)
  // ==========================================
  console.log('💬 Création de messages...');

  await prisma.message.create({
    data: {
      expediteurId: userSimple.id,
      destinataireId: annonceur1.id,
      annonceId: annonce1.id,
      contenu: 'Bonjour, je suis intéressé par cette villa. Est-elle toujours disponible ?',
    },
  });

  await prisma.message.create({
    data: {
      expediteurId: annonceur1.id,
      destinataireId: userSimple.id,
      annonceId: annonce1.id,
      contenu: 'Bonjour ! Oui, la villa est toujours disponible. Souhaitez-vous la visiter ?',
    },
  });

  console.log('✅ Messages créés\n');

  // ==========================================
  // RÉSUMÉ
  // ==========================================
  console.log('═══════════════════════════════════');
  console.log('  🌱 SEED TERMINÉ AVEC SUCCÈS !');
  console.log('═══════════════════════════════════');
  console.log(`  👤 Utilisateurs : ${await prisma.user.count()}`);
  console.log(`  🏠 Annonces    : ${await prisma.annonce.count()}`);
  console.log(`  🏙️  Villes      : ${await prisma.ville.count()}`);
  console.log(`  💎 Abonnements : ${await prisma.abonnement.count()}`);
  console.log(`  ❤️  Favoris     : ${await prisma.favori.count()}`);
  console.log(`  💬 Messages    : ${await prisma.message.count()}`);
  console.log('═══════════════════════════════════\n');
  console.log('🔑 Identifiants de test :');
  console.log('   admin@luxstay.bj      / user123 (Admin)');
  console.log('   annonceur1@luxstay.bj / user123 (Premium)');
  console.log('   annonceur2@luxstay.bj / user123 (Standard)');
  console.log('   user@luxstay.bj       / user123 (Simple)\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });