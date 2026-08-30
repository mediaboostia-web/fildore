import { MapPin } from "lucide-react";
import { FildorLogo } from "@/components/brand/fildor-logo";
import type { Workshop } from "@/features/auth/types";

/**
 * En-tête de la vitrine publique.
 *
 * Volontairement sans navigation : le visiteur n'a pas de compte, et un menu
 * lui suggérerait un intérieur auquel il n'a pas accès.
 */
export function PublicHeader({ workshop }: { workshop: Workshop }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-base font-bold text-primary-950">{workshop.name}</p>
          <p className="flex items-center gap-1 text-xs text-text-muted">
            <MapPin className="size-3" aria-hidden="true" />
            {workshop.city}, {workshop.country}
          </p>
        </div>
        <FildorLogo variant="lockup" height={22} className="hidden sm:block" />
      </div>
    </header>
  );
}
