// src/app/admin/avis/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminAvisPage() {
  const [avis, setAvis] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchAvis(); }, []);

  const fetchAvis = async () => {
    const res = await fetch('/api/admin/avis');
    const data = await res.json();
    if (res.ok) setAvis(data.avis);
    setIsLoading(false);
  };

  const handleValidation = async (id: string, valide: boolean) => {
    const res = await fetch('/api/admin/avis', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, valide }),
    });
    if (res.ok) {
      setAvis(prev => prev.map(a => a.id === id ? { ...a, valide } : a));
      toast.success(valide ? 'Avis validé' : 'Avis rejeté');
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-luxury-green-dark">Avis utilisateurs</h2>
      <div className="space-y-4">
        {avis.map(a => (
          <div key={a.id} className="bg-white rounded-2xl shadow-card p-5">
            <div className="flex items-center gap-1 mb-2">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className={i < a.etoiles ? 'text-luxury-gold fill-luxury-gold' : 'text-gray-300'} />)}</div>
            <p className="text-gray-600 text-sm mb-2">&ldquo;{a.commentaire}&rdquo;</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{a.nom} - <span className="text-gray-500">{a.role}</span></span>
              <div className="flex gap-2">
                {!a.valide ? (
                  <button onClick={() => handleValidation(a.id, true)} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1"><CheckCircle size={14} /> Valider</button>
                ) : (
                  <button onClick={() => handleValidation(a.id, false)} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium flex items-center gap-1"><XCircle size={14} /> Rejeter</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}