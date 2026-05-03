// src/app/admin/signalements/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Flag, Shield, Loader2, CheckCircle, XCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Signalement {
  id: string;
  type: string;
  description: string | null;
  statut: string;
  createdAt: string;
  user: { nom: string; prenom: string; email: string };
  annonce: { id: string; titre: string } | null;
}

export default function AdminSignalementsPage() {
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtre, setFiltre] = useState('EN_ATTENTE');

  useEffect(() => {
    fetchSignalements();
  }, []);

  const fetchSignalements = async () => {
    try {
      const response = await fetch('/api/admin/signalements');
      const data = await response.json();
      if (response.ok) setSignalements(data.signalements);
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTraiter = async (id: string, statut: string) => {
    try {
      const response = await fetch(`/api/admin/signalements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut }),
      });
      if (response.ok) {
        setSignalements(prev => prev.map(s => s.id === id ? { ...s, statut } : s));
        toast.success(statut === 'TRAITE' ? 'Signalement traité' : 'Signalement ignoré');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const signalementsFiltres = signalements.filter(s => filtre === 'tous' || s.statut === filtre);

  const stats = {
    enAttente: signalements.filter(s => s.statut === 'EN_ATTENTE').length,
    traites: signalements.filter(s => s.statut === 'TRAITE').length,
    ignores: signalements.filter(s => s.statut === 'IGNORE').length,
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
      <div>
        <h2 className="text-2xl font-bold text-luxury-green-dark">Signalements</h2>
        <p className="text-gray-500 text-sm mt-1">{signalements.length} signalements</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'En attente', value: stats.enAttente, color: 'bg-red-500' },
          { label: 'Traités', value: stats.traites, color: 'bg-green-500' },
          { label: 'Ignorés', value: stats.ignores, color: 'bg-gray-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-card p-4">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-white mb-2`}>
              <Flag size={20} />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl shadow-card p-4 flex gap-3">
        {['tous', 'EN_ATTENTE', 'TRAITE', 'IGNORE'].map(f => (
          <button key={f} onClick={() => setFiltre(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filtre === f ? 'bg-luxury-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f === 'tous' ? 'Tous' : f === 'EN_ATTENTE' ? 'En attente' : f === 'TRAITE' ? 'Traités' : 'Ignorés'}
          </button>
        ))}
      </div>

      {/* Liste */}
      {signalementsFiltres.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <Flag size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">Aucun signalement</h3>
          <p className="text-gray-400">Les signalements apparaîtront ici</p>
        </div>
      ) : (
        <div className="space-y-4">
          {signalementsFiltres.map((signalement) => (
            <div key={signalement.id} className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      signalement.type === 'ARNAQUE' ? 'bg-red-100 text-red-700' :
                      signalement.type === 'CONTENU_INAPPROPRIE' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {signalement.type.replace('_', ' ')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      signalement.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-700' :
                      signalement.statut === 'TRAITE' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {signalement.statut === 'EN_ATTENTE' ? 'En attente' : signalement.statut === 'TRAITE' ? 'Traité' : 'Ignoré'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{signalement.description || 'Aucune description'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-4">
                  <span>Par {signalement.user.prenom} {signalement.user.nom}</span>
                  {signalement.annonce && (
                    <Link href={`/bien/${signalement.annonce.id}`} target="_blank" className="text-luxury-green hover:underline flex items-center gap-1">
                      <Eye size={12} /> {signalement.annonce.titre}
                    </Link>
                  )}
                  <span>{new Date(signalement.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>

                {signalement.statut === 'EN_ATTENTE' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleTraiter(signalement.id, 'TRAITE')} className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-2 py-1 rounded-lg">
                      <CheckCircle size={14} /> Traiter
                    </button>
                    <button onClick={() => handleTraiter(signalement.id, 'IGNORE')} className="flex items-center gap-1 text-gray-600 hover:bg-gray-50 px-2 py-1 rounded-lg">
                      <XCircle size={14} /> Ignorer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}