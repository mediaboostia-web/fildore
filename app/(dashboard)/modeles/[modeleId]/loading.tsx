import { Skeleton } from "@/components/ui/skeleton";

/**
 * Squelette de chargement pour la fiche modèle — conserve la structure de la
 * page (PROJECT_RULES.md §3 "État Chargement").
 */
export default function ModeleDetailLoading() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-4 w-40" />
      <div className="grid gap-6 sm:grid-cols-2">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-3">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>
    </div>
  );
}
