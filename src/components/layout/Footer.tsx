// src/components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
} from 'lucide-react';

// Icônes SVG personnalisées pour les réseaux sociaux
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const footerLinks = {
  navigation: [
    { href: '/', label: 'Accueil' },
    { href: '/recherche', label: 'Rechercher' },
    { href: '/appartements', label: 'Appartements' },
    { href: '/parcelles', label: 'Parcelles' },
    { href: '/tarifs', label: 'Tarifs' },
  ],
  ressources: [
    { href: '/blog', label: 'Blog' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
    { href: '/faq', label: 'FAQ' },
    { href: '/mentions-legales', label: 'Mentions légales' },
  ],
  annonceurs: [
    { href: '/inscription', label: 'Créer un compte' },
    { href: '/tarifs', label: 'Nos offres' },
    { href: '/dashboard/annonces/creer', label: 'Publier une annonce' },
    { href: '/dashboard', label: 'Espace annonceur' },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  if (isDashboard) return null;

  return (
    <footer className="bg-luxury-green-dark text-white">
      {/* Partie principale */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Colonne 1 - Logo + description */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-3xl font-bold inline-block mb-4">
              <span className="text-luxury-gold">LUX</span>
              <span className="text-white">STAY</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              La plateforme immobilière de référence au Bénin. Trouvez votre chez-vous idéal 
              parmi des milliers de biens vérifiés. Achetez, louez ou investissez en toute confiance.
            </p>

            {/* Contact */}
            <div className="space-y-3">
              <a href="tel:+22954666268" className="flex items-center gap-3 text-gray-400 hover:text-luxury-gold transition">
                <Phone size={16} className="text-luxury-gold" />
                <span>+229 54 66 62 68</span>
              </a>
              <a href="mailto:luxstay-bj@outlook.com" className="flex items-center gap-3 text-gray-400 hover:text-luxury-gold transition">
                <Mail size={16} className="text-luxury-gold" />
                <span>luxstay-bj@outlook.com</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin size={16} className="text-luxury-gold mt-0.5" />
                <span>Haie Vive, Cotonou<br />Bénin</span>
              </div>
            </div>
          </div>

          {/* Colonne 2 - Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Navigation</h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-luxury-gold transition flex items-center gap-2 group"
                  >
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 - Ressources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Ressources</h3>
            <ul className="space-y-3">
              {footerLinks.ressources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-luxury-gold transition flex items-center gap-2 group"
                  >
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 - Annonceurs */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Annonceurs</h3>
            <ul className="space-y-3">
              {footerLinks.annonceurs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-luxury-gold transition flex items-center gap-2 group"
                  >
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Réseaux sociaux */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
                { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
                { icon: <TwitterIcon />, href: '#', label: 'Twitter' },
                { icon: <LinkedinIcon />, href: '#', label: 'LinkedIn' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-luxury-gold hover:text-luxury-green-dark transition"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Barre du bas */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} LuxStay. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/mentions-legales" className="hover:text-luxury-gold transition">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-luxury-gold transition">
              Confidentialité
            </Link>
            <Link href="/conditions" className="hover:text-luxury-gold transition">
              CGU
            </Link>
          </div>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> in Bénin
          </p>
        </div>
      </div>
    </footer>
  );
}