// src/app/admin/layout.tsx
'use client';

import { useSession } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  Home,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Flag,
  TrendingUp,
  ChevronRight,
  Star,
} from 'lucide-react';

const menuItems = [
  {
    label: 'Vue d\'ensemble',
    href: '/admin',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Utilisateurs',
    href: '/admin/utilisateurs',
    icon: <Users size={20} />,
  },
  {
    label: 'Annonces',
    href: '/admin/annonces',
    icon: <Home size={20} />,
  },
  {
    label: 'Paiements',
    href: '/admin/paiements',
    icon: <CreditCard size={20} />,
  },
  {
    label: 'Abonnements',
    href: '/admin/abonnements',
    icon: <Bell size={20} />,
  },
  {
    label: 'Signalements',
    href: '/admin/signalements',
    icon: <Flag size={20} />,
  },
  {
  label: 'Avis',
  href: '/admin/avis',
  icon: <Star size={20} />,
  },
  {
    label: 'Paramètres',
    href: '/admin/parametres',
    icon: <Settings size={20} />,
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-sand-light">
        <div className="w-10 h-10 border-4 border-luxury-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/connexion');
  }

  // Vérifier que l'utilisateur est admin
  if ((session?.user as any)?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-luxury-sand-light flex">
      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-luxury-green-dark text-white transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Admin */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <Shield size={28} className="text-luxury-gold" />
            <div>
              <p className="text-lg font-bold">
                <span className="text-luxury-gold">LUX</span>STAY
              </p>
              <p className="text-xs text-gray-400">Administration</p>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center text-luxury-green-dark font-bold">
              {(session?.user as any)?.prenom?.charAt(0)}{(session?.user as any)?.nom?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">
                {(session?.user as any)?.prenom} {(session?.user as any)?.nom}
              </p>
              <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname?.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                      isActive
                        ? 'bg-luxury-gold text-luxury-green-dark'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <ChevronRight size={16} className="ml-auto" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Déconnexion */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/20 transition font-medium"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top navbar */}
        <header className="bg-white shadow-card sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={24} className="text-luxury-green-dark" />
            </button>

            <h1 className="text-lg font-semibold text-luxury-green-dark hidden sm:block">
              {menuItems.find(item => pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href)))?.label || 'Administration'}
            </h1>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-luxury-green transition"
                target="_blank"
              >
                Voir le site
              </Link>
              <span className="text-xs bg-luxury-gold/20 text-luxury-gold-dark px-3 py-1 rounded-full font-medium">
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}