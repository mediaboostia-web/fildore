import { Skeleton } from "@/components/ui/skeleton";

/**
 * Squelette de chargement pour l'aperçu d'un document — conserve la
 * structure de la page (PROJECT_RULES.md §3 "État Chargement").
 */
export default function DocumentDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="mx-auto h-[520px] w-full max-w-2xl" />
    </div>
  );
}
