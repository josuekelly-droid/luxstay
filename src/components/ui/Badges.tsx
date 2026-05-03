// src/components/ui/Badges.tsx
'use client';

import { cn } from '@/lib/utils';
import { CheckCircle, Star, Crown, AlertTriangle } from 'lucide-react';

interface BadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BadgePremium({ className, size = 'sm' }: BadgeProps) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 bg-gradient-to-r from-luxury-gold to-luxury-gold-light text-luxury-green-dark font-bold rounded-full',
        sizes[size],
        className
      )}
    >
      <Crown size={size === 'sm' ? 12 : 16} />
      Premium
    </span>
  );
}

export function BadgeVerified({ className, size = 'sm' }: BadgeProps) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 bg-luxury-green text-white font-medium rounded-full',
        sizes[size],
        className
      )}
    >
      <CheckCircle size={size === 'sm' ? 12 : 16} />
      Vérifié
    </span>
  );
}

export function BadgeBoost({ className, size = 'sm' }: BadgeProps) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 bg-orange-500 text-white font-medium rounded-full',
        sizes[size],
        className
      )}
    >
      <Star size={size === 'sm' ? 12 : 16} />
      Boost
    </span>
  );
}

export function BadgeExpire({ className, size = 'sm' }: BadgeProps) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 bg-red-100 text-red-600 font-medium rounded-full',
        sizes[size],
        className
      )}
    >
      <AlertTriangle size={size === 'sm' ? 12 : 16} />
      Expiré
    </span>
  );
}

export function BadgeStatut({
  statut,
  className,
}: {
  statut: string;
  className?: string;
}) {
  const statuts: Record<string, { label: string; className: string }> = {
    BROUILLON: { label: 'Brouillon', className: 'bg-gray-100 text-gray-600' },
    EN_ATTENTE: { label: 'En attente', className: 'bg-yellow-100 text-yellow-600' },
    PUBLIEE: { label: 'Publiée', className: 'bg-green-100 text-green-600' },
    REFUSEE: { label: 'Refusée', className: 'bg-red-100 text-red-600' },
    EXPIREE: { label: 'Expirée', className: 'bg-red-100 text-red-600' },
    ARCHIVEE: { label: 'Archivée', className: 'bg-gray-100 text-gray-600' },
  };

  const config = statuts[statut] || statuts.BROUILLON;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}