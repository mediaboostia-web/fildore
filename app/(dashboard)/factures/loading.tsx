import { PageHeader } from "@/components/shared/page-header";
import { SkeletonCard } from "@/components/ui/skeleton";

/**
 * Squelette de chargement pour /factures — conserve la structure de la page
 * (PROJECT_RULES.md §3 "État Chargement").
 */
export default function FacturesLoading() {
  return (
    <>
      <PageHeader
        title="Factures & Documents"
        description="Consultez, téléchargez et imprimez les devis, bons de commande et factures de l'atelier."
      />
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </>
  );
}
