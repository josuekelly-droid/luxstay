// src/app/api/auth/magic-link/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import prisma from '@/lib/db';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Aucun compte trouvé avec cet email' }, { status: 404 });
    }

    
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 heure

    
    await prisma.magicToken.deleteMany({ where: { email } });

    // Stocker le token en base
    await prisma.magicToken.create({
      data: {
        email,
        token,
        utilisateurId: user.id,
        expires,
      },
    });

    const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/magic-link/verify?token=${token}`;

    await resend.emails.send({
      from: 'LuxStay <onboarding@resend.dev>',
      to: email,
      subject: '🔑 Lien de connexion - LuxStay',
      html: `
        <div style="max-width:600px;margin:0 auto;font-family:'Inter',Arial,sans-serif;background:#F9F6F0;border-radius:16px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#0F2A1E,#1A5F4A);padding:40px 30px;text-align:center">
            <h1 style="color:#D4A843;font-size:32px;margin:0">LUX<span style="color:white">STAY</span></h1>
            <p style="color:#E8D5B7;font-size:18px;margin:10px 0 0">🔑 Lien de connexion</p>
          </div>
          <div style="padding:40px 30px;background:white;text-align:center">
            <p style="color:#1A5F4A;font-size:16px;margin:0 0 30px">Cliquez ci-dessous pour vous connecter :</p>
            <a href="${magicLink}" style="display:inline-block;background:#D4A843;color:#0F2A1E;padding:14px 40px;border-radius:12px;text-decoration:none;font-weight:600;font-size:16px">Se connecter</a>
            <p style="color:#999;font-size:12px;margin:20px 0 0">Ce lien expire dans 1 heure.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Email envoyé' });
  } catch (error) {
    console.error('Erreur magic link:', error);
    return NextResponse.json({ error: 'Erreur envoi' }, { status: 500 });
  }
}