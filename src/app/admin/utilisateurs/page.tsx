// src/app/admin/utilisateurs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Ban, CheckCircle, Mail, MoreVertical, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  bloque: boolean;
  emailVerifie: boolean;
  dateInscription: string;
  _count: {
    annonces: number;
  };
}

export default function AdminUtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [filtreRole, setFiltreRole] = useState('tous');

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      const response = await fetch('/api/admin/utilisateurs');
      const data = await response.json();
      if (response.ok) {
        setUtilisateurs(data.utilisateurs);
      }
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBloquer = async (id: string, bloque: boolean) => {
    try {
      const response = await fetch(`/api/admin/utilisateurs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bloque: !bloque }),
      });

      if (response.ok) {
        setUtilisateurs(prev =>
          prev.map(u => u.id === id ? { ...u, bloque: !bloque } : u)
        );
        toast.success(bloque ? 'Utilisateur débloqué' : 'Utilisateur bloqué');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const utilisateursFiltres = utilisateurs
    .filter(u => {
      const searchLower = recherche.toLowerCase();
      return (
        u.nom.toLowerCase().includes(searchLower) ||
        u.prenom.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      );
    })
    .filter(u => filtreRole === 'tous' || u.role === filtreRole);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={40} className="text-luxury-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-luxury-green-dark">Utilisateurs</h2>
        <p className="text-gray-500 text-sm mt-1">{utilisateurs.length} utilisateurs inscrits</p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl shadow-card p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="input-luxury pl-10"
          />
        </div>
        <select
          value={filtreRole}
          onChange={(e) => setFiltreRole(e.target.value)}
          className="input-luxury w-auto"
        >
          <option value="tous">Tous les rôles</option>
          <option value="USER">Utilisateur</option>
          <option value="ANNOUNCER">Annonceur</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-luxury-sand-light text-left">
                <th className="p-4 text-sm font-semibold text-luxury-green-dark">Utilisateur</th>
                <th className="p-4 text-sm font-semibold text-luxury-green-dark">Rôle</th>
                <th className="p-4 text-sm font-semibold text-luxury-green-dark">Statut</th>
                <th className="p-4 text-sm font-semibold text-luxury-green-dark">Annonces</th>
                <th className="p-4 text-sm font-semibold text-luxury-green-dark">Inscription</th>
                <th className="p-4 text-sm font-semibold text-luxury-green-dark">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {utilisateursFiltres.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-luxury-green rounded-full flex items-center justify-center text-white font-bold">
                        {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-luxury-green-dark">
                          {user.prenom} {user.nom}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Mail size={12} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'ANNOUNCER' ? 'bg-luxury-gold/20 text-luxury-gold-dark' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.bloque ? (
                      <span className="text-xs text-red-600 flex items-center gap-1">
                        <Ban size={14} /> Bloqué
                      </span>
                    ) : (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle size={14} /> Actif
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600">{user._count.annonces}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(user.dateInscription).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleBloquer(user.id, user.bloque)}
                      className={`p-2 rounded-lg transition text-sm font-medium ${
                        user.bloque
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {user.bloque ? 'Débloquer' : 'Bloquer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}