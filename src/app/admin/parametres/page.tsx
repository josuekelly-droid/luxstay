// src/app/admin/parametres/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Loader2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function AdminParametresPage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [config, setConfig] = useState({
    fraisService: '0',
    annoncesGratuites: '5',
    photosParAnnonce: '5',
    dureeValidation: '48',
    emailContact: 'contact@luxstay.bj',
    telephone: '+229 97 00 00 00',
    maintenance: false,
  });

  const [profil, setProfil] = useState({
    nom: '',
    prenom: '',
    email: '',
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  useEffect(() => {
    fetchConfig();
    if (session?.user) {
      setProfil({
        nom: (session.user as any).nom || '',
        prenom: (session.user as any).prenom || '',
        email: session.user.email || '',
      });
    }
    setIsLoading(false);
  }, [session]);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/config');
      const data = await response.json();
      if (response.ok && data.configs) {
        const newConfig: any = {};
        data.configs.forEach((c: any) => {
          if (c.cle === 'maintenance') newConfig[c.cle] = c.valeur === 'true';
          else newConfig[c.cle] = c.valeur;
        });
        setConfig(prev => ({ ...prev, ...newConfig }));
      }
    } catch (error) {}
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (response.ok) {
        toast.success('Paramètres enregistrés');
      } else {
        toast.error('Erreur');
      }
    } catch (error) {
      toast.error('Erreur');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfil = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profil),
      });
      const data = await response.json();
      if (response.ok) {
        await update({
          ...session,
          user: { ...session?.user, nom: profil.nom, prenom: profil.prenom, email: profil.email },
        });
        toast.success('Profil mis à jour');
      } else {
        toast.error(data.error || 'Erreur');
      }
    } catch (error) {
      toast.error('Erreur');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (password.new !== password.confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.new.length < 6) {
      toast.error('Minimum 6 caractères');
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: password.current,
          newPassword: password.new,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Mot de passe changé');
        setPassword({ current: '', new: '', confirm: '' });
      } else {
        toast.error(data.error || 'Erreur');
      }
    } catch (error) {
      toast.error('Erreur');
    } finally {
      setIsSaving(false);
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-luxury-green-dark">Paramètres</h2>
        <p className="text-gray-500 text-sm mt-1">Configuration de la plateforme</p>
      </div>

      {/* Profil Admin */}
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h3 className="font-display text-lg font-bold text-luxury-green-dark flex items-center gap-2">
          <User size={20} /> Profil administrateur
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Prénom</label>
            <input type="text" value={profil.prenom} onChange={(e) => setProfil({...profil, prenom: e.target.value})} className="input-luxury" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nom</label>
            <input type="text" value={profil.nom} onChange={(e) => setProfil({...profil, nom: e.target.value})} className="input-luxury" />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-1 block flex items-center gap-1"><Mail size={14} /> Email</label>
          <input type="email" value={profil.email} onChange={(e) => setProfil({...profil, email: e.target.value})} className="input-luxury" />
        </div>
        <button onClick={handleSaveProfil} disabled={isSaving} className="btn-primary flex items-center gap-2">
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Mettre à jour le profil
        </button>
      </div>

      {/* Changer mot de passe */}
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h3 className="font-display text-lg font-bold text-luxury-green-dark flex items-center gap-2">
          <Lock size={20} /> Changer le mot de passe
        </h3>
        <div className="space-y-4">
          <div className="relative">
            <label className="text-sm text-gray-600 mb-1 block">Mot de passe actuel</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password.current} onChange={(e) => setPassword({...password, current: e.target.value})} className="input-luxury pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-sm text-gray-600 mb-1 block">Nouveau mot de passe</label>
              <div className="relative">
                <input type={showNewPassword ? 'text' : 'password'} value={password.new} onChange={(e) => setPassword({...password, new: e.target.value})} className="input-luxury pr-10" />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Confirmer</label>
              <input type={showNewPassword ? 'text' : 'password'} value={password.confirm} onChange={(e) => setPassword({...password, confirm: e.target.value})} className="input-luxury" />
            </div>
          </div>
        </div>
        <button onClick={handleChangePassword} disabled={isSaving} className="btn-primary flex items-center gap-2">
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
          Changer le mot de passe
        </button>
      </div>

      {/* Configuration plateforme */}
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h3 className="font-display text-lg font-bold text-luxury-green-dark flex items-center gap-2">
          <Settings size={20} /> Configuration plateforme
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Frais de service (%)</label>
            <input type="number" value={config.fraisService} onChange={(e) => setConfig({...config, fraisService: e.target.value})} className="input-luxury" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Annonces gratuites</label>
            <input type="number" value={config.annoncesGratuites} onChange={(e) => setConfig({...config, annoncesGratuites: e.target.value})} className="input-luxury" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Photos par annonce (gratuit)</label>
            <input type="number" value={config.photosParAnnonce} onChange={(e) => setConfig({...config, photosParAnnonce: e.target.value})} className="input-luxury" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Délai validation (heures)</label>
            <input type="number" value={config.dureeValidation} onChange={(e) => setConfig({...config, dureeValidation: e.target.value})} className="input-luxury" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email contact</label>
            <input type="email" value={config.emailContact} onChange={(e) => setConfig({...config, emailContact: e.target.value})} className="input-luxury" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Téléphone</label>
            <input type="tel" value={config.telephone} onChange={(e) => setConfig({...config, telephone: e.target.value})} className="input-luxury" />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={config.maintenance} onChange={(e) => setConfig({...config, maintenance: e.target.checked})} className="w-5 h-5 text-luxury-green rounded" />
          <span className="text-sm">Mode maintenance</span>
        </label>

        <button onClick={handleSaveConfig} disabled={isSaving} className="btn-primary flex items-center gap-2">
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Enregistrer la configuration
        </button>
      </div>
    </div>
  );
}