import { Skeleton } from "@/components/ui/skeleton";

/**
 * Squelette de chargement pour la fiche commande — conserve la structure de
 * la page (PROJECT_RULES.md §3 "État Chargement").
 */
export default function CommandeDetailLoading() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-4 w-48" />
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
