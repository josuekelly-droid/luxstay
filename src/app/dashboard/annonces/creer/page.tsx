// src/app/dashboard/annonces/creer/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const VILLES: Record<string, string[]> = {
  'Cotonou': ['Fidjrossè', 'Haie Vive', 'Zongo', 'Jonquet', 'Les Cocotiers', 'Saint-Jean', 'Ganhi', 'Akpakpa', 'Gbegamey'],
  'Abomey-Calavi': ['Agori', 'Zopah', 'Fifadji', 'Tokpa-Zoungo', 'Godomey'],
  'Porto-Novo': ['Djassin', 'Ouando', 'Tokpota', 'Akindin'],
  'Parakou': ['Titirou', 'Kpébié', 'Banikanni', 'Ganou'],
  'Natitingou': ['Centre-Ville', 'Perma', 'Yokossi'],
  'Djougou': ['Centre-Ville', 'Kilmakou', 'Baria'],
  'Bohicon': ['Centre-Ville', 'Ahouamè', 'Sodohomè'],
  'Abomey': ['Centre-Ville', 'Hountondji', 'Zongo'],
  'Lokossa': ['Centre-Ville', 'Agamé', 'Koudo'],
  'Ouidah': ['Centre-Ville', 'Zomaï', 'Gbéna'],
  'Grand-Popo': ['Centre-Ville', 'Agoué', 'Hilla-Condji'],
  'Kandi': ['Centre-Ville', 'Kéféri', 'Sonsoro'],
  'Malanville': ['Centre-Ville', 'Gaya', 'Bodjécali'],
  'Dassa-Zoumè': ['Centre-Ville', 'Gankpétin', 'Sokouhoué'],
  'Savalou': ['Centre-Ville', 'Agbado', 'Zaffé'],
  'Allada': ['Centre-Ville', 'Sékou', 'Atokou'],
  'Sèmè-Kpodji': ['Centre-Ville', 'Djèrègbé', 'Tohouè'],
};

export default function CreerAnnoncePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quartierLibre, setQuartierLibre] = useState(false);
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
    contactTelephone: '',
    contactEmail: '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Réinitialiser le quartier si la ville change
  useEffect(() => {
    setFormData(prev => ({ ...prev, quartier: '' }));
    setQuartierLibre(false);
  }, [formData.ville]);

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImageFiles(prev => [...prev, ...newFiles].slice(0, 20));
      setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 20));
    }
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titre || !formData.prix || !formData.description) {
      toast.error('Veuillez remplir les champs obligatoires (titre, prix, description)');
      return;
    }

    if (imageFiles.length === 0) {
      toast.error('Ajoutez au moins une photo');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Publication en cours...');

    try {
      const uploadFormData = new FormData();
      imageFiles.forEach(file => uploadFormData.append('images', file));

      const uploadResponse = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) throw new Error(uploadData.error || "Erreur lors de l'upload des images");

      const annonceData = {
        titre: formData.titre,
        description: formData.description,
        type: formData.type,
        transaction: formData.transaction,
        prix: parseFloat(formData.prix),
        ville: formData.ville,
        quartier: formData.quartier || '',
        surface: formData.surface ? parseFloat(formData.surface) : null,
        chambres: formData.chambres ? parseInt(formData.chambres) : null,
        sallesBain: formData.sallesBain ? parseInt(formData.sallesBain) : null,
        meuble: formData.meuble,
        climatisation: formData.climatisation,
        piscine: formData.piscine,
        parking: formData.parking,
        wifi: formData.wifi,
        groupeElectro: formData.groupeElectro,
        gardien: formData.gardien,
        balcon: formData.balcon,
        contactTelephone: formData.contactTelephone,
        contactEmail: formData.contactEmail,
        images: uploadData.images,
      };

      const annonceResponse = await fetch('/api/annonces/creer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(annonceData),
      });
      const annonceResult = await annonceResponse.json();

      if (!annonceResponse.ok) throw new Error(annonceResult.error || "Erreur lors de la création de l'annonce");

      toast.success('Annonce publiée avec succès !', { id: toastId });
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      router.push('/dashboard/annonces');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la publication', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const quartiers = VILLES[formData.ville] || [];
  const villesNoms = Object.keys(VILLES);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-luxury-green-dark">Publier une annonce</h2>
        <p className="text-gray-500 text-sm mt-1">Remplissez les informations de votre bien</p>
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
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">Type de bien *</label>
              <select required value={formData.type} onChange={(e) => handleChange('type', e.target.value)} className="input-luxury">
                <option value="APPARTEMENT">Appartement</option>
                <option value="MAISON">Maison</option>
                <option value="VILLA">Villa</option>
                <option value="STUDIO">Studio</option>
                <option value="DUPLEX">Duplex</option>
                <option value="PARCELLE">Parcelle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">Transaction *</label>
              <select required value={formData.transaction} onChange={(e) => handleChange('transaction', e.target.value)} className="input-luxury">
                <option value="VENTE">Vente</option>
                <option value="LOCATION">Location</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">Prix (FCFA) *</label>
              <input type="number" required value={formData.prix} onChange={(e) => handleChange('prix', e.target.value)} className="input-luxury" placeholder="85000000" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">Surface (m²)</label>
              <input type="number" value={formData.surface} onChange={(e) => handleChange('surface', e.target.value)} className="input-luxury" placeholder="350" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">Chambres</label>
              <input type="number" value={formData.chambres} onChange={(e) => handleChange('chambres', e.target.value)} className="input-luxury" placeholder="4" min="0" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-luxury-green-dark mb-2">Salles de bain</label>
            <input type="number" value={formData.sallesBain} onChange={(e) => handleChange('sallesBain', e.target.value)} className="input-luxury" placeholder="2" min="0" />
          </div>

          <div>
            <label className="block text-sm font-medium text-luxury-green-dark mb-2">Description *</label>
            <textarea required rows={5} value={formData.description} onChange={(e) => handleChange('description', e.target.value)} className="input-luxury resize-none" placeholder="Décrivez votre bien en détail..." />
          </div>
        </div>

        {/* Contact annonceur */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h3 className="font-display text-lg font-bold text-luxury-green-dark">
            Vos contacts <span className="text-sm font-normal text-gray-400">(visible par les acheteurs)</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">Téléphone</label>
              <input type="tel" value={formData.contactTelephone} onChange={(e) => handleChange('contactTelephone', e.target.value)} className="input-luxury" placeholder="+229 97 00 00 00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">Email</label>
              <input type="email" value={formData.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} className="input-luxury" placeholder="votre@email.com" />
            </div>
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
                {villesNoms.map(ville => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">Quartier</label>
              {!quartierLibre ? (
                <div className="space-y-2">
                  <select
                    value={formData.quartier}
                    onChange={(e) => handleChange('quartier', e.target.value)}
                    className="input-luxury"
                  >
                    <option value="">Sélectionner un quartier</option>
                    {quartiers.map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setQuartierLibre(true);
                      setFormData(prev => ({ ...prev, quartier: '' }));
                    }}
                    className="text-xs text-luxury-green hover:underline"
                  >
                    Mon quartier n&apos;est pas dans la liste
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.quartier}
                    onChange={(e) => handleChange('quartier', e.target.value)}
                    className="input-luxury"
                    placeholder="Entrez votre quartier"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setQuartierLibre(false);
                      setFormData(prev => ({ ...prev, quartier: '' }));
                    }}
                    className="text-xs text-luxury-green hover:underline"
                  >
                    Choisir dans la liste
                  </button>
                </div>
              )}
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

        {/* Photos */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h3 className="font-display text-lg font-bold text-luxury-green-dark">
            Photos <span className="text-sm font-normal text-gray-400">({imagePreviews.length}/20)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                <img src={preview} alt={`Aperçu ${index + 1}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition">
                  <X size={14} />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 bg-luxury-green text-white text-xs px-2 py-1 rounded-full">Principale</span>
                )}
              </div>
            ))}

            {imagePreviews.length < 20 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-luxury-green hover:bg-luxury-green/5 transition">
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Ajouter</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={handleImageAdd} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-4 justify-end">
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Annuler
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {isSubmitting ? 'Publication...' : "Publier l'annonce"}
          </button>
        </div>
      </form>
    </div>
  );
}