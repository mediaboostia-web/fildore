import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Bloc de chargement générique qui conserve la structure de la page
 * (PROJECT_RULES.md §3 "État Chargement"). Composer plusieurs `Skeleton`
 * pour reconstituer la mise en page réelle (ligne de texte, avatar, carte…).
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-[var(--radius-sm)] bg-surface-muted", className)}
      {...props}
    />
  );
}

/** Ligne de texte factice — largeur variable pour éviter un rendu trop mécanique. */
export function SkeletonText({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn("h-3.5 w-full max-w-48", className)} {...props} />;
}

/** Pastille factice (avatar, icône). */
export function SkeletonCircle({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn("size-10 rounded-full", className)} {...props} />;
}

/** Carte factice complète (ex. liste de commandes en chargement). */
export function SkeletonCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-[var(--radius-lg)] border border-border bg-surface p-4", className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <SkeletonCircle />
        <div className="flex flex-1 flex-col gap-2">
          <SkeletonText className="h-4 w-1/3" />
          <SkeletonText className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <SkeletonText />
        <SkeletonText className="w-2/3" />
      </div>
    </div>
  );
}
