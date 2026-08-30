import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Action principale de la page — un seul bouton primaire qui s'étend en pleine largeur sur mobile */
  action?: ReactNode;
  className?: string;
}

/** En-tête de page standard : titre, description courte, action principale pleine largeur sur mobile. */
export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        <h1 className="text-xl font-bold text-text sm:text-2xl">{title}</h1>
        {description ? <p className="mt-0.5 text-xs sm:text-sm text-text-muted">{description}</p> : null}
      </div>
      {action ? (
        <div className="w-full sm:w-auto shrink-0 [&>*]:w-full sm:[&>*]:w-auto [&>*]:justify-center [&>*]:shadow-sm">
          {action}
        </div>
      ) : null}
    </div>
  );
}
