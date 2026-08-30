import { ArrowLeft, Home } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-primary-100 p-4 text-primary-900 mb-4">
        <span className="text-3xl font-bold">404</span>
      </div>
      <h1 className="text-2xl font-bold text-text">Page introuvable</h1>
      <p className="mt-2 max-w-sm text-sm text-text-muted">
        La page ou la ressource que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <LinkButton href="/commandes" variant="secondary" icon={<ArrowLeft className="size-4" />}>
          Retour aux commandes
        </LinkButton>
        <LinkButton href="/tableau-de-bord" icon={<Home className="size-4" />}>
          Tableau de bord
        </LinkButton>
      </div>
    </div>
  );
}
