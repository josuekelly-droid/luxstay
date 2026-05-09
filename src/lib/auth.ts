// src/lib/auth.ts
import { NextAuthOptions, DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

// Étendre les types pour inclure nos champs personnalisés
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      nom: string;
      prenom: string;
      telephone: string;
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    nom: string;
    prenom: string;
    telephone: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    nom: string;
    prenom: string;
    telephone: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/connexion",
    error: "/connexion",
    newUser: "/dashboard",
    verifyRequest: "/connexion?verify=1", // Page après envoi du magic link
  },
  providers: [
    // 🔑 Magic Link - Mot de passe oublié
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || "smtp.resend.com",
        port: Number(process.env.EMAIL_SERVER_PORT) || 465,
        auth: {
          user: process.env.EMAIL_SERVER_USER || "resend",
          pass: process.env.EMAIL_SERVER_PASSWORD || process.env.RESEND_API_KEY!,
        },
      },
      from: "LuxStay <onboarding@resend.dev>",
      // Générer le lien magique
      generateVerificationToken: () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      },
      // Personnaliser l'email du magic link
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: provider.from as string,
          to: email,
          subject: "🔑 Lien de connexion - LuxStay",
          html: `
            <div style="max-width:600px;margin:0 auto;font-family:'Inter',Arial,sans-serif;background:#F9F6F0;border-radius:16px;overflow:hidden">
              <div style="background:linear-gradient(135deg,#0F2A1E,#1A5F4A);padding:40px 30px;text-align:center">
                <h1 style="color:#D4A843;font-size:32px;margin:0;font-family:'Playfair Display',serif">LUX<span style="color:white">STAY</span></h1>
                <p style="color:#E8D5B7;font-size:18px;margin:10px 0 0">🔑 Lien de connexion</p>
              </div>
              <div style="padding:40px 30px;background:white">
                <p style="color:#1A5F4A;font-size:16px;line-height:1.6;margin:0 0 20px">
                  Bonjour,
                </p>
                <p style="color:#1A5F4A;font-size:16px;line-height:1.6;margin:0 0 30px">
                  Cliquez sur le bouton ci-dessous pour vous connecter à votre compte LuxStay. Ce lien est valable 24 heures.
                </p>
                <div style="text-align:center;margin:0 0 30px">
                  <a href="${url}" style="display:inline-block;background:#D4A843;color:#0F2A1E;padding:14px 40px;border-radius:12px;text-decoration:none;font-weight:600;font-size:16px">
                    Se connecter
                  </a>
                </div>
                <p style="color:#999;font-size:14px;line-height:1.6;margin:0 0 10px">
                  Si vous n'avez pas demandé ce lien, ignorez cet email.
                </p>
                <p style="color:#999;font-size:14px;line-height:1.6;margin:0">
                  Merci de votre confiance,<br />
                  <strong style="color:#1A5F4A">L'équipe LuxStay</strong>
                </p>
              </div>
            </div>
          `,
        });
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "votre@email.com" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            throw new Error("Email ou mot de passe incorrect");
          }

          if (user.bloque) {
            throw new Error("Votre compte a été bloqué. Contactez le support.");
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error("Email ou mot de passe incorrect");
          }

          await prisma.user.update({
            where: { id: user.id },
            data: { derniereConnexion: new Date() },
          });

          return {
            id: user.id,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            telephone: user.telephone,
            role: user.role,
          };
        } catch (error) {
          if (error instanceof Error && error.message.includes("Email")) throw error;
          console.error("Erreur auth:", error);
          throw new Error("Erreur lors de l'authentification");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Si c'est un magic link (email provider), créer l'utilisateur s'il n'existe pas
      if (account?.provider === 'email') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (!existingUser) {
          // Créer un nouvel utilisateur via magic link
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              nom: '',
              prenom: '',
              telephone: '',
              password: '',
              role: 'USER',
              emailVerifie: true,
              abonnements: {
                create: {
                  plan: 'GRATUIT',
                  duree: 'MENSUEL',
                  debut: new Date(),
                  fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                  annoncesMax: 5,
                  photosParAnnonce: 5,
                },
              },
            },
          });
          user.id = newUser.id;
          user.role = newUser.role;
          user.nom = newUser.nom;
          user.prenom = newUser.prenom;
          user.telephone = newUser.telephone;
        } else {
          user.id = existingUser.id;
          user.role = existingUser.role;
          user.nom = existingUser.nom;
          user.prenom = existingUser.prenom;
          user.telephone = existingUser.telephone;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.nom = user.nom;
        token.prenom = user.prenom;
        token.telephone = user.telephone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.nom = token.nom;
        session.user.prenom = token.prenom;
        session.user.telephone = token.telephone;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default authOptions;