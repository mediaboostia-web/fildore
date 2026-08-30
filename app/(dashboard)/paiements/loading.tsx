import { PageHeader } from "@/components/shared/page-header";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

/**
 * Squelette de chargement pour /paiements — conserve la structure de la page
 * (PROJECT_RULES.md §3 "État Chargement").
 */
export default function PaiementsLoading() {
  return (
    <>
      <PageHeader
        title="Paiements & Caisse"
        description="Historique des encaissements d'acomptes et de soldes dans votre atelier."
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </>
  );
}
