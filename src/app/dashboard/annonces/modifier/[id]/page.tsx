// src/app/dashboard/annonces/modifier/[id]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Upload, X, Save, Eye, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface ImageItem {
  id?: string;
  url: string;
  publicId?: string;
  principale: boolean;
  isNew?: boolean;
}

export default function ModifierAnnoncePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

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
  const [existingImages, setExistingImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    if (id) fetchAnnonce();
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
        setExistingImages(
          (a.images || []).map((img: any) => ({
            id: img.id,
            url: img.url,
            publicId: img.publicId,
            principale: img.principale,
            isNew: false,
          }))
        );
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

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setNewImageFiles(prev => [...prev, ...newFiles]);
      setNewImagePreviews(prev => [...prev, ...newPreviews]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (prev[index]?.principale && newImages.length > 0) {
        newImages[0] = { ...newImages[0], principale: true };
      }
      return newImages;
    });
  };

  const handleSetPrincipaleExisting = (index: number) => {
    setExistingImages(prev => prev.map((img, i) => ({ ...img, principale: i === index })));
  };

  const uploadNewImages = async (): Promise<{ url: string; publicId: string }[]> => {
    if (newImageFiles.length === 0) return [];
    const uploadFormData = new FormData();
    newImageFiles.forEach(file => uploadFormData.append('images', file));
    const response = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Erreur upload");
    return data.images;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titre || !formData.prix || !formData.description) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    const totalImages = existingImages.length + newImageFiles.length;
    if (totalImages === 0) {
      toast.error('Ajoutez au moins une image');
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading('Mise à jour en cours...');
    try {
      let uploadedImages: { url: string; publicId: string }[] = [];
      if (newImageFiles.length > 0) uploadedImages = await uploadNewImages();

      const allImages = [
        ...existingImages.map((img, idx) => ({
          url: img.url, publicId: img.publicId,
          principale: newImageFiles.length === 0 ? img.principale : false, ordre: idx,
        })),
        ...uploadedImages.map((img, idx) => ({
          url: img.url, publicId: img.publicId,
          principale: existingImages.length === 0 ? idx === 0 : false,
          ordre: existingImages.length + idx,
        })),
      ];
      if (!allImages.some(img => img.principale) && allImages.length > 0) {
        allImages[0].principale = true;
      }

      const response = await fetch(`/api/annonces/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, images: allImages }),
      });
      const data = await response.json();
      if (response.ok) {
        newImagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        toast.success('Annonce mise à jour !', { id: toastId });
        router.push('/dashboard/annonces');
        router.refresh();
      } else {
        toast.error(data.error || 'Erreur', { id: toastId });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur', { id: toastId });
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/annonces" className="p-2 rounded-xl hover:bg-gray-100 transition flex-shrink-0">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-luxury-green-dark truncate">Modifier l&apos;annonce</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            {formData.statut === 'BROUILLON' && 'Brouillon'}
            {formData.statut === 'PUBLIEE' && 'Publiée'}
            {formData.statut === 'EN_ATTENTE' && 'En attente'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Infos principales */}
        <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6 space-y-4 sm:space-y-5">
          <h3 className="font-display text-base sm:text-lg font-bold text-luxury-green-dark">Informations principales</h3>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-luxury-green-dark mb-1.5">Titre *</label>
            <input type="text" required value={formData.titre} onChange={(e) => handleChange('titre', e.target.value)} className="input-luxury text-sm" placeholder="Ex: Villa Moderne - Fidjrossè" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-luxury-green-dark mb-1.5">Type *</label>
              <select required value={formData.type} onChange={(e) => handleChange('type', e.target.value)} className="input-luxury text-sm">
                <option value="APPARTEMENT">Appartement</option><option value="MAISON">Maison</option><option value="VILLA">Villa</option><option value="STUDIO">Studio</option><option value="DUPLEX">Duplex</option><option value="PARCELLE">Parcelle</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-luxury-green-dark mb-1.5">Transaction *</label>
              <select required value={formData.transaction} onChange={(e) => handleChange('transaction', e.target.value)} className="input-luxury text-sm">
                <option value="VENTE">Vente</option><option value="LOCATION">Location</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-luxury-green-dark mb-1.5">Prix (FCFA) *</label>
              <input type="number" required value={formData.prix} onChange={(e) => handleChange('prix', e.target.value)} className="input-luxury text-sm" placeholder="85000000" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-luxury-green-dark mb-1.5">Surface (m²)</label>
              <input type="number" value={formData.surface} onChange={(e) => handleChange('surface', e.target.value)} className="input-luxury text-sm" placeholder="350" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs sm:text-sm font-medium text-luxury-green-dark mb-1.5">Chambres</label>
              <input type="number" value={formData.chambres} onChange={(e) => handleChange('chambres', e.target.value)} className="input-luxury text-sm" placeholder="4" />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-luxury-green-dark mb-1.5">Description *</label>
            <textarea required rows={4} value={formData.description} onChange={(e) => handleChange('description', e.target.value)} className="input-luxury resize-none text-sm" placeholder="Décrivez votre bien..." />
          </div>
        </div>

        {/* Localisation */}
        <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6 space-y-4">
          <h3 className="font-display text-base sm:text-lg font-bold text-luxury-green-dark">Localisation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-luxury-green-dark mb-1.5">Ville *</label>
              <select required value={formData.ville} onChange={(e) => handleChange('ville', e.target.value)} className="input-luxury text-sm">
                <option value="Cotonou">Cotonou</option><option value="Abomey-Calavi">Abomey-Calavi</option><option value="Porto-Novo">Porto-Novo</option><option value="Parakou">Parakou</option><option value="Natitingou">Natitingou</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-luxury-green-dark mb-1.5">Quartier</label>
              <input type="text" value={formData.quartier} onChange={(e) => handleChange('quartier', e.target.value)} className="input-luxury text-sm" placeholder="Fidjrossè" />
            </div>
          </div>
        </div>

        {/* Équipements */}
        <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6 space-y-4">
          <h3 className="font-display text-base sm:text-lg font-bold text-luxury-green-dark">Équipements</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[
              { key: 'meuble', label: '🛋️ Meublé' },{ key: 'climatisation', label: '❄️ Clim' },{ key: 'piscine', label: '🏊 Piscine' },{ key: 'parking', label: '🚗 Parking' },
              { key: 'wifi', label: '📶 WiFi' },{ key: 'groupeElectro', label: '⚡ Groupe' },{ key: 'gardien', label: '👮 Gardien' },{ key: 'balcon', label: '🌅 Balcon' },
            ].map((eq) => (
              <label key={eq.key} className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border-2 cursor-pointer transition text-xs sm:text-sm ${formData[eq.key as keyof typeof formData] ? 'border-luxury-green bg-luxury-green/5' : 'border-gray-200 hover:border-luxury-green/30'}`}>
                <input type="checkbox" checked={Boolean(formData[eq.key as keyof typeof formData])} onChange={(e) => handleChange(eq.key, e.target.checked)} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-luxury-green rounded" />
                <span className="font-medium truncate">{eq.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6 space-y-4">
          <h3 className="font-display text-base sm:text-lg font-bold text-luxury-green-dark">
            Photos <span className="text-sm font-normal text-gray-400">({existingImages.length + newImagePreviews.length}/20)</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {existingImages.map((img, index) => (
              <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                <img src={img.url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => handleRemoveExistingImage(index)} className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"><X size={12} /></button>
                {img.principale && <span className="absolute bottom-1.5 left-1.5 bg-luxury-green text-white text-[10px] px-1.5 py-0.5 rounded-full">Principale</span>}
                {!img.principale && (
                  <button type="button" onClick={() => handleSetPrincipaleExisting(index)} className="absolute bottom-1.5 left-1.5 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition">Principale</button>
                )}
              </div>
            ))}
            {newImagePreviews.map((preview, index) => (
              <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                <img src={preview} alt={`Nouvelle ${index + 1}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => handleRemoveNewImage(index)} className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"><X size={12} /></button>
                <span className="absolute bottom-1.5 left-1.5 bg-luxury-gold text-white text-[10px] px-1.5 py-0.5 rounded-full">Nouvelle</span>
              </div>
            ))}
            {existingImages.length + newImagePreviews.length < 20 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-luxury-green hover:bg-luxury-green/5 transition">
                <Upload size={20} className="sm:size-[22px] text-gray-400 mb-1" />
                <span className="text-xs sm:text-sm text-gray-500">Ajouter</span>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={handleImageAdd} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Statut */}
        <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6 space-y-4">
          <h3 className="font-display text-base sm:text-lg font-bold text-luxury-green-dark">État de l&apos;annonce</h3>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {[
              { value: 'BROUILLON', label: '💾 Brouillon', desc: 'Enregistrer sans publier' },
              { value: 'EN_ATTENTE', label: '⏳ En attente', desc: 'Soumettre pour validation' },
            ].map((s) => (
              <button key={s.value} type="button" onClick={() => handleChange('statut', s.value)} className={`flex-1 p-3 sm:p-4 rounded-xl border-2 text-left transition ${formData.statut === s.value ? 'border-luxury-green bg-luxury-green/5' : 'border-gray-200 hover:border-luxury-green/30'}`}>
                <span className="block font-semibold text-luxury-green-dark text-sm">{s.label}</span>
                <span className="text-xs text-gray-500">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
          <Link href="/dashboard/annonces" className="btn-secondary text-center text-sm order-3 sm:order-1">Annuler</Link>
          <Link href={`/bien/${id}`} target="_blank" className="btn-secondary flex items-center justify-center gap-2 text-sm order-2">
            <Eye size={18} /> Prévisualiser
          </Link>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center justify-center gap-2 text-sm order-1 sm:order-3 disabled:opacity-50">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}