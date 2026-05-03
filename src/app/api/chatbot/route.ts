// src/app/api/chatbot/route.ts
import { NextResponse } from 'next/server';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

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

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [systemMessage, ...messages],
        max_tokens: 1024,
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur DeepSeek:', data);
      throw new Error(data.error?.message || 'Erreur API DeepSeek');
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