// src/lib/auth.ts
import { NextAuthOptions, DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// import EmailProvider from "next-auth/providers/email"; // ← Commenté
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
    // verifyRequest: "/connexion?verify=1", // ← Commenté
  },
  providers: [
    // 🔑 Magic Link - Désactivé temporairement (nécessite nodemailer + config)
    /*
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
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({ ... });
      },
    }),
    */

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