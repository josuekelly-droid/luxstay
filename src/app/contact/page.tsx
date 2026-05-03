// src/app/contact/page.tsx
'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message envoyé avec succès !');
    setFormData({ nom: '', email: '', sujet: '', message: '' });
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-luxury-sand-light">
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
                <p className="text-gray-600">+229 97 00 00 00</p>
                <p className="text-gray-400 text-sm">Lun-Sam, 8h-19h</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-luxury-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail size={24} className="text-luxury-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-luxury-green-dark mb-1">Email</h3>
                <p className="text-gray-600">contact@luxstay.bj</p>
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

              <button type="submit" className="btn-primary flex items-center gap-2">
                <Send size={20} /> Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}