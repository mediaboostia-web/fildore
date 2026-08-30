import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

/**
 * Squelette de chargement pour la fiche client — conserve la structure de la
 * page (PROJECT_RULES.md §3 "État Chargement").
 */
export default function ClientDetailLoading() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-4 w-40" />
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-9 w-full max-w-md" />
      <div className="space-y-2.5">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}
