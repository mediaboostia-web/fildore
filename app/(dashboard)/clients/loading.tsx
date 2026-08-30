import { PageHeader } from "@/components/shared/page-header";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

/**
 * Squelette de chargement pour /clients — conserve la structure de la page
 * (PROJECT_RULES.md §3 "État Chargement"). Le mock-data applique un délai
 * artificiel (~300ms) qui rend cet état observable en dev.
 */
export default function ClientsLoading() {
  return (
    <>
      <PageHeader title="Clients" description="Retrouvez et gérez les clients de votre atelier." />
      <Skeleton className="mb-4 h-11 max-w-md" />
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </>
  );
}
