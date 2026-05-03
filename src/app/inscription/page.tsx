// src/app/inscription/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, UserPlus, Mail, Lock, User, Phone, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InscriptionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erreur lors de l'inscription");
      } else {
        toast.success('Inscription réussie ! Vous pouvez vous connecter.');
        router.push('/connexion');
      }
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-16 flex items-start justify-center bg-luxury-sand-light px-4">
      <div className="max-w-md w-full mt-8 sm:mt-12">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold">
            <span className="text-luxury-gold">LUX</span>
            <span className="text-luxury-green">STAY</span>
          </Link>
          <p className="text-gray-600 mt-2">Créez votre compte gratuitement</p>
        </div>

        <div className="bg-white rounded-2xl shadow-luxury p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Choix du type de compte */}
            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-3">
                Type de compte
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'USER' })}
                  className={`p-4 rounded-xl border-2 text-center transition ${
                    formData.role === 'USER'
                      ? 'border-luxury-green bg-luxury-green/5'
                      : 'border-gray-200 hover:border-luxury-green/30'
                  }`}
                >
                  <User size={24} className={`mx-auto mb-2 ${formData.role === 'USER' ? 'text-luxury-green' : 'text-gray-400'}`} />
                  <span className={`text-sm font-semibold ${formData.role === 'USER' ? 'text-luxury-green' : 'text-gray-600'}`}>
                    Acheteur
                  </span>
                  <p className="text-xs text-gray-400 mt-1">Recherche des biens</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'ANNOUNCER' })}
                  className={`p-4 rounded-xl border-2 text-center transition ${
                    formData.role === 'ANNOUNCER'
                      ? 'border-luxury-gold bg-luxury-gold/5'
                      : 'border-gray-200 hover:border-luxury-gold/30'
                  }`}
                >
                  <Briefcase size={24} className={`mx-auto mb-2 ${formData.role === 'ANNOUNCER' ? 'text-luxury-gold' : 'text-gray-400'}`} />
                  <span className={`text-sm font-semibold ${formData.role === 'ANNOUNCER' ? 'text-luxury-gold-dark' : 'text-gray-600'}`}>
                    Annonceur
                  </span>
                  <p className="text-xs text-gray-400 mt-1">Publie des annonces</p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-luxury-green-dark mb-2">Nom</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" required value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} className="input-luxury pl-9" placeholder="Dupont" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-green-dark mb-2">Prénom</label>
                <input type="text" required value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} className="input-luxury" placeholder="Jean" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">Adresse email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-luxury pl-9" placeholder="votre@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">Téléphone</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} className="input-luxury pl-9" placeholder="+229 97 00 00 00" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">Mot de passe</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-luxury pl-9 pr-10" placeholder="Minimum 6 caractères" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-luxury-green-dark mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="input-luxury pl-9" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <UserPlus size={20} />}
              {isLoading ? 'Inscription...' : "S'inscrire"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link href="/connexion" className="text-luxury-green font-semibold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </main>
  );
}