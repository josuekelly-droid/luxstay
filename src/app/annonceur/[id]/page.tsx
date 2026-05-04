// src/app/annonceur/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, Loader2, MapPin, Bed, Maximize, Eye,
  Phone, MessageSquare, CheckCircle, Home,
} from 'lucide-react';

interface AnnonceurData {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  avatar: string | null;
  dateInscription: string;
  abonnements?: { plan: string }[];
}

interface Annonce {
  id: string;
  titre: string;
  prix: number;
  type: string;
  transaction: string;
  ville: string;
  quartier: string;
  chambres: number | null;
  surface: number | null;
  vues: number;
  images: { url: string }[];
  _count: { favoris: number };
}

export default function AnnonceurPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [annonceur, setAnnonceur] = useState<AnnonceurData | null>(null);
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchAnnonceur();
  }, [id]);

  const fetchAnnonceur = async () => {
    try {
      const response = await fetch(`/api/annonceur/${id}`);
      const data = await response.json();
      if (response.ok) {
        setAnnonceur(data.annonceur);
        setAnnonces(data.annonces);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrix = (prix: number) => new Intl.NumberFormat('fr-FR').format(Math.round(prix));
  const planActuel = annonceur?.abonnements?.[0]?.plan;
  const estVerifie = planActuel === 'PREMIUM' || planActuel === 'BUSINESS';

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-luxury-sand-light">
        <Loader2 size={48} className="text-luxury-green animate-spin" />
      </main>
    );
  }

  if (!annonceur) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-luxury-sand-light">
        <h1 className="text-2xl font-bold mb-4">Annonceur introuvable</h1>
        <Link href="/" className="btn-primary">Retour à l&apos;accueil</Link>
      </main>
    );
  }

  const telPropre = annonceur.telephone?.replace(/[^0-9]/g, '') || '';
  const whatsappUrl = `https://wa.me/${telPropre}?text=Bonjour, je suis intéressé par vos annonces sur LuxStay`;
  const emailUrl = `mailto:${annonceur.email}?subject=À propos de vos annonces sur LuxStay&body=Bonjour, je suis intéressé par vos annonces sur LuxStay.`;

  return (
    <main className="min-h-screen bg-luxury-sand-light pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-3 sm:px-4 max-w-5xl">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-luxury-green mb-6 transition"
        >
          <ArrowLeft size={18} /> Retour
        </button>

        {/* Profil annonceur */}
        <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-luxury-green rounded-full flex items-center justify-center text-white font-bold text-2xl sm:text-3xl flex-shrink-0">
              {annonceur.prenom?.charAt(0)}{annonceur.nom?.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-luxury-green-dark">
                  {annonceur.prenom} {annonceur.nom}
                </h1>
                {estVerifie && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle size={12} /> Vérifié
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {estVerifie ? 'Annonceur vérifié' : 'Annonceur'} • {annonces.length} annonce{annonces.length > 1 ? 's' : ''} • Inscrit le {new Date(annonceur.dateInscription).toLocaleDateString('fr-FR')}
              </p>

              {/* Boutons contact */}
              <div className="flex flex-wrap gap-2">
                <a href={`tel:${annonceur.telephone}`} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
                  <Phone size={16} /> Appeler
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold hover:bg-green-600 transition">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <a href={emailUrl} className="bg-blue-500 text-white flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold hover:bg-blue-600 transition">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  Email
                </a>
                <a href={`sms:${annonceur.telephone}`} className="btn-secondary flex items-center gap-2 text-sm px-4 py-2">
                  <MessageSquare size={16} /> SMS
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Annonces de l'annonceur */}
        <h2 className="font-display text-xl sm:text-2xl font-bold text-luxury-green-dark mb-6 flex items-center gap-2">
          <Home size={24} /> Ses annonces ({annonces.length})
        </h2>

        {annonces.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-16 text-center">
            <Home size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Cet annonceur n&apos;a pas encore d&apos;annonce publiée.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map((annonce) => (
              <Link
                key={annonce.id}
                href={`/bien/${annonce.id}`}
                className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-luxury transition group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={annonce.images[0]?.url || '/placeholder-bien.jpg'}
                    alt={annonce.titre}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-luxury-green text-white text-xs px-2 py-1 rounded-full">
                      {annonce.transaction === 'VENTE' ? 'À vendre' : 'À louer'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-bold text-luxury-green-dark mb-2 line-clamp-1 group-hover:text-luxury-green transition">
                    {annonce.titre}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                    <MapPin size={14} className="text-luxury-gold" />
                    <span className="truncate">{annonce.quartier}, {annonce.ville}</span>
                  </div>
                  <div className="text-lg font-bold text-luxury-green mb-2">
                    {formatPrix(annonce.prix)} FCFA
                    {annonce.transaction === 'LOCATION' && <span className="text-xs font-normal text-gray-500">/mois</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {annonce.chambres && <span className="flex items-center gap-1"><Bed size={12} /> {annonce.chambres}</span>}
                    {annonce.surface && <span className="flex items-center gap-1"><Maximize size={12} /> {annonce.surface} m²</span>}
                    <span className="flex items-center gap-1 ml-auto"><Eye size={12} /> {annonce.vues}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}