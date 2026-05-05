// src/app/donner-avis/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Send, Loader2, ArrowLeft, MessageSquareHeart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DonnerAvisPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [etoiles, setEtoiles] = useState(0);
  const [hoverEtoiles, setHoverEtoiles] = useState(0);
  const [formData, setFormData] = useState({
    nom: '',
    role: 'Acheteur',
    commentaire: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (etoiles === 0) {
      toast.error('Veuillez donner une note');
      return;
    }

    if (!formData.commentaire.trim()) {
      toast.error('Veuillez écrire un commentaire');
      return;
    }

    if (!formData.nom.trim()) {
      toast.error('Veuillez entrer votre nom');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/avis/donner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.nom,
          role: formData.role,
          commentaire: formData.commentaire,
          etoiles,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Merci pour votre avis ! Il sera publié après validation.');
        setFormData({ nom: '', role: 'Acheteur', commentaire: '' });
        setEtoiles(0);
        setTimeout(() => router.push('/'), 2000);
      } else {
        toast.error(data.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 sm:pt-32 pb-16 bg-luxury-sand-light">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-luxury-green mb-8 transition">
          <ArrowLeft size={16} /> Retour à l&apos;accueil
        </Link>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-luxury-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
            <MessageSquareHeart size={32} className="text-luxury-gold" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-luxury-green-dark mb-3">
            Donnez votre avis
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Partagez votre expérience avec LuxStay. Votre avis sera visible après validation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-luxury p-6 sm:p-8 space-y-6">
          {/* Étoiles */}
          <div className="text-center">
            <label className="block text-sm font-medium text-luxury-green-dark mb-3">
              Votre note
            </label>
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setEtoiles(star)}
                  onMouseEnter={() => setHoverEtoiles(star)}
                  onMouseLeave={() => setHoverEtoiles(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    className={`transition-colors ${
                      (hoverEtoiles || etoiles) >= star
                        ? 'text-luxury-gold fill-luxury-gold'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {etoiles > 0 && (
              <p className="text-sm text-luxury-gold-dark mt-2 font-medium animate-bounce">
                {etoiles === 5 ? 'Excellent ! 🌟' : etoiles === 4 ? 'Très bien !' : etoiles === 3 ? 'Bien' : etoiles === 2 ? 'Peut mieux faire' : 'À améliorer'}
              </p>
            )}
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-luxury-green-dark mb-2">
              Votre nom *
            </label>
            <input
              type="text"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="input-luxury"
              placeholder="Ex: Marie S."
            />
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-sm font-medium text-luxury-green-dark mb-2">
              Vous êtes *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Acheteur', 'Annonceur'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition ${
                    formData.role === role
                      ? 'border-luxury-green bg-luxury-green/5 text-luxury-green'
                      : 'border-gray-200 text-gray-600 hover:border-luxury-green/30'
                  }`}
                >
                  {role === 'Acheteur' ? '🏠 Acheteur' : '📢 Annonceur'}
                </button>
              ))}
            </div>
          </div>

          {/* Commentaire */}
          <div>
            <label className="block text-sm font-medium text-luxury-green-dark mb-2">
              Votre avis *
            </label>
            <textarea
              required
              rows={4}
              value={formData.commentaire}
              onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
              className="input-luxury resize-none"
              placeholder="Partagez votre expérience avec LuxStay..."
              maxLength={500}
            />
            <p className="text-xs text-gray-400 mt-1">{formData.commentaire.length}/500</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
            {isLoading ? 'Envoi...' : 'Envoyer mon avis'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Votre avis sera examiné par notre équipe avant d&apos;être publié.
          </p>
        </form>
      </div>
    </main>
  );
}