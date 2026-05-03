// src/app/admin/paiements/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Search, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';

interface Paiement {
  id: string;
  montant: number;
  devise: string;
  modePaiement: string;
  statut: string;
  reference: string;
  datePaiement: string | null;
  createdAt: string;
  user: {
    nom: string;
    prenom: string;
    email: string;
  };
}

export default function AdminPaiementsPage() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtre, setFiltre] = useState('tous');
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

  const paiementsFiltres = paiements
    .filter(p => filtre === 'tous' || p.statut === filtre)
    .filter(p => {
      const s = recherche.toLowerCase();
      return (
        p.user.nom.toLowerCase().includes(s) ||
        p.user.email.toLowerCase().includes(s) ||
        p.reference.toLowerCase().includes(s)
      );
    });

  const totalRevenus = paiements
    .filter(p => p.statut === 'COMPLETE')
    .reduce((sum, p) => sum + p.montant, 0);

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
        <h2 className="text-2xl font-bold text-luxury-green-dark">Paiements</h2>
        <p className="text-gray-500 text-sm mt-1">{paiements.length} transactions</p>
      </div>

      {/* Stats rapides */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <p className="text-sm text-gray-500">Revenus totaux</p>
          <p className="text-2xl font-bold text-luxury-green">
            {totalRevenus.toLocaleString('fr-FR')} FCFA
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <p className="text-sm text-gray-500">Transactions réussies</p>
          <p className="text-2xl font-bold text-green-600">
            {paiements.filter(p => p.statut === 'COMPLETE').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">
            {paiements.filter(p => p.statut === 'EN_ATTENTE').length}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl shadow-card p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="input-luxury pl-10"
          />
        </div>
        <select value={filtre} onChange={(e) => setFiltre(e.target.value)} className="input-luxury w-auto">
          <option value="tous">Tous</option>
          <option value="COMPLETE">Complétés</option>
          <option value="EN_ATTENTE">En attente</option>
          <option value="ECHOUE">Échoués</option>
          <option value="REMBOURSE">Remboursés</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-luxury-sand-light text-left">
                <th className="p-4 text-sm font-semibold">Référence</th>
                <th className="p-4 text-sm font-semibold">Utilisateur</th>
                <th className="p-4 text-sm font-semibold">Montant</th>
                <th className="p-4 text-sm font-semibold">Mode</th>
                <th className="p-4 text-sm font-semibold">Statut</th>
                <th className="p-4 text-sm font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paiementsFiltres.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <p className="text-sm font-mono text-gray-600 truncate max-w-[150px]">{p.reference}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-sm">{p.user.prenom} {p.user.nom}</p>
                    <p className="text-xs text-gray-400">{p.user.email}</p>
                  </td>
                  <td className="p-4 font-semibold text-sm">
                    {p.montant.toLocaleString('fr-FR')} {p.devise}
                  </td>
                  <td className="p-4">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{p.modePaiement}</span>
                  </td>
                  <td className="p-4">
                    {p.statut === 'COMPLETE' && (
                      <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Complété</span>
                    )}
                    {p.statut === 'EN_ATTENTE' && (
                      <span className="text-xs text-yellow-600 flex items-center gap-1"><Clock size={14} /> En attente</span>
                    )}
                    {p.statut === 'ECHOUE' && (
                      <span className="text-xs text-red-600 flex items-center gap-1"><XCircle size={14} /> Échoué</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {p.datePaiement ? new Date(p.datePaiement).toLocaleDateString('fr-FR') : '-'}
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