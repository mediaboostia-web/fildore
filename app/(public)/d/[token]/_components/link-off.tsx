import { LinkIcon } from "lucide-react";

/**
 * Lien inconnu, expiré ou désactivé — une seule et même page.
 *
 * Le message ne dit ni « document supprimé » ni « lien révoqué » : distinguer
 * les deux cas apprendrait à un inconnu qu'un document existe bien à cette
 * adresse. Il dit simplement quoi faire ensuite.
 */
export function LinkOff() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-surface-muted text-text-subtle">
        <LinkIcon className="size-6" aria-hidden="true" />
      </div>
      <h1 className="text-lg font-bold text-text">Ce lien n&apos;est plus valable.</h1>
      <p className="text-sm text-text-muted">
        Le document n&apos;est plus accessible à cette adresse. Demandez un nouveau lien à votre
        atelier de couture : il peut vous le renvoyer en quelques secondes.
      </p>
    </main>
  );
}
