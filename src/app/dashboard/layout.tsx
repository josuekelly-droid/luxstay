// src/app/dashboard/layout.tsx
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Home,
  PlusCircle,
  MessageSquare,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  CreditCard,
  User,
  ChevronRight,
} from 'lucide-react';

const menuItems = [
  {
    label: 'Vue d\'ensemble',
    href: '/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Mes annonces',
    href: '/dashboard/annonces',
    icon: <Home size={20} />,
  },
  {
    label: 'Publier une annonce',
    href: '/dashboard/annonces/creer',
    icon: <PlusCircle size={20} />,
  },
  {
    label: 'Abonnement',
    href: '/dashboard/abonnement',
    icon: <CreditCard size={20} />,
  },
  {
    label: 'Messages',
    href: '/dashboard/messages',
    icon: <MessageSquare size={20} />,
  },
  {
    label: 'Favoris',
    href: '/dashboard/favoris',
    icon: <Heart size={20} />,
  },
  {
    label: 'Profil',
    href: '/dashboard/profil',
    icon: <User size={20} />,
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-elevated transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-luxury-sand/30 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-luxury-gold">LUX</span>
            <span className="text-luxury-green">STAY</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-luxury-sand/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-luxury-green rounded-full flex items-center justify-center text-white font-bold">
              {session?.user?.prenom?.charAt(0)}
              {session?.user?.nom?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-luxury-green-dark truncate">
                {session?.user?.prenom} {session?.user?.nom}
              </p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                      isActive
                        ? 'bg-luxury-green text-white'
                        : 'text-gray-600 hover:bg-luxury-green/5 hover:text-luxury-green'
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
        <div className="p-4 border-t border-luxury-sand/30">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition font-medium"
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
              {menuItems.find(item => pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href)))?.label || 'Dashboard'}
            </h1>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-luxury-green transition"
              >
                Voir le site
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="hidden sm:flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
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