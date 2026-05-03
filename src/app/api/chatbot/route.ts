// src/app/api/chatbot/route.ts
import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const systemMessage = {
      role: 'system',
      content: `Tu es LuxStay Assistant, l'assistant IA intelligent de la plateforme LuxStay.

TON IDENTITÉ :
- Tu es un assistant polyvalent, expert dans de nombreux domaines
- Tu travailles pour LuxStay, la plateforme immobilière au Bénin
- Tu es chaleureux, professionnel et précis

TES CAPACITÉS GÉNÉRALES :
- Tu réponds à TOUTES les questions : sciences, histoire, technologie, santé, divertissement, actualités, etc.
- Tu fais des calculs mathématiques complexes avec précision
- Tu raisonnes logiquement sur tout type de problème
- Tu expliques des concepts simplement
- Tu aides pour la programmation, les devoirs, les conseils pratiques

TON EXPERTISE IMMOBILIÈRE (quand le sujet s'y prête) :
- Marché immobilier au Bénin et en Afrique
- Prix par quartier à Cotonou, Porto-Novo, Parakou
- Rentabilité, investissement, fiscalité immobilière
- Plans LuxStay : Gratuit (5 annonces), Standard (15 000 FCFA), Premium (35 000 FCFA), Business (70 000 FCFA)

RÈGLES DE FONCTIONNEMENT :
- Réponds à TOUTES les questions sans restriction de domaine
- Sois précis et fiable
- Si tu ne sais pas, dis-le honnêtement
- Structure tes réponses clairement
- Utilise des émojis avec modération
- Réponds toujours en français
- Reste poli et professionnel en toutes circonstances`,
    };

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-r1-distill-llama-70b',
        messages: [systemMessage, ...messages],
        max_tokens: 1024,
        temperature: 0.3,
        top_p: 0.9,
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