import { Badge, type BadgeTone } from "./badge";
import { ORDER_STATUS_FLOW, type OrderStatus } from "@/features/orders/types";

/** Réexporté pour les composants UI qui n'ont besoin que du type (pas de dépendance directe à features/). */
export type { OrderStatus };

/**
 * Mapping statut → couleur fonctionnelle, dérivé du tableau PROJECT_RULES.md §4
 * "Badges et statuts" :
 *   - Confirmée / prête / payée              → success
 *   - En cours / couture / essayage          → info (utilisé pour toute l'étape
 *     de production : mesures, tissu, coupe, couture, essayage, retouche —
 *     cohérence visuelle du pipeline)
 *   - Acompte attendu / bientôt dû           → warning
 *   - En retard / impayé / annulée           → danger (suspendue assimilée à
 *     une commande bloquée, donc danger également)
 *   - Brouillon / archivée                   → neutral
 *
 * Source unique de vérité pour tout composant affichant un statut de commande
 * (OrderStatusSelector la réutilise — jamais de mapping dupliqué).
 */
export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; tone: BadgeTone }> = {
  brouillon: { label: "Brouillon", tone: "neutral" },
  a_confirmer: { label: "À confirmer", tone: "warning" },
  acompte_attendu: { label: "Acompte attendu", tone: "warning" },
  confirmee: { label: "Confirmée", tone: "success" },
  mesures_a_prendre: { label: "Mesures à prendre", tone: "info" },
  tissu_fournitures: { label: "Tissu / fournitures", tone: "info" },
  coupe: { label: "Coupe", tone: "info" },
  couture: { label: "Couture", tone: "info" },
  essayage: { label: "Essayage", tone: "info" },
  retouche: { label: "Retouche", tone: "info" },
  prete: { label: "Prête", tone: "success" },
  livree: { label: "Livrée", tone: "success" },
  terminee: { label: "Terminée", tone: "success" },
  suspendue: { label: "Suspendue", tone: "danger" },
  annulee: { label: "Annulée", tone: "danger" },
};

/**
 * Ordre du pipeline de production, utilisé par OrderStatusSelector et Stepper.
 * Alias de `ORDER_STATUS_FLOW` (features/orders/types.ts) — même source, pas
 * de deuxième liste à maintenir en parallèle.
 */
export const ORDER_STATUS_ORDER: OrderStatus[] = ORDER_STATUS_FLOW;

export interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

/** Badge de statut de commande — fond léger, texte contrasté, libellé explicite. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];
  return (
    <Badge tone={config.tone} className={className}>
      {config.label}
    </Badge>
  );
}
