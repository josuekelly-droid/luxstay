// src/app/api/chatbot/route.ts
import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    // Message système pour contextualiser l'IA
    const systemMessage = {
      role: 'system',
      content: `Tu es l'assistant IA de LuxStay, la plateforme immobilière de référence au Bénin.
      
Ton rôle :
- Répondre aux questions sur l'immobilier au Bénin (achat, location, investissement)
- Conseiller sur les quartiers de Cotonou, Porto-Novo, Parakou, Abomey-Calavi
- Expliquer les démarches administratives (titre foncier, notaire, etc.)
- Parler des tendances du marché immobilier béninois
- Aider sur l'utilisation de la plateforme LuxStay
- Répondre de manière professionnelle, chaleureuse et concise
- Toujours répondre en français

Limites :
- Si on te pose une question hors sujet, ramène poliment la conversation vers l'immobilier
- Ne donne pas de conseils juridiques définitifs, recommande de consulter un notaire
- Reste courtois et professionnel

Format :
- Réponses courtes et claires
- Utilise des émojis avec modération
- Propose des actions concrètes quand c'est pertinent`,
    };

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [systemMessage, ...messages],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erreur API Groq');
    }

    return NextResponse.json({
      reply: data.choices[0].message.content,
    });
  } catch (error: any) {
    console.error('Erreur chatbot:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}