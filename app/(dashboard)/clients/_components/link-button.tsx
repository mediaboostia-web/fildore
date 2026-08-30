import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { VARIANT_CLASSES, SIZE_CLASSES } from "@/components/ui/button";
import type { ButtonVariant, ButtonSize } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  fullWidth?: boolean;
}

/**
 * Équivalent de `Button` pour une navigation (rend un <a> via `next/link`) —
 * `Button` rend un vrai <button>, invalide à imbriquer dans un lien
 * (éléments interactifs imbriqués). Réutilise les classes de style exportées
 * par components/ui/button.tsx, jamais redéfinies ici.
 */
export function LinkButton({
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}
