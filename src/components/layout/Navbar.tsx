// src/components/layout/Navbar.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  Home,
  Building2,
  TreesIcon as TreePine,
  Phone,
  LogIn,
  UserPlus,
  LayoutDashboard,
  ChevronDown,
  BookOpen,
} from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Accueil', icon: <Home size={18} /> },
  { href: '/appartements', label: 'Appartements', icon: <Building2 size={18} /> },
  { href: '/parcelles', label: 'Parcelles', icon: <TreePine size={18} /> },
  { href: '/blog', label: 'Blog', icon: <BookOpen size={18} /> },
  { href: '/contact', label: 'Contact', icon: <Phone size={18} /> },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Détecter le scroll pour changer le style de la navbar
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 10);
    });
  }

  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  // Ne pas afficher la navbar sur le dashboard
  if (isDashboard) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-luxury'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 text-2xl font-bold">
            <span className={`transition-colors ${isScrolled ? 'text-luxury-gold' : 'text-luxury-gold'}`}>LUX</span>
            <span className={`transition-colors ${isScrolled ? 'text-luxury-green' : 'text-white'}`}>STAY</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                  pathname === link.href
                    ? 'bg-luxury-green text-white'
                    : isScrolled
                    ? 'text-luxury-green-dark hover:bg-luxury-green/10'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Recherche rapide */}
            <Link
              href="/recherche"
              className={`p-2 rounded-xl transition ${
                isScrolled
                  ? 'text-luxury-green-dark hover:bg-luxury-green/10'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Search size={20} />
            </Link>

            {session ? (
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  isScrolled
                    ? 'bg-luxury-green text-white hover:bg-luxury-green-light'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                }`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/connexion"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                    isScrolled
                      ? 'text-luxury-green-dark hover:bg-luxury-green/10'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <LogIn size={18} />
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="flex items-center gap-2 bg-luxury-gold text-luxury-green-dark px-5 py-2 rounded-xl text-sm font-semibold hover:bg-luxury-gold-dark transition shadow-luxury"
                >
                  <UserPlus size={18} />
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>

          {/* Burger Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-xl transition ${
              isScrolled ? 'text-luxury-green-dark' : 'text-white'
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-elevated">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  pathname === link.href
                    ? 'bg-luxury-green text-white'
                    : 'text-luxury-green-dark hover:bg-luxury-green/5'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            <hr className="my-4 border-gray-100" />

            {session ? (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-luxury-green text-white font-semibold"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/connexion"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-luxury-green text-luxury-green font-semibold"
                >
                  <LogIn size={18} />
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-luxury-gold text-luxury-green-dark font-semibold"
                >
                  <UserPlus size={18} />
                  Inscription
                </Link>
              </div>
            )}

            <Link
              href="/recherche"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-luxury-sand-light text-luxury-green-dark font-medium"
            >
              <Search size={18} />
              Rechercher un bien
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}