// src/app/dashboard/messages/page.tsx
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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

interface Contact {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  derniereDate: string;
  dernierMessage: string;
  nonLu: boolean;
  annonce?: { id: string; titre: string };
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [reponse, setReponse] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages, selectedContact]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      if (response.ok) {
        setAllMessages(data.messages);
      }
    } catch (error) {
      toast.error('Erreur de chargement des messages');
    } finally {
      setIsLoading(false);
    }
  };

  // Grouper les messages par contact
  const contacts = useMemo(() => {
    const contactsMap = new Map<string, Contact>();

    allMessages.forEach((msg) => {
      const isExpediteur = msg.expediteur.id === session?.user?.id;
      const contactId = isExpediteur ? msg.destinataire.id : msg.expediteur.id;
      const contactInfo = isExpediteur ? msg.destinataire : msg.expediteur;

      if (!contactsMap.has(contactId)) {
        contactsMap.set(contactId, {
          id: contactId,
          nom: contactInfo.nom,
          prenom: contactInfo.prenom,
          email: (contactInfo as any).email || '',
          derniereDate: msg.createdAt,
          dernierMessage: msg.contenu,
          nonLu: !isExpediteur && !msg.lu,
          annonce: msg.annonce || undefined,
        });
      } else {
        const existing = contactsMap.get(contactId)!;
        if (new Date(msg.createdAt) > new Date(existing.derniereDate)) {
          existing.derniereDate = msg.createdAt;
          existing.dernierMessage = msg.contenu;
        }
        if (!isExpediteur && !msg.lu) {
          existing.nonLu = true;
        }
        if (!existing.annonce && msg.annonce) {
          existing.annonce = msg.annonce;
        }
      }
    });

    return Array.from(contactsMap.values()).sort(
      (a, b) => new Date(b.derniereDate).getTime() - new Date(a.derniereDate).getTime()
    );
  }, [allMessages, session]);

  // Messages de la conversation sélectionnée
  const conversationMessages = useMemo(() => {
    if (!selectedContact) return [];
    return allMessages
      .filter(
        (msg) =>
          (msg.expediteur.id === session?.user?.id && msg.destinataire.id === selectedContact.id) ||
          (msg.destinataire.id === session?.user?.id && msg.expediteur.id === selectedContact.id)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [allMessages, selectedContact, session]);

  const handleSelectContact = async (contact: Contact) => {
    setSelectedContact(contact);

    // Marquer comme lus les messages non lus de ce contact
    const messagesNonLus = allMessages.filter(
      (msg) => msg.expediteur.id === contact.id && msg.destinataire.id === session?.user?.id && !msg.lu
    );

    for (const msg of messagesNonLus) {
      try {
        await fetch(`/api/messages/${msg.id}/lu`, { method: 'PUT' });
      } catch (error) {}
    }

    setAllMessages((prev) =>
      prev.map((msg) =>
        msg.expediteur.id === contact.id && msg.destinataire.id === session?.user?.id
          ? { ...msg, lu: true }
          : msg
      )
    );
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reponse.trim() || !selectedContact) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinataireId: selectedContact.id,
          contenu: reponse,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Ajouter le message à la conversation
        const newMsg: Message = {
          id: data.message?.id || `temp_${Date.now()}`,
          contenu: reponse,
          lu: false,
          createdAt: new Date().toISOString(),
          expediteur: {
            id: session?.user?.id || '',
            nom: (session?.user as any)?.nom || '',
            prenom: (session?.user as any)?.prenom || '',
            email: session?.user?.email || '',
          },
          destinataire: {
            id: selectedContact.id,
            nom: selectedContact.nom,
            prenom: selectedContact.prenom,
          },
        };

        setAllMessages((prev) => [...prev, newMsg]);
        setReponse('');
        toast.success('Message envoyé !');
      } else {
        toast.error(data.error || 'Erreur');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsSending(false);
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

      {contacts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Aucun message</h3>
          <p className="text-gray-400">Les messages des acheteurs intéressés par vos annonces apparaîtront ici.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Liste des contacts */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-luxury-green-dark">
                Conversations ({contacts.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                    selectedContact?.id === contact.id ? 'bg-luxury-green/5 border-l-4 border-luxury-green' : ''
                  } ${contact.nonLu ? 'bg-luxury-gold/5' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-luxury-green rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {contact.prenom?.charAt(0)}{contact.nom?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm text-luxury-green-dark truncate">
                          {contact.prenom} {contact.nom}
                          {contact.nonLu && (
                            <span className="inline-block w-2 h-2 bg-luxury-gold rounded-full ml-2" />
                          )}
                        </p>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {new Date(contact.derniereDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-1">{contact.dernierMessage}</p>
                      {contact.annonce && (
                        <p className="text-xs text-luxury-green mt-1 truncate">
                          Re: {contact.annonce.titre}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Conversation */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-6 flex flex-col">
            {selectedContact ? (
              <>
                {/* En-tête */}
                <div className="flex items-start gap-4 pb-4 border-b border-gray-100 flex-shrink-0">
                  <div className="w-12 h-12 bg-luxury-green rounded-full flex items-center justify-center text-white font-bold">
                    {selectedContact.prenom?.charAt(0)}{selectedContact.nom?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-luxury-green-dark">
                      {selectedContact.prenom} {selectedContact.nom}
                    </p>
                    <p className="text-sm text-gray-500">{selectedContact.email}</p>
                  </div>
                </div>

                {/* Messages de la conversation */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[400px]">
                  {conversationMessages.map((msg) => {
                    const isMine = msg.expediteur.id === session?.user?.id;
                    return (
                      <div key={msg.id} className={`flex gap-3 ${isMine ? 'flex-row-reverse' : ''}`}>
                        <div className="w-8 h-8 bg-luxury-green rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {isMine
                            ? `${(session?.user as any)?.prenom?.charAt(0) || '?'}${(session?.user as any)?.nom?.charAt(0) || '?'}`
                            : `${selectedContact.prenom?.charAt(0)}${selectedContact.nom?.charAt(0)}`}
                        </div>
                        <div
                          className={`max-w-[75%] p-3 rounded-xl text-sm ${
                            isMine
                              ? 'bg-luxury-green text-white rounded-br-sm'
                              : 'bg-luxury-sand-light text-gray-700 rounded-bl-sm'
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.contenu}</p>
                          <p className={`text-[10px] mt-2 ${isMine ? 'text-green-200' : 'text-gray-400'}`}>
                            {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Réponse */}
                <form onSubmit={handleSendReply} className="pt-4 border-t border-gray-100 flex-shrink-0">
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
              </>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 py-16 text-gray-400">
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