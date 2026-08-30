import type { ReactNode } from "react";

/**
 * Pages ouvertes sans compte : document partagé (`/d/[token]`) et vitrine de
 * l'atelier (`/atelier/[slug]`).
 *
 * Volontairement sans barre latérale, sans onglets et sans menu : le visiteur
 * n'est pas un utilisateur de l'atelier, et aucune navigation ne doit lui
 * suggérer qu'il existe un intérieur à explorer. Ces chemins ne figurent pas
 * dans les matchers de `proxy.ts` — ils n'exigent donc pas de session.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-background">{children}</div>;
}
