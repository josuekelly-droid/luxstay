// src/app/bien/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  MapPin, Bed, Bath, Maximize, Heart, Share2, Phone,
  Check, ArrowLeft, Loader2, Eye, Send, Flag, MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AnnonceDetail {
  id: string;
  titre: string;
  description: string;
  type: string;
  transaction: string;
  prix: number;
  ville: string;
  quartier: string;
  surface: number | null;
  chambres: number | null;
  sallesBain: number | null;
  meuble: boolean;
  climatisation: boolean;
  piscine: boolean;
  parking: boolean;
  wifi: boolean;
  groupeElectro: boolean;
  gardien: boolean;
  balcon: boolean;
  statut: string;
  vues: number;
  datePublication: string | null;
  images: { id: string; url: string; principale: boolean }[];
  user: {
    id: string;
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
  };
}

export default function BienDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const id = params.id as string;

  const [annonce, setAnnonce] = useState<AnnonceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageActive, setImageActive] = useState(0);
  const [isFavori, setIsFavori] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSignalForm, setShowSignalForm] = useState(false);
  const [signalType, setSignalType] = useState('CONTENU_INAPPROPRIE');
  const [signalDescription, setSignalDescription] = useState('');

  useEffect(() => {
    if (id) {
      fetchAnnonce();
      checkFavori();
    }
  }, [id]);

  const fetchAnnonce = async () => {
    try {
      const response = await fetch(`/api/biens/${id}`);
      const data = await response.json();
      if (response.ok) setAnnonce(data.annonce);
      else toast.error('Annonce introuvable');
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const checkFavori = async () => {
    if (!session) return;
    try {
      const res = await fetch('/api/favoris');
      const data = await res.json();
      if (res.ok) {
        setIsFavori(data.favoris?.some((f: any) => f.annonceId === id));
      }
    } catch (error) {}
  };

  const handleToggleFavori = async () => {
    if (!session) {
      toast.error('Connectez-vous pour ajouter aux favoris');
      return;
    }
    try {
      if (isFavori) {
        const res = await fetch('/api/favoris');
        const data = await res.json();
        const favori = data.favoris?.find((f: any) => f.annonceId === id);
        if (favori) {
          await fetch(`/api/favoris/${favori.id}`, { method: 'DELETE' });
        }
        setIsFavori(false);
        toast.success('Retiré des favoris');
      } else {
        await fetch('/api/favoris', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ annonceId: id }),
        });
        setIsFavori(true);
        toast.success('Ajouté aux favoris');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: annonce?.titre,
          text: `Découvrez ${annonce?.titre} sur LuxStay`,
          url: window.location.href,
        });
      } catch (error) {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié !');
    }
  };

  const handleSendMessage = async () => {
    if (!session) {
      toast.error('Connectez-vous pour envoyer un message');
      return;
    }
    if (!message.trim()) {
      toast.error('Écrivez un message');
      return;
    }
    if (!annonce?.user?.id) {
      toast.error('Annonceur non disponible');
      return;
    }
    setIsSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinataireId: annonce.user.id,
          contenu: message,
          annonceId: id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Message envoyé !');
        setMessage('');
        setShowContactForm(false);
      } else {
        toast.error(data.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsSending(false);
    }
  };

  const handleSignaler = async () => {
    if (!session) {
      toast.error('Connectez-vous pour signaler');
      return;
    }
    try {
      const response = await fetch('/api/signalements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annonceId: id,
          type: signalType,
          description: signalDescription,
        }),
      });
      if (response.ok) {
        toast.success('Signalement envoyé');
        setShowSignalForm(false);
        setSignalDescription('');
      } else {
        toast.error('Erreur');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const formatPrix = (prix: number) => new Intl.NumberFormat('fr-FR').format(Math.round(prix));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-sand-light">
        <Loader2 size={48} className="text-luxury-green animate-spin" />
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-luxury-sand-light">
        <h1 className="text-2xl font-bold text-luxury-green-dark mb-4">Annonce introuvable</h1>
        <Link href="/" className="btn-primary">Retour à l&apos;accueil</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-luxury-sand-light pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Bouton retour */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-luxury-green mb-6 transition"
        >
          <ArrowLeft size={18} /> Retour aux résultats
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Images et détails */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galerie images */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="relative aspect-video bg-gray-100">
                {annonce.images.length > 0 ? (
                  <Image
                    src={annonce.images[imageActive]?.url || '/placeholder-bien.jpg'}
                    alt={annonce.titre}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Aucune image</div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-luxury-green text-white text-sm px-3 py-1 rounded-full">
                    {annonce.transaction === 'VENTE' ? 'À vendre' : 'À louer'}
                  </span>
                </div>
              </div>
              {annonce.images.length > 1 && (
                <div className="p-4 flex gap-3 overflow-x-auto">
                  {annonce.images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setImageActive(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${index === imageActive ? 'border-luxury-gold' : 'border-transparent'}`}
                    >
                      <Image src={img.url} alt={`Image ${index + 1}`} fill sizes="80px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Détails */}
            <div className="bg-white rounded-2xl shadow-card p-6 space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-luxury-green-dark">{annonce.titre}</h1>
                  <div className="flex gap-2">
                    <button onClick={handleToggleFavori} className="p-2 rounded-xl hover:bg-gray-100 transition">
                      <Heart size={20} className={isFavori ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                    </button>
                    <button onClick={handleShare} className="p-2 rounded-xl hover:bg-gray-100 transition">
                      <Share2 size={20} className="text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <MapPin size={18} className="text-luxury-gold" />
                  <span>{annonce.quartier}, {annonce.ville}</span>
                </div>
                <div className="text-3xl font-bold text-luxury-green mb-4">
                  {formatPrix(annonce.prix)} FCFA
                  {annonce.transaction === 'LOCATION' && <span className="text-lg font-normal text-gray-500">/mois</span>}
                </div>
                <div className="flex items-center gap-6 text-gray-600">
                  {annonce.chambres && <div className="flex items-center gap-2"><Bed size={20} /> <span>{annonce.chambres} chambres</span></div>}
                  {annonce.sallesBain && <div className="flex items-center gap-2"><Bath size={20} /> <span>{annonce.sallesBain} sdb</span></div>}
                  {annonce.surface && <div className="flex items-center gap-2"><Maximize size={20} /> <span>{annonce.surface} m²</span></div>}
                </div>
              </div>

              <div className="pt-6 border-t">
                <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-3">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{annonce.description}</p>
              </div>

              {/* Équipements */}
              <div className="pt-6 border-t">
                <h2 className="font-display text-xl font-bold text-luxury-green-dark mb-4">Équipements</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { value: annonce.meuble, label: 'Meublé' },
                    { value: annonce.climatisation, label: 'Climatisation' },
                    { value: annonce.piscine, label: 'Piscine' },
                    { value: annonce.parking, label: 'Parking' },
                    { value: annonce.wifi, label: 'WiFi' },
                    { value: annonce.groupeElectro, label: 'Groupe électrogène' },
                    { value: annonce.gardien, label: 'Gardien' },
                    { value: annonce.balcon, label: 'Balcon' },
                  ].filter(eq => eq.value).map((eq, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-600">
                      <Check size={16} className="text-luxury-green" /> <span>{eq.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Contact */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-display text-xl font-bold text-luxury-green-dark mb-4">Contacter l&apos;annonceur</h3>
              <div className="flex items-center gap-3 mb-6 p-4 bg-luxury-sand-light rounded-xl">
                <div className="w-12 h-12 bg-luxury-green rounded-full flex items-center justify-center text-white font-bold">
                  {annonce.user.prenom?.charAt(0)}{annonce.user.nom?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-luxury-green-dark">{annonce.user.prenom} {annonce.user.nom}</p>
                  <p className="text-sm text-gray-500">Annonceur</p>
                </div>
              </div>

              <div className="space-y-3">
                <a href={`tel:${annonce.user.telephone}`} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Phone size={20} /> Appeler
                </a>
                <button onClick={() => setShowContactForm(!showContactForm)} className="btn-secondary w-full flex items-center justify-center gap-2">
                  <MessageSquare size={20} /> Envoyer un message
                </button>
              </div>

              {/* Formulaire message */}
              {showContactForm && (
                <div className="mt-4 p-4 bg-luxury-sand-light rounded-xl space-y-3">
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Votre message..."
                    className="input-luxury resize-none text-sm"
                  />
                  <button onClick={handleSendMessage} disabled={isSending} className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2">
                    {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Envoyer
                  </button>
                </div>
              )}

              {/* Signaler */}
              <div className="mt-6 pt-6 border-t">
                <button onClick={() => setShowSignalForm(!showSignalForm)} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                  <Flag size={14} /> Signaler cette annonce
                </button>

                {showSignalForm && (
                  <div className="mt-3 p-4 bg-red-50 rounded-xl space-y-3">
                    <select value={signalType} onChange={(e) => setSignalType(e.target.value)} className="input-luxury text-sm">
                      <option value="CONTENU_INAPPROPRIE">Contenu inapproprié</option>
                      <option value="ARNAQUE">Arnaque</option>
                      <option value="DOUBLON">Annonce en double</option>
                      <option value="AUTRE">Autre</option>
                    </select>
                    <textarea rows={2} value={signalDescription} onChange={(e) => setSignalDescription(e.target.value)} placeholder="Description du problème..." className="input-luxury resize-none text-sm" />
                    <button onClick={handleSignaler} className="bg-red-500 text-white w-full py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition">
                      Signaler
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t text-center text-sm text-gray-400">
                <Eye size={16} className="inline mr-1" /> {annonce.vues} vues
                {annonce.datePublication && <span> • Publiée le {new Date(annonce.datePublication).toLocaleDateString('fr-FR')}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}