// src/app/admin/paiements/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Search, CheckCircle, XCircle, Clock, TrendingUp, CreditCard } from 'lucide-react';

interface Paiement {
  id: string;
  montant: number;
  devise: string;
  modePaiement: string;
  statut: string;
  reference: string;
  datePaiement: string | null;
  createdAt: string;
  metaData: any;
  user: {
    nom: string;
    prenom: string;
    email: string;
  };
}

export default function AdminPaiementsPage() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [filtreType, setFiltreType] = useState('tous');
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    fetchPaiements();
  }, []);

  const fetchPaiements = async () => {
    try {
      const response = await fetch('/api/admin/paiements');
      const data = await response.json();
      if (response.ok) setPaiements(data.paiements);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypePaiement = (p: Paiement): string => {
    const meta = p.metaData as any;
    if (meta?.annonceId) return 'boost';
    return 'abonnement';
  };

  const paiementsFiltres = paiements
    .filter(p => filtreStatut === 'tous' || p.statut === filtreStatut)
    .filter(p => filtreType === 'tous' || getTypePaiement(p) === filtreType)
    .filter(p => {
      const s = recherche.toLowerCase();
      return p.user.nom.toLowerCase().includes(s) || p.user.email.toLowerCase().includes(s) || p.reference.toLowerCase().includes(s);
    });

  const totalRevenus = paiements.filter(p => p.statut === 'COMPLETE').reduce((sum, p) => sum + p.montant, 0);
  const totalBoosts = paiements.filter(p => p.statut === 'COMPLETE' && getTypePaiement(p) === 'boost').reduce((sum, p) => sum + p.montant, 0);

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
        <h2 className="text-xl sm:text-2xl font-bold text-luxury-green-dark">Paiements</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">{paiements.length} transactions</p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white rounded-2xl shadow-card p-2.5 sm:p-4">
          <p className="text-[10px] sm:text-xs text-gray-500">Revenus totaux</p>
          <p className="text-base sm:text-xl font-bold text-luxury-green truncate">{totalRevenus.toLocaleString('fr-FR')} FCFA</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-2.5 sm:p-4">
          <p className="text-[10px] sm:text-xs text-gray-500">Réussies</p>
          <p className="text-base sm:text-xl font-bold text-green-600">{paiements.filter(p => p.statut === 'COMPLETE').length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-2.5 sm:p-4">
          <p className="text-[10px] sm:text-xs text-gray-500">En attente</p>
          <p className="text-base sm:text-xl font-bold text-yellow-600">{paiements.filter(p => p.statut === 'EN_ATTENTE').length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-2.5 sm:p-4">
          <p className="text-[10px] sm:text-xs text-gray-500">Revenus boosts</p>
          <p className="text-base sm:text-xl font-bold text-luxury-gold-dark truncate">{totalBoosts.toLocaleString('fr-FR')} FCFA</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl shadow-card p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search size={16} className="sm:size-[18px] absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Rechercher..." value={recherche} onChange={(e) => setRecherche(e.target.value)} className="input-luxury pl-9 sm:pl-10 text-xs sm:text-sm" />
        </div>
        <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)} className="input-luxury w-full sm:w-auto text-xs sm:text-sm">
          <option value="tous">Tous statuts</option>
          <option value="COMPLETE">Complétés</option>
          <option value="EN_ATTENTE">En attente</option>
          <option value="ECHOUE">Échoués</option>
        </select>
        <select value={filtreType} onChange={(e) => setFiltreType(e.target.value)} className="input-luxury w-full sm:w-auto text-xs sm:text-sm">
          <option value="tous">Tous types</option>
          <option value="abonnement">Abonnements</option>
          <option value="boost">Boosts</option>
        </select>
      </div>

      {/* Vue Cartes Mobile/Tablette */}
      <div className="lg:hidden space-y-2 sm:space-y-3">
        {paiementsFiltres.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-10 text-center">
            <Search size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucune transaction trouvée</p>
          </div>
        ) : (
          paiementsFiltres.map((p) => {
            const typePaiement = getTypePaiement(p);
            return (
              <div key={p.id} className="bg-white rounded-2xl shadow-card p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${
                    p.statut === 'COMPLETE' ? 'bg-green-100 text-green-700' : p.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {p.statut === 'COMPLETE' ? '✅ Complété' : p.statut === 'EN_ATTENTE' ? '⏳ En attente' : '❌ Échoué'}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1 ${typePaiement === 'boost' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {typePaiement === 'boost' ? <TrendingUp size={10} /> : <CreditCard size={10} />}
                      {typePaiement === 'boost' ? 'Boost' : 'Abo'}
                    </span>
                    <span className="text-[10px] sm:text-xs bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded-full">{p.modePaiement}</span>
                  </div>
                </div>

                <p className="font-semibold text-luxury-green text-base sm:text-lg mb-1">{p.montant.toLocaleString('fr-FR')} {p.devise}</p>
                <p className="text-xs sm:text-sm text-gray-600 mb-0.5">{p.user.prenom} {p.user.nom}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mb-2 truncate">{p.user.email}</p>

                <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-400">
                  <span className="font-mono truncate max-w-[120px]">{p.reference}</span>
                  <span>{p.datePaiement ? new Date(p.datePaiement).toLocaleDateString('fr-FR') : '-'}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Table Desktop */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="bg-luxury-sand-light text-left">
                <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold whitespace-nowrap">Référence</th>
                <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold whitespace-nowrap">Utilisateur</th>
                <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold whitespace-nowrap">Type</th>
                <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold whitespace-nowrap">Montant</th>
                <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold whitespace-nowrap">Mode</th>
                <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold whitespace-nowrap">Statut</th>
                <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paiementsFiltres.length === 0 ? (
                <tr><td colSpan={7} className="p-10 text-center text-gray-500 text-sm">Aucune transaction trouvée</td></tr>
              ) : (
                paiementsFiltres.map((p) => {
                  const typePaiement = getTypePaiement(p);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="p-3 sm:p-4"><p className="text-[10px] sm:text-xs font-mono text-gray-500 truncate max-w-[100px]">{p.reference}</p></td>
                      <td className="p-3 sm:p-4">
                        <p className="font-medium text-xs sm:text-sm">{p.user.prenom} {p.user.nom}</p>
                        <p className="text-[10px] sm:text-xs text-gray-400 truncate max-w-[150px]">{p.user.email}</p>
                      </td>
                      <td className="p-3 sm:p-4 whitespace-nowrap">
                        <span className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1 w-fit ${typePaiement === 'boost' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {typePaiement === 'boost' ? <TrendingUp size={10} className="sm:size-[12px]" /> : <CreditCard size={10} className="sm:size-[12px]" />}
                          {typePaiement === 'boost' ? 'Boost' : 'Abonnement'}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 font-semibold text-xs sm:text-sm whitespace-nowrap">{p.montant.toLocaleString('fr-FR')} {p.devise}</td>
                      <td className="p-3 sm:p-4 whitespace-nowrap"><span className="text-[10px] sm:text-xs bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">{p.modePaiement}</span></td>
                      <td className="p-3 sm:p-4 whitespace-nowrap">
                        {p.statut === 'COMPLETE' && <span className="text-[10px] sm:text-xs text-green-600 flex items-center gap-1"><CheckCircle size={12} className="sm:size-[14px]" /> Complété</span>}
                        {p.statut === 'EN_ATTENTE' && <span className="text-[10px] sm:text-xs text-yellow-600 flex items-center gap-1"><Clock size={12} className="sm:size-[14px]" /> En attente</span>}
                      </td>
                      <td className="p-3 sm:p-4 text-[10px] sm:text-sm text-gray-500 whitespace-nowrap">{p.datePaiement ? new Date(p.datePaiement).toLocaleDateString('fr-FR') : '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}