// src/app/dashboard/messages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MessageSquare, Send, Loader2, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  contenu: string;
  lu: boolean;
  createdAt: string;
  expediteur: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
  };
  destinataire: {
    id: string;
    nom: string;
    prenom: string;
  };
  annonce?: {
    id: string;
    titre: string;
  };
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reponse, setReponse] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error('Erreur de chargement des messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reponse.trim() || !selectedMessage) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinataireId: selectedMessage.expediteur.id,
          contenu: reponse,
          annonceId: selectedMessage.annonce?.id,
        }),
      });

      if (response.ok) {
        toast.success('Réponse envoyée !');
        setReponse('');
        fetchMessages();
      } else {
        toast.error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsSending(false);
    }
  };

  // Marquer comme lu
  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (!message.lu) {
      try {
        await fetch(`/api/messages/${message.id}/lu`, { method: 'PUT' });
        setMessages(prev => prev.map(m => m.id === message.id ? { ...m, lu: true } : m));
      } catch (error) {}
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-luxury-green-dark">Messages</h2>

      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Aucun message</h3>
          <p className="text-gray-400">Les messages des acheteurs intéressés par vos annonces apparaîtront ici.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Liste des messages */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-luxury-green-dark">
                Conversations ({messages.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => handleSelectMessage(message)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                    selectedMessage?.id === message.id ? 'bg-luxury-green/5 border-l-4 border-luxury-green' : ''
                  } ${!message.lu ? 'bg-luxury-gold/5' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-luxury-green rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {message.expediteur.prenom?.charAt(0)}{message.expediteur.nom?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm text-luxury-green-dark truncate">
                          {message.expediteur.prenom} {message.expediteur.nom}
                          {!message.lu && <span className="inline-block w-2 h-2 bg-luxury-gold rounded-full ml-2" />}
                        </p>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {new Date(message.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-1">{message.contenu}</p>
                      {message.annonce && (
                        <p className="text-xs text-luxury-green mt-1 truncate">
                          Re: {message.annonce.titre}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Détail message */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-6">
            {selectedMessage ? (
              <div className="flex flex-col h-full">
                {/* En-tête */}
                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-luxury-green rounded-full flex items-center justify-center text-white font-bold">
                    {selectedMessage.expediteur.prenom?.charAt(0)}{selectedMessage.expediteur.nom?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-luxury-green-dark">
                      {selectedMessage.expediteur.prenom} {selectedMessage.expediteur.nom}
                    </p>
                    <p className="text-sm text-gray-500">{selectedMessage.expediteur.email}</p>
                    {selectedMessage.annonce && (
                      <p className="text-sm text-luxury-green mt-1">
                        Concernant : {selectedMessage.annonce.titre}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="flex-1 py-4">
                  <div className="bg-luxury-sand-light rounded-xl p-4">
                    <p className="text-gray-700">{selectedMessage.contenu}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(selectedMessage.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Réponse */}
                <form onSubmit={handleSendReply} className="pt-4 border-t border-gray-100">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={reponse}
                      onChange={(e) => setReponse(e.target.value)}
                      placeholder="Votre réponse..."
                      className="input-luxury flex-1"
                    />
                    <button
                      type="submit"
                      disabled={isSending || !reponse.trim()}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                      Envoyer
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400">
                <Mail size={48} className="mb-4" />
                <p>Sélectionnez une conversation pour voir les détails</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}