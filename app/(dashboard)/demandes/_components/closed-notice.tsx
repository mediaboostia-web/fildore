import { Info } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";

/**
 * Rappel affiché quand la page publique est fermée.
 *
 * Sans lui, un atelier voit une liste vide et conclut que « ça ne marche pas »,
 * alors qu'il n'a simplement jamais ouvert ses commandes en ligne.
 */
export function OnlineOrderingClosedNotice() {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-[var(--radius-md)] border border-info/30 bg-info-bg p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2.5">
        <Info className="mt-0.5 size-4 shrink-0 text-info" aria-hidden="true" />
        <p className="text-sm text-text">
          <strong>Vos commandes en ligne sont fermées.</strong> Vos clients ne peuvent pas encore
          vous envoyer de demande. Ouvrez-les quand vous êtes prêt : vous choisissez les modèles
          proposés, le délai minimum et l&apos;acompte.
        </p>
      </div>
      <LinkButton href="/parametres#commandes-en-ligne" size="sm" fullWidth="mobile">
        Ouvrir mes commandes en ligne
      </LinkButton>
    </div>
  );
}
