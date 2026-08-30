"use client";

import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";

/**
 * Filet de sécurité pour tout le groupe `(dashboard)` : sans ce fichier,
 * Next.js affiche son écran d'erreur technique par défaut, contraire au ton
 * Fildor ("jamais... Erreur 500" — PROJECT_RULES.md §3). `error.tsx` doit
 * être un Client Component (contrat Next.js) ; reçoit `error` et `reset`.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <ErrorState
        title="Impossible d'afficher cette page"
        description="Une erreur inattendue est survenue. Vérifiez votre connexion puis réessayez."
        action={
          <Button onClick={reset} icon={<RefreshCcw className="size-4" />}>
            Réessayer
          </Button>
        }
      />
    </div>
  );
}
