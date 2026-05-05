// src/app/admin/avis/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trash2, Loader2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminAvisPage() {
  const [avis, setAvis] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchAvis();
  }, []);

  const fetchAvis = async () => {
    try {
      const res = await fetch('/api/admin/avis');
      const data = await res.json();
      if (res.ok) setAvis(data.avis);
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidation = async (id: string, valide: boolean) => {
    try {
      const res = await fetch('/api/admin/avis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, valide }),
      });
      if (res.ok) {
        setAvis(prev => prev.map(a => a.id === id ? { ...a, valide } : a));
        toast.success(valide ? 'Avis validé' : 'Avis rejeté');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleSupprimer = async (id: string) => {
    if (!confirm('Supprimer définitivement cet avis ?')) return;

    setDeleteId(id);
    try {
      const res = await fetch(`/api/admin/avis?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAvis(prev => prev.filter(a => a.id !== id));
        toast.success('Avis supprimé');
      }
    } catch (error) {
      toast.error('Erreur');
    } finally {
      setDeleteId(null);
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-luxury-green-dark">Avis utilisateurs</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          {avis.length} avis • {avis.filter(a => a.valide).length} validés • {avis.filter(a => !a.valide).length} en attente
        </p>
      </div>

      {avis.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <Star size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Aucun avis</h3>
          <p className="text-gray-400">Les avis des utilisateurs apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {avis.map((a) => (
            <div
              key={a.id}
              className={`bg-white rounded-2xl shadow-card p-4 sm:p-6 border-l-4 ${
                a.valide ? 'border-green-500' : 'border-yellow-500'
              }`}
            >
              <div className="flex items-center gap-1 mb-2 sm:mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < a.etoiles ? 'text-luxury-gold fill-luxury-gold' : 'text-gray-300'}
                  />
                ))}
                <span className="text-xs text-gray-400 ml-2">
                  {new Date(a.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-3">&ldquo;{a.commentaire}&rdquo;</p>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-sm font-medium text-luxury-green-dark">{a.nom}</span>
                  <span className="text-xs text-gray-500 ml-2">({a.role})</span>
                  {a.valide ? (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Validé</span>
                  ) : (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">En attente</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!a.valide ? (
                    <button
                      onClick={() => handleValidation(a.id, true)}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-green-200 transition"
                    >
                      <CheckCircle size={14} /> Valider
                    </button>
                  ) : (
                    <button
                      onClick={() => handleValidation(a.id, false)}
                      className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-yellow-200 transition"
                    >
                      <XCircle size={14} /> Rejeter
                    </button>
                  )}
                  <button
                    onClick={() => handleSupprimer(a.id)}
                    disabled={deleteId === a.id}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                  >
                    {deleteId === a.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}