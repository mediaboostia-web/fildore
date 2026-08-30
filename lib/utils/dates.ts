/**
 * Utilitaires de date. `today` est toujours injecté en paramètre par les appelants
 * (jamais `new Date()` codé en dur dans un sélecteur) pour rester testable.
 */
export function formatDateFr(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function isSameDay(isoDateA: string, isoDateB: string): boolean {
  const a = new Date(isoDateA);
  const b = new Date(isoDateB);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function daysBetween(fromIso: string, toIso: string): number {
  const from = new Date(fromIso);
  const to = new Date(toIso);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((to.getTime() - from.getTime()) / msPerDay);
}

export function isWithinNextDays(isoDate: string, today: string, days: number): boolean {
  const delta = daysBetween(today, isoDate);
  return delta >= 0 && delta <= days;
}

export function isPast(isoDate: string, today: string): boolean {
  return daysBetween(today, isoDate) < 0;
}

/** Ajoute (ou retire) des jours à une date `YYYY-MM-DD`, en gardant le même format. */
export function addDaysIso(isoDate: string, days: number): string {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Date du jour au format `YYYY-MM-DD`.
 *
 * Réservée aux Server Actions et aux formulaires : les sélecteurs testables
 * reçoivent toujours `today` en paramètre, ils ne l'appellent pas eux-mêmes.
 */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Format court lisible pour une date `YYYY-MM-DD` : « 06/09/2026 ». */
export function formatDateShortFr(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}
