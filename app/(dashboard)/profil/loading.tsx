import { Skeleton } from "@/components/ui/skeleton";

/**
 * Squelette de chargement pour /profil — conserve la structure de la page
 * (PROJECT_RULES.md §3 "État Chargement").
 */
export default function ProfilLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-56 w-full" />
    </div>
  );
}
