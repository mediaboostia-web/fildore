import { PageHeader } from "@/components/shared/page-header";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

/**
 * Squelette de chargement pour /messages — conserve la structure de la page
 * (PROJECT_RULES.md §3 "État Chargement").
 */
export default function MessagesLoading() {
  return (
    <>
      <PageHeader
        title="Messagerie WhatsApp"
        description="Préparez et envoyez des messages professionnels personnalisés à vos clients via WhatsApp."
      />
      <Skeleton className="mb-4 h-11 max-w-md" />
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </>
  );
}
