// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { nom, email, sujet, message } = await request.json();

    // Validation
    if (!nom || !email || !sujet || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Envoyer l'email
    const { data, error } = await resend.emails.send({
      from: 'LuxStay <onboarding@resend.dev>',
      to: ['luxstay-bj@outlook.com'],
      replyTo: email,
      subject: `[LuxStay] ${sujet}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #F9F6F0;">
          <div style="background: #1A5F4A; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #D4A843; margin: 0; font-size: 28px;">LUX<span style="color: white;">STAY</span></h1>
            <p style="color: #E8D5B7; margin: 5px 0 0;">Nouveau message de contact</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Nom :</td>
                <td style="padding: 8px 0; color: #333;">${nom}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Email :</td>
                <td style="padding: 8px 0; color: #333;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Sujet :</td>
                <td style="padding: 8px 0; color: #333;">${sujet}</td>
              </tr>
            </table>
            
            <hr style="border: 1px solid #E8D5B7; margin: 20px 0;" />
            
            <h3 style="color: #1A5F4A; margin: 0 0 10px;">Message :</h3>
            <p style="color: #333; line-height: 1.6; white-space: pre-line;">${message}</p>
          </div>
          
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            Message envoyé depuis le formulaire de contact LuxStay
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du message' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès',
      id: data?.id,
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}