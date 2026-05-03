// src/app/admin/parametres/page.tsx
'use client';

import { useState } from 'react';
import { Settings, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminParametresPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState({
    fraisService: '0',
    annoncesGratuites: '5',
    dureeValidation: '48',
    emailContact: 'contact@luxstay.bj',
    telephone: '+229 97 00 00 00',
    maintenance: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success('Paramètres enregistrés');
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-luxury-green-dark">Paramètres</h2>
        <p className="text-gray-500 text-sm mt-1">Configuration de la plateforme</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h3 className="font-display text-lg font-bold text-luxury-green-dark">Général</h3>
        
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

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Délai validation (heures)</label>
          <input type="number" value={config.dureeValidation} onChange={(e) => setConfig({...config, dureeValidation: e.target.value})} className="input-luxury" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h3 className="font-display text-lg font-bold text-luxury-green-dark">Contact</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input type="email" value={config.emailContact} onChange={(e) => setConfig({...config, emailContact: e.target.value})} className="input-luxury" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Téléphone</label>
            <input type="tel" value={config.telephone} onChange={(e) => setConfig({...config, telephone: e.target.value})} className="input-luxury" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h3 className="font-display text-lg font-bold text-luxury-green-dark">Maintenance</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={config.maintenance} onChange={(e) => setConfig({...config, maintenance: e.target.checked})} className="w-5 h-5 text-luxury-green rounded" />
          <span className="text-sm">Mode maintenance</span>
        </label>
      </div>

      <button onClick={handleSave} disabled={isSaving} className="btn-primary flex items-center gap-2">
        {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
        Enregistrer les paramètres
      </button>
    </div>
  );
}