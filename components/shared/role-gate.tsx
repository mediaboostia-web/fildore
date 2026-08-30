import type { ReactNode } from "react";
import type { Role } from "@/features/auth/types";

export interface RoleGateProps {
  /** Rôles autorisés à voir `children`. */
  allow: Role[];
  /** Rôle de l'utilisateur courant. */
  role: Role | null | undefined;
  children: ReactNode;
  /** Contenu affiché quand l'accès est refusé (par défaut : rien). */
  fallback?: ReactNode;
}

/**
 * Affiche `children` uniquement si `role` fait partie de `allow`.
 * Rappel : ceci est un confort d'affichage côté client, jamais une garantie
 * de sécurité — les actions sensibles doivent être revalidées côté serveur
 * (PROJECT_RULES.md §7 "Sécurité et données").
 */
export function RoleGate({ allow, role, children, fallback = null }: RoleGateProps) {
  if (!role || !allow.includes(role)) return <>{fallback}</>;
  return <>{children}</>;
}
