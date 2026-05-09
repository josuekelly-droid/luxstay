// src/lib/email/templates/AbonnementEmail.tsx
interface AbonnementEmailProps {
  prenom: string;
  nom: string;
  plan: string;
  montant: number;
  duree: string;
  dateFin: string;
  modePaiement: string;
  dashboardUrl: string;
}

export function AbonnementEmail({
  prenom,
  nom,
  plan,
  montant,
  duree,
  dateFin,
  modePaiement,
  dashboardUrl,
}: AbonnementEmailProps) {
  const formatPrix = (p: number) => new Intl.NumberFormat('fr-FR').format(Math.round(p));
  const modeLabel = modePaiement === 'PAYPAL' ? 'PayPal' : modePaiement === 'FEDAPAY' ? 'Mobile Money' : modePaiement === 'NOWPAYMENTS' ? 'Crypto' : modePaiement;

  return `
    <div style="max-width:600px;margin:0 auto;font-family:'Inter','Helvetica Neue',Arial,sans-serif;background:#F9F6F0;border-radius:16px;overflow:hidden">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#0F2A1E,#1A5F4A);padding:40px 30px;text-align:center">
        <h1 style="color:#D4A843;font-size:32px;margin:0;font-family:'Playfair Display',serif">
          LUX<span style="color:white">STAY</span>
        </h1>
        <p style="color:#E8D5B7;font-size:18px;margin:10px 0 0">🎉 Merci pour votre achat !</p>
      </div>

      <!-- Body -->
      <div style="padding:40px 30px;background:white">
        <p style="color:#1A5F4A;font-size:16px;line-height:1.6;margin:0 0 20px">
          Bonjour <strong>${prenom} ${nom}</strong>,
        </p>
        <p style="color:#1A5F4A;font-size:16px;line-height:1.6;margin:0 0 30px">
          Votre abonnement <strong>${plan}</strong> est maintenant actif. Vous pouvez dès maintenant profiter de tous vos avantages.
        </p>

        <!-- Détails -->
        <div style="background:#F9F6F0;border-radius:12px;padding:25px;margin:0 0 30px">
          <h3 style="color:#1A5F4A;font-size:16px;margin:0 0 15px">📋 Détails de votre commande</h3>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0;color:#666;font-size:14px">Plan</td>
              <td style="padding:8px 0;color:#1A5F4A;font-weight:600;font-size:14px;text-align:right">${plan}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666;font-size:14px">Montant</td>
              <td style="padding:8px 0;color:#1A5F4A;font-weight:600;font-size:14px;text-align:right">${formatPrix(montant)} FCFA</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666;font-size:14px">Durée</td>
              <td style="padding:8px 0;color:#1A5F4A;font-weight:600;font-size:14px;text-align:right">${duree}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666;font-size:14px">Expire le</td>
              <td style="padding:8px 0;color:#1A5F4A;font-weight:600;font-size:14px;text-align:right">${dateFin}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666;font-size:14px">Mode de paiement</td>
              <td style="padding:8px 0;color:#1A5F4A;font-weight:600;font-size:14px;text-align:right">${modeLabel}</td>
            </tr>
          </table>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin:0 0 30px">
          <a href="${dashboardUrl}" style="display:inline-block;background:#D4A843;color:#0F2A1E;padding:14px 40px;border-radius:12px;text-decoration:none;font-weight:600;font-size:16px">
            Accéder à mon dashboard
          </a>
        </div>

        <p style="color:#999;font-size:14px;line-height:1.6;margin:0">
          Merci de votre confiance,<br />
          <strong style="color:#1A5F4A">L'équipe LuxStay</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#0F2A1E;padding:20px 30px;text-align:center">
        <p style="color:#666;font-size:12px;margin:0">
          © ${new Date().getFullYear()} LuxStay - Immobilier au Bénin <br />
          Haie Vive, Cotonou, Bénin
        </p>
      </div>
    </div>
  `;
}