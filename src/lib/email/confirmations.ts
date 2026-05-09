// src/lib/email/confirmations.ts
import { Resend } from 'resend';
import { AbonnementEmail } from './templates/AbonnementEmail';
import { BoostEmail } from './templates/BoostEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function envoyerEmailAbonnement(
  email: string,
  prenom: string,
  nom: string,
  plan: string,
  montant: number,
  duree: string,
  dateFin: string,
  modePaiement: string
): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'LuxStay <onboarding@resend.dev>',
      to: [email],
      subject: `🎉 Votre abonnement ${plan} est activé - LuxStay`,
      html: AbonnementEmail({
        prenom,
        nom,
        plan,
        montant,
        duree,
        dateFin,
        modePaiement,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      }),
    });

    if (error) {
      console.error('Erreur envoi email abonnement:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error: any) {
    console.error('Erreur envoi email:', error);
    return { success: false, error: error.message };
  }
}

export async function envoyerEmailBoost(
  email: string,
  prenom: string,
  nom: string,
  typeBoost: string,
  montant: number,
  duree: number,
  dateFin: string,
  modePaiement: string,
  annonceTitre: string
): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'LuxStay <onboarding@resend.dev>',
      to: [email],
      subject: `🚀 Votre boost ${typeBoost} est activé - LuxStay`,
      html: BoostEmail({
        prenom,
        nom,
        typeBoost,
        montant,
        duree,
        dateFin,
        modePaiement,
        annonceTitre,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/annonces`,
      }),
    });

    if (error) {
      console.error('Erreur envoi email boost:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error: any) {
    console.error('Erreur envoi email:', error);
    return { success: false, error: error.message };
  }
}