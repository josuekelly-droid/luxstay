// src/app/admin/utilisateurs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Ban, CheckCircle, Mail, Trash2 } from 'lucide-react';
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
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      const response = await fetch('/api/admin/utilisateurs');
      const data = await response.json();
      if (response.ok) setUtilisateurs(data.utilisateurs);
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
        setUtilisateurs(prev => prev.map(u => u.id === id ? { ...u, bloque: !bloque } : u));
        toast.success(bloque ? 'Utilisateur débloqué' : 'Utilisateur bloqué');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleSupprimer = async (id: string, nom: string) => {
    if (!confirm(`⚠️ Supprimer définitivement ${nom} ?\n\nCette action est IRRÉVERSIBLE. Toutes ses annonces, messages et données seront effacés.`)) return;
    if (!confirm('Confirmez-vous vraiment la suppression ?')) return;

    setDeleteId(id);
    try {
      const response = await fetch(`/api/admin/utilisateurs/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setUtilisateurs(prev => prev.filter(u => u.id !== id));
        toast.success('Utilisateur supprimé définitivement');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur');
    } finally {
      setDeleteId(null);
    }
  };

  const utilisateursFiltres = utilisateurs
    .filter(u => {
      const s = recherche.toLowerCase();
      return u.nom.toLowerCase().includes(s) || u.prenom.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
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
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-luxury-green-dark">Utilisateurs</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">{utilisateurs.length} utilisateurs inscrits</p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl shadow-card p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search size={16} className="sm:size-[18px] absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="input-luxury pl-9 sm:pl-10 text-xs sm:text-sm"
          />
        </div>
        <select value={filtreRole} onChange={(e) => setFiltreRole(e.target.value)} className="input-luxury w-full sm:w-auto text-xs sm:text-sm">
          <option value="tous">Tous les rôles</option>
          <option value="USER">Utilisateur</option>
          <option value="ANNOUNCER">Annonceur</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Vue Cartes Mobile/Tablette */}
      <div className="lg:hidden space-y-2 sm:space-y-3">
        {utilisateursFiltres.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-10 text-center">
            <Search size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          utilisateursFiltres.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl shadow-card p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-luxury-green rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                    {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-luxury-green-dark text-xs sm:text-sm truncate">{user.prenom} {user.nom}</p>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400"><Mail size={10} className="sm:size-[11px]" /> <span className="truncate">{user.email}</span></div>
                  </div>
                </div>
                <span className={`text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0 ${
                  user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : user.role === 'ANNOUNCER' ? 'bg-luxury-gold/20 text-luxury-gold-dark' : 'bg-gray-100 text-gray-600'
                }`}>{user.role}</span>
              </div>

              <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                <span>{user._count.annonces} ann.</span>
                <span>{new Date(user.dateInscription).toLocaleDateString('fr-FR')}</span>
                <span>{user.bloque ? <span className="text-red-600 flex items-center gap-1"><Ban size={10} className="sm:size-[12px]" /> Bloqué</span> : <span className="text-green-600 flex items-center gap-1"><CheckCircle size={10} className="sm:size-[12px]" /> Actif</span>}</span>
              </div>

              <div className="flex gap-1.5 sm:gap-2">
                <button onClick={() => handleBloquer(user.id, user.bloque)} className={`flex-1 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-medium transition ${user.bloque ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                  {user.bloque ? 'Débloquer' : 'Bloquer'}
                </button>
                {user.role !== 'ADMIN' && (
                  <button onClick={() => handleSupprimer(user.id, `${user.prenom} ${user.nom}`)} disabled={deleteId === user.id} className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-medium bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50">
                    {deleteId === user.id ? <Loader2 size={12} className="sm:size-[14px] animate-spin" /> : <Trash2 size={12} className="sm:size-[14px]" />}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Table Desktop */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-luxury-sand-light text-left">
                <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Utilisateur</th>
                <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Rôle</th>
                <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Statut</th>
                <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Annonces</th>
                <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Inscription</th>
                <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-luxury-green-dark whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {utilisateursFiltres.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500 text-sm">Aucun utilisateur trouvé</td>
                </tr>
              ) : (
                utilisateursFiltres.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-luxury-green rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">{user.prenom?.charAt(0)}{user.nom?.charAt(0)}</div>
                        <div className="min-w-0">
                          <p className="font-semibold text-luxury-green-dark text-xs sm:text-sm truncate">{user.prenom} {user.nom}</p>
                          <p className="text-[10px] sm:text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 whitespace-nowrap"><span className={`text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : user.role === 'ANNOUNCER' ? 'bg-luxury-gold/20 text-luxury-gold-dark' : 'bg-gray-100 text-gray-600'}`}>{user.role}</span></td>
                    <td className="p-3 sm:p-4 whitespace-nowrap">{user.bloque ? <span className="text-[10px] sm:text-xs text-red-600 flex items-center gap-1"><Ban size={12} className="sm:size-[14px]" /> Bloqué</span> : <span className="text-[10px] sm:text-xs text-green-600 flex items-center gap-1"><CheckCircle size={12} className="sm:size-[14px]" /> Actif</span>}</td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{user._count.annonces}</td>
                    <td className="p-3 sm:p-4 text-[10px] sm:text-sm text-gray-500 whitespace-nowrap">{new Date(user.dateInscription).toLocaleDateString('fr-FR')}</td>
                    <td className="p-3 sm:p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <button onClick={() => handleBloquer(user.id, user.bloque)} className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition text-[10px] sm:text-xs font-medium ${user.bloque ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}>{user.bloque ? 'Débloquer' : 'Bloquer'}</button>
                        {user.role !== 'ADMIN' && (
                          <button onClick={() => handleSupprimer(user.id, `${user.prenom} ${user.nom}`)} disabled={deleteId === user.id} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition text-[10px] sm:text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50" title="Supprimer">{deleteId === user.id ? <Loader2 size={12} className="sm:size-[14px] animate-spin" /> : <Trash2 size={12} className="sm:size-[14px]" />}</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}