// src/app/admin/utilisateurs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Ban, CheckCircle, Mail } from 'lucide-react';
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
      <div className="bg-white rounded-2xl shadow-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="input-luxury pl-10 text-sm"
          />
        </div>
        <select
          value={filtreRole}
          onChange={(e) => setFiltreRole(e.target.value)}
          className="input-luxury w-full sm:w-auto text-sm"
        >
          <option value="tous">Tous les rôles</option>
          <option value="USER">Utilisateur</option>
          <option value="ANNOUNCER">Annonceur</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Vue Cartes Mobile */}
      <div className="lg:hidden space-y-3">
        {utilisateursFiltres.map((user) => (
          <div key={user.id} className="bg-white rounded-2xl shadow-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-luxury-green rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-luxury-green-dark text-sm truncate">
                    {user.prenom} {user.nom}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Mail size={11} /> <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                user.role === 'ANNOUNCER' ? 'bg-luxury-gold/20 text-luxury-gold-dark' :
                'bg-gray-100 text-gray-600'
              }`}>
                {user.role}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>{user._count.annonces} annonce{user._count.annonces > 1 ? 's' : ''}</span>
              <span>{new Date(user.dateInscription).toLocaleDateString('fr-FR')}</span>
              <span>
                {user.bloque ? (
                  <span className="text-red-600 flex items-center gap-1"><Ban size={12} /> Bloqué</span>
                ) : (
                  <span className="text-green-600 flex items-center gap-1"><CheckCircle size={12} /> Actif</span>
                )}
              </span>
            </div>

            <button
              onClick={() => handleBloquer(user.id, user.bloque)}
              className={`w-full py-2 rounded-lg text-xs font-medium transition ${
                user.bloque
                  ? 'bg-green-50 text-green-600 hover:bg-green-100'
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              {user.bloque ? 'Débloquer le compte' : 'Bloquer le compte'}
            </button>
          </div>
        ))}
      </div>

      {/* Table Desktop */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-luxury-sand-light text-left">
                <th className="p-4 text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Utilisateur</th>
                <th className="p-4 text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Rôle</th>
                <th className="p-4 text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Statut</th>
                <th className="p-4 text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Annonces</th>
                <th className="p-4 text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Inscription</th>
                <th className="p-4 text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {utilisateursFiltres.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-luxury-green rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-luxury-green-dark text-sm truncate">
                          {user.prenom} {user.nom}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'ANNOUNCER' ? 'bg-luxury-gold/20 text-luxury-gold-dark' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {user.bloque ? (
                      <span className="text-xs text-red-600 flex items-center gap-1"><Ban size={14} /> Bloqué</span>
                    ) : (
                      <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Actif</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">{user._count.annonces}</td>
                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(user.dateInscription).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <button
                      onClick={() => handleBloquer(user.id, user.bloque)}
                      className={`px-3 py-1.5 rounded-lg transition text-xs font-medium ${
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