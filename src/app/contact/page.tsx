// src/app/contact/page.tsx
'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Message envoyé avec succès !');
        setFormData({ nom: '', email: '', sujet: '', message: '' });
      } else {
        toast.error(data.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-16 bg-luxury-sand-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl font-bold text-luxury-green-dark mb-4">
            Contactez-nous
          </h1>
          <p className="text-gray-600 text-lg">
            Une question ? Notre équipe est là pour vous aider
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Infos contact */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-card p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-luxury-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone size={24} className="text-luxury-green" />
              </div>
              <div>
                <h3 className="font-semibold text-luxury-green-dark mb-1">Téléphone</h3>
                <p className="text-gray-600">+229 54 66 62 68</p>
                <p className="text-gray-400 text-sm">Lun-Sam, 8h-19h</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-luxury-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail size={24} className="text-luxury-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-luxury-green-dark mb-1">Email</h3>
                <p className="text-gray-600">luxstayafrica@hotmail.com</p>
                <p className="text-gray-400 text-sm">Réponse sous 24h</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-luxury-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={24} className="text-luxury-green" />
              </div>
              <div>
                <h3 className="font-semibold text-luxury-green-dark mb-1">Adresse</h3>
                <p className="text-gray-600">Haie Vive, Cotonou</p>
                <p className="text-gray-400 text-sm">Bénin</p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-luxury p-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-luxury-green-dark mb-2">Nom</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="input-luxury"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-green-dark mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-luxury"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-luxury-green-dark mb-2">Sujet</label>
                <input
                  type="text"
                  required
                  value={formData.sujet}
                  onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                  className="input-luxury"
                  placeholder="Sujet de votre message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-luxury-green-dark mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-luxury resize-none"
                  placeholder="Votre message..."
                />
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                {isLoading ? 'Envoi...' : 'Envoyer le message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}