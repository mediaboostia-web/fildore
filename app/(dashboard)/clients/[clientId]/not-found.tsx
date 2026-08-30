import { UserX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "../_components/link-button";

/**
 * `not-found.tsx` local : le projet n'a pas encore de not-found.tsx racine,
 * et un client introuvable mérite un message métier clair plutôt que la page
 * 404 générique de Next.js (PROJECT_RULES.md §3 "Français simple partout").
 */
export default function ClientNotFound() {
  return (
    <EmptyState
      icon={<UserX className="size-6" aria-hidden="true" />}
      title="Ce client est introuvable."
      description="Il a peut-être été archivé ou le lien n'est plus valide."
      action={<LinkButton href="/clients">Retour aux clients</LinkButton>}
    />
  );
}
