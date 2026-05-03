// src/lib/auth.ts
import { NextAuthOptions, DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./db"; // Correction : import nommé

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
    // signUp n'existe pas dans les options de pages, on l'enlève
    error: "/connexion",
    newUser: "/dashboard",
  },
  providers: [
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
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.password) {
            throw new Error("Email ou mot de passe incorrect");
          }

          if (user.bloque) {
            throw new Error("Votre compte a été bloqué. Contactez le support.");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Email ou mot de passe incorrect");
          }

          // Mettre à jour la dernière connexion
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
          if (error instanceof Error && error.message.includes("Email")) {
            throw error;
          }
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