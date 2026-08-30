"use client";

/**
 * Filet de sécurité ultime : ne se déclenche que si `app/layout.tsx`
 * lui-même échoue (cas très rare). Doit fournir ses propres <html>/<body>
 * (contrat Next.js pour `global-error.tsx`) puisqu'il remplace tout le
 * layout racine. Reste dans le ton Fildor plutôt que l'écran technique
 * par défaut (PROJECT_RULES.md §3).
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAFAF7] px-6 text-center font-sans">
          <p className="text-lg font-semibold text-[#1B2422]">L&apos;application a rencontré un problème.</p>
          <p className="max-w-sm text-sm text-[#64716D]">
            Vérifiez votre connexion puis réessayez. Si le problème persiste, rechargez la page.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-[10px] bg-[#173B36] px-4 py-2 text-sm font-medium text-white hover:bg-[#215149]"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
