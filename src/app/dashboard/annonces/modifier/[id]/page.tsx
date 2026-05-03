// src/app/dashboard/annonces/modifier/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Upload, X, Save, Eye, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ModifierAnnoncePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: 'APPARTEMENT',
    transaction: 'VENTE',
    prix: '',
    ville: 'Cotonou',
    quartier: '',
    surface: '',
    chambres: '',
    sallesBain: '',
    meuble: false,
    climatisation: false,
    piscine: false,
    parking: false,
    wifi: false,
    groupeElectro: false,
    gardien: false,
    balcon: false,
    statut: 'BROUILLON',
  });
  const [images, setImages] = useState<{ id?: string; url: string; principale: boolean }[]>([]);

  // Charger l'annonce
  useEffect(() => {
    if (id) {
      fetchAnnonce();
    }
  }, [id]);

  const fetchAnnonce = async () => {
    try {
      const response = await fetch(`/api/annonces/${id}`);
      const data = await response.json();

      if (response.ok && data.annonce) {
        const a = data.annonce;
        setFormData({
          titre: a.titre || '',
          description: a.description || '',
          type: a.type || 'APPARTEMENT',
          transaction: a.transaction || 'VENTE',
          prix: a.prix?.toString() || '',
          ville: a.ville || 'Cotonou',
          quartier: a.quartier || '',
          surface: a.surface?.toString() || '',
          chambres: a.chambres?.toString() || '',
          sallesBain: a.sallesBain?.toString() || '',
          meuble: a.meuble || false,
          climatisation: a.climatisation || false,
          piscine: a.piscine || false,
          parking: a.parking || false,
          wifi: a.wifi || false,
          groupeElectro: a.groupeElectro || false,
          gardien: a.gardien || false,
          balcon: a.balcon || false,
          statut: a.statut || 'BROUILLON',
        });
        setImages(a.images || []);
      } else {
        toast.error('Annonce introuvable');
        router.push('/dashboard/annonces');
      }
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Gérer l'ajout d'images (simulation locale)
  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file, index) => ({
        url: URL.createObjectURL(file),
        principale: images.length === 0 && index === 0,
      }));
      setImages([...images, ...newImages].slice(0, 20));
    }
  };

  const handleImageRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Si on supprime l'image principale, la première devient principale
    if (images[index]?.principale && newImages.length > 0) {
      newImages[0] = { ...newImages[0], principale: true };
    }
    setImages(newImages);
  };

  const handleSetPrincipale = (index: number) => {
    setImages(images.map((img, i) => ({
      ...img,
      principale: i === index,
    })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titre || !formData.prix || !formData.description) {
      toast.error('Veuillez remplir les champs obligatoires (titre, prix, description)');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/annonces/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Annonce mise à jour avec succès !');
        router.push('/dashboard/annonces');
        router.refresh();
      } else {
        toast.error(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={40} className="text-luxury-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/annonces"
          className="p-2 rounded-xl hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-luxury-green-dark">Modifier l&apos;annonce</h2>
          <p className="text-gray-500 text-sm mt-1">
            {formData.statut === 'BROUILLON' && 'Brouillon'}
            {formData.statut === 'PUBLIEE' && 'Publiée'}
            {formData.statut === 'EN_ATTENTE' && 'En attente de validation'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Infos principales */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h3 className="font-display text-lg font-bold text-luxury-green-dark">
            Informations principales
          </h3>

          <div>
            <label className="block text-sm font-medium text-luxury-green-dark mb-2">
              Titre de l&apos;annonce *
            </label>
            <input
              type="text"
              required
              value={formData.titre}
              onChange={(e) => handleChange('titre', e.target.value)}
              className="input-luxury"
              placeholder="Ex: Villa Moderne avec Piscine - Fidjrossè"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">
                Type de bien *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="input-luxury"
              >
                <option value="APPARTEMENT">Appartement</option>
                <option value="MAISON">Maison</option>
                <option value="VILLA">Villa</option>
                <option value="STUDIO">Studio</option>
                <option value="DUPLEX">Duplex</option>
                <option value="PARCELLE">Parcelle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">
                Transaction *
              </label>
              <select
                required
                value={formData.transaction}
                onChange={(e) => handleChange('transaction', e.target.value)}
                className="input-luxury"
              >
                <option value="VENTE">Vente</option>
                <option value="LOCATION">Location</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">
                Prix (FCFA) *
              </label>
              <input
                type="number"
                required
                value={formData.prix}
                onChange={(e) => handleChange('prix', e.target.value)}
                className="input-luxury"
                placeholder="85000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">
                Surface (m²)
              </label>
              <input
                type="number"
                value={formData.surface}
                onChange={(e) => handleChange('surface', e.target.value)}
                className="input-luxury"
                placeholder="350"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">
                Chambres
              </label>
              <input
                type="number"
                value={formData.chambres}
                onChange={(e) => handleChange('chambres', e.target.value)}
                className="input-luxury"
                placeholder="4"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-luxury-green-dark mb-2">
              Description *
            </label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="input-luxury resize-none"
              placeholder="Décrivez votre bien en détail..."
            />
          </div>
        </div>

        {/* Localisation */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h3 className="font-display text-lg font-bold text-luxury-green-dark">Localisation</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">Ville *</label>
              <select
                required
                value={formData.ville}
                onChange={(e) => handleChange('ville', e.target.value)}
                className="input-luxury"
              >
                <option value="Cotonou">Cotonou</option>
                <option value="Abomey-Calavi">Abomey-Calavi</option>
                <option value="Porto-Novo">Porto-Novo</option>
                <option value="Parakou">Parakou</option>
                <option value="Natitingou">Natitingou</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">Quartier</label>
              <input
                type="text"
                value={formData.quartier}
                onChange={(e) => handleChange('quartier', e.target.value)}
                className="input-luxury"
                placeholder="Fidjrossè"
              />
            </div>
          </div>
        </div>

        {/* Équipements */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h3 className="font-display text-lg font-bold text-luxury-green-dark">Équipements</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'meuble', label: '🛋️ Meublé' },
              { key: 'climatisation', label: '❄️ Climatisation' },
              { key: 'piscine', label: '🏊 Piscine' },
              { key: 'parking', label: '🚗 Parking' },
              { key: 'wifi', label: '📶 WiFi' },
              { key: 'groupeElectro', label: '⚡ Groupe électro' },
              { key: 'gardien', label: '👮 Gardien' },
              { key: 'balcon', label: '🌅 Balcon' },
            ].map((eq) => (
              <label
                key={eq.key}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                  formData[eq.key as keyof typeof formData]
                    ? 'border-luxury-green bg-luxury-green/5'
                    : 'border-gray-200 hover:border-luxury-green/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={Boolean(formData[eq.key as keyof typeof formData])}
                  onChange={(e) => handleChange(eq.key, e.target.checked)}
                  className="w-4 h-4 text-luxury-green rounded"
                />
                <span className="text-sm font-medium">{eq.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h3 className="font-display text-lg font-bold text-luxury-green-dark">
            Photos <span className="text-sm font-normal text-gray-400">({images.length}/20)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                <img src={img.url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={14} />
                </button>
                {img.principale && (
                  <span className="absolute bottom-2 left-2 bg-luxury-green text-white text-xs px-2 py-1 rounded-full">
                    Principale
                  </span>
                )}
                {!img.principale && (
                  <button
                    type="button"
                    onClick={() => handleSetPrincipale(index)}
                    className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    Définir principale
                  </button>
                )}
              </div>
            ))}

            {images.length < 20 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-luxury-green hover:bg-luxury-green/5 transition">
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Ajouter</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageAdd}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Statut */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h3 className="font-display text-lg font-bold text-luxury-green-dark">État de l&apos;annonce</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { value: 'BROUILLON', label: '💾 Brouillon', desc: 'Enregistrer sans publier' },
              { value: 'EN_ATTENTE', label: '⏳ En attente', desc: 'Soumettre pour validation' },
            ].map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => handleChange('statut', s.value)}
                className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 text-left transition ${
                  formData.statut === s.value
                    ? 'border-luxury-green bg-luxury-green/5'
                    : 'border-gray-200 hover:border-luxury-green/30'
                }`}
              >
                <span className="block font-semibold text-luxury-green-dark">{s.label}</span>
                <span className="text-xs text-gray-500">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Link href="/dashboard/annonces" className="btn-secondary">
            Annuler
          </Link>
          <Link
            href={`/bien/${id}`}
            target="_blank"
            className="btn-secondary flex items-center gap-2"
          >
            <Eye size={20} /> Prévisualiser
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}