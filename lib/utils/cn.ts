import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine des classes Tailwind en résolvant les conflits (dernier gagnant).
 * Pattern standard clsx + tailwind-merge — à utiliser dans tous les composants
 * qui acceptent une prop `className` optionnelle.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
