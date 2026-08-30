import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

/**
 * Squelette de chargement pour /tableau-de-bord — conserve la structure de la
 * page (PROJECT_RULES.md §3 "État Chargement").
 */
export default function TableauDeBordLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    </div>
  );
}
