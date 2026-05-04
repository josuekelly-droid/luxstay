// src/components/layout/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
  if (isDashboard) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-luxury'
          : 'bg-luxury-green-dark'
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl 2xl:max-w-[1400px]">
        <div className="flex items-center justify-between h-14 sm:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 text-lg sm:text-2xl font-bold flex-shrink-0">
            <span className="text-luxury-gold">LUX</span>
            <span className={`transition-colors ${isScrolled ? 'text-luxury-green' : 'text-white'}`}>STAY</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition whitespace-nowrap ${
                  pathname === link.href
                    ? 'bg-luxury-green text-white'
                    : isScrolled
                    ? 'text-luxury-green-dark hover:bg-luxury-green/10'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="flex-shrink-0">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 flex-shrink-0">
            <Link
              href="/recherche"
              className={`p-2 rounded-xl transition ${
                isScrolled ? 'text-luxury-green-dark hover:bg-luxury-green/10' : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Search size={18} />
            </Link>

            {session ? (
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition whitespace-nowrap ${
                  isScrolled
                    ? 'bg-luxury-green text-white hover:bg-luxury-green-light'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/connexion"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition whitespace-nowrap ${
                    isScrolled
                      ? 'text-luxury-green-dark hover:bg-luxury-green/10'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <LogIn size={16} />
                  <span>Connexion</span>
                </Link>
                <Link
                  href="/inscription"
                  className="flex items-center gap-1.5 bg-luxury-gold text-luxury-green-dark px-4 py-2 rounded-xl text-xs xl:text-sm font-semibold hover:bg-luxury-gold-dark transition shadow-luxury whitespace-nowrap"
                >
                  <UserPlus size={16} />
                  <span>S&apos;inscrire</span>
                </Link>
              </>
            )}
          </div>

          {/* Burger Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-xl transition flex-shrink-0 ${
              isScrolled ? 'text-luxury-green-dark' : 'text-white'
            }`}
            style={{ touchAction: 'manipulation' }}
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-elevated max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto px-3 sm:px-4 py-3 space-y-1">
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

            <hr className="my-3 border-gray-100" />

            {session ? (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-luxury-green text-white text-sm font-semibold"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/connexion"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-luxury-green text-luxury-green text-sm font-semibold"
                >
                  <LogIn size={18} />
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-luxury-gold text-luxury-green-dark text-sm font-semibold"
                >
                  <UserPlus size={18} />
                  Inscription
                </Link>
              </div>
            )}

            <Link
              href="/recherche"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-luxury-sand-light text-luxury-green-dark text-sm font-medium"
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