// src/app/dashboard/profil/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilPage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
  });
  const [originalData, setOriginalData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
  });

  // Charger les données du profil depuis l'API
  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const response = await fetch('/api/user/profil');
        const data = await response.json();
        
        if (data.user) {
          const userData = {
            nom: data.user.nom || '',
            prenom: data.user.prenom || '',
            email: data.user.email || '',
            telephone: data.user.telephone || '',
          };
          setFormData(userData);
          setOriginalData(userData);
        }
      } catch (error) {
        toast.error('Erreur lors du chargement du profil');
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfil();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges) {
      toast.error('Aucune modification détectée');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/user/profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Erreur lors de la mise à jour');
        return;
      }

      // Mettre à jour la session avec les nouvelles données
      await update({
        ...session,
        user: {
          ...session?.user,
          nom: data.user.nom,
          prenom: data.user.prenom,
          email: data.user.email,
          telephone: data.user.telephone,
        },
      });

      setOriginalData(formData);
      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-luxury-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-luxury-green-dark">Mon profil</h2>
        {hasChanges && (
          <span className="text-sm text-luxury-gold-dark bg-luxury-gold/10 px-3 py-1 rounded-full">
            Modifications en cours
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
        {/* Avatar */}
        <div className="flex flex-col items-center pb-8 border-b border-luxury-sand/30 mb-6">
          <div className="relative group cursor-pointer">
            <div className="w-20 h-20 bg-luxury-green rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {formData.prenom?.charAt(0) || '?'}
              {formData.nom?.charAt(0) || '?'}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-luxury-green-dark mt-4">
            {formData.prenom} {formData.nom}
          </h3>
          <p className="text-sm text-gray-500">{formData.email}</p>
          <span className="text-xs bg-luxury-green/10 text-luxury-green px-3 py-1 rounded-full mt-2">
            {(session?.user as any)?.role === 'ADMIN' ? 'Administrateur' : 
             (session?.user as any)?.role === 'ANNOUNCER' ? 'Annonceur' : 'Acheteur'}
          </span>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">
                <User size={16} className="inline mr-2" />
                Prénom
              </label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => handleChange('prenom', e.target.value)}
                className="input-luxury"
                placeholder="Votre prénom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">
                <User size={16} className="inline mr-2" />
                Nom
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                className="input-luxury"
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-luxury-green-dark mb-2">
              <Mail size={16} className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="input-luxury"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-luxury-green-dark mb-2">
              <Phone size={16} className="inline mr-2" />
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => handleChange('telephone', e.target.value)}
              className="input-luxury"
              placeholder="+229 97 00 00 00"
            />
          </div>

          {/* Sécurité */}
          <div className="pt-6 border-t border-luxury-sand/30">
            <h4 className="font-semibold text-luxury-green-dark mb-4">Changer le mot de passe</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                className="input-luxury"
              />
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                className="input-luxury"
              />
            </div>
          </div>

          {/* Bouton */}
          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !hasChanges}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={20} />
              )}
              {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>

            {hasChanges && (
              <button
                type="button"
                onClick={() => {
                  setFormData(originalData);
                  toast.success('Modifications annulées');
                }}
                className="btn-secondary"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}