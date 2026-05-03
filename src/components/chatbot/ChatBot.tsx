// src/components/chatbot/ChatBot.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant IA de **LuxStay**. Comment puis-je vous aider ? 🏠\n\nJe peux vous renseigner sur :\n• L\'immobilier au Bénin\n• Les quartiers de Cotonou\n• L\'investissement locatif\n• Les démarches d\'achat',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus l'input quand le chat s'ouvre
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Désolé, je rencontre un problème. Veuillez réessayer.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur de connexion. Veuillez réessayer.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 transition-all duration-300 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600 scale-90'
            : 'bg-luxury-green hover:bg-luxury-green-light shadow-elevated'
        } text-white p-3 sm:p-4 rounded-full`}
        aria-label="Assistant IA LuxStay"
      >
        {isOpen ? (
          <X size={22} />
        ) : (
          <>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles size={16} className="sm:size-[18px] text-luxury-gold" />
            </div>
            <span className="hidden sm:inline font-medium text-xs sm:text-sm">Assistant IA</span>
          </>
        )}
      </button>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 sm:w-full sm:max-w-[380px] lg:max-w-md bg-white shadow-elevated overflow-hidden sm:rounded-2xl border-0 sm:border border-luxury-sand/30 flex flex-col">
          {/* Header */}
          <div className="bg-luxury-green px-4 py-3 sm:p-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/15 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white/20">
              <div className="text-center leading-tight">
                <span className="block text-luxury-gold font-bold text-sm sm:text-base">LUX</span>
                <span className="block text-white font-bold text-[8px] sm:text-[10px] -mt-0.5">STAY</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm">Assistant LuxStay</h3>
              <p className="text-green-200 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
                En ligne
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-1">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-luxury-sand-light" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-luxury-green rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-center leading-tight">
                      <span className="block text-luxury-gold font-bold text-[10px] sm:text-[11px]">LUX</span>
                      <span className="block text-white font-bold text-[6px] sm:text-[7px] -mt-0.5">STAY</span>
                    </div>
                  </div>
                )}
                {msg.role === 'user' && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-luxury-gold rounded-full flex items-center justify-center text-luxury-green-dark font-bold text-xs sm:text-sm flex-shrink-0">
                    Moi
                  </div>
                )}

                {/* Bulle */}
                <div
                  className={`max-w-[80%] sm:max-w-[75%] p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm ${
                    msg.role === 'user'
                      ? 'bg-luxury-green text-white rounded-br-sm'
                      : 'bg-white shadow-card text-gray-700 rounded-bl-sm'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div className="flex gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-luxury-green rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="text-center leading-tight">
                    <span className="block text-luxury-gold font-bold text-[10px] sm:text-[11px]">LUX</span>
                    <span className="block text-white font-bold text-[6px] sm:text-[7px] -mt-0.5">STAY</span>
                  </div>
                </div>
                <div className="bg-white shadow-card p-2.5 sm:p-3 rounded-xl rounded-bl-sm">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 bg-white border-t border-gray-100 flex-shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Votre question..."
                className="input-luxury flex-1 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="btn-primary p-2.5 sm:p-3 rounded-xl disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={16} className="sm:size-[18px] animate-spin" /> : <Send size={16} className="sm:size-[18px]" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}