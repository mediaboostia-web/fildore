import type { ReactNode } from "react";
import { can, type Permission } from "@/features/auth/permissions";
import type { Role } from "@/features/auth/types";

interface RoleGateBaseProps {
  /** Rôle de l'utilisateur courant. */
  role: Role | null | undefined;
  children: ReactNode;
  /** Contenu affiché quand l'accès est refusé (par défaut : rien). */
  fallback?: ReactNode;
}

export type RoleGateProps = RoleGateBaseProps &
  (
    | {
        /** Droit métier requis — à préférer : la règle reste dans `ROLE_PERMISSIONS`. */
        require: Permission;
        allow?: never;
      }
    | {
        /** Liste de rôles explicite, pour les cas qui ne correspondent à aucun droit métier. */
        allow: Role[];
        require?: never;
      }
  );

/**
 * Affiche `children` uniquement si l'utilisateur a le droit demandé.
 *
 * Rappel : ceci est un confort d'affichage, jamais une garantie de sécurité —
 * toute action sensible est revalidée côté serveur par `requireCan`
 * (PROJECT_RULES.md §7 « Sécurité et données »).
 */
export function RoleGate({ require, allow, role, children, fallback = null }: RoleGateProps) {
  const isAllowed = require ? can(role, require) : Boolean(role && allow?.includes(role));
  if (!isAllowed) return <>{fallback}</>;
  return <>{children}</>;
}
