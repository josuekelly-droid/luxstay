// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fusionne les classes Tailwind avec clsx et tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un prix en FCFA avec séparateurs de milliers
 */
export function formatPrix(prix: number): string {
  return new Intl.NumberFormat('fr-FR').format(Math.round(prix));
}

/**
 * Formate une date en français
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Calcule le temps restant avant expiration
 */
export function tempsRestant(dateFin: Date): string {
  const maintenant = new Date();
  const diff = dateFin.getTime() - maintenant.getTime();
  
  if (diff <= 0) return 'Expiré';
  
  const jours = Math.floor(diff / (1000 * 60 * 60 * 24));
  const heures = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (jours > 30) {
    const mois = Math.floor(jours / 30);
    return `${mois} mois`;
  }
  
  if (jours > 0) return `${jours} jours`;
  return `${heures} heures`;
}

/**
 * Tronque un texte avec des points de suspension
 */
export function tronquerTexte(texte: string, maxLength: number = 100): string {
  if (texte.length <= maxLength) return texte;
  return texte.substring(0, maxLength) + '...';
}

/**
 * Génère un slug à partir d'un texte
 */
export function slugify(texte: string): string {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Calcule le pourcentage d'utilisation des annonces
 */
export function pourcentageUtilisation(
  utilisees: number,
  max: number
): number {
  if (max === 0) return 100;
  return Math.min(100, Math.round((utilisees / max) * 100));
}