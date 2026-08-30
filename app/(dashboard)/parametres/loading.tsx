import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Squelette de chargement pour /parametres — conserve la structure de la page
 * (PROJECT_RULES.md §3 "État Chargement").
 */
export default function ParametresLoading() {
  return (
    <>
      <PageHeader
        title="Paramètres de l'atelier"
        description="Gérez les informations de votre établissement, l'équipe et les préférences de gestion."
      />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </>
  );
}
