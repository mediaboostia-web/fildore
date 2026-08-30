"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger"
  | "whatsapp";

export type ButtonSize = "sm" | "md" | "lg";

/**
 * Vert WhatsApp officiel — seule couleur de marque tolérée hors palette Fildor,
 * strictement réservée au contexte WhatsApp (PROJECT_RULES.md §4 "Boutons").
 * Centralisé ici pour rester la source unique (réutilisé par IconButton et
 * WhatsAppMessagePreview) plutôt que recopié en plusieurs endroits.
 */
export const WHATSAPP_GREEN = "#25D366";

/**
 * Exportées pour être réutilisées telles quelles par un composant "lien qui a
 * l'apparence d'un bouton" (ex. `LinkButton` de app/(dashboard)/clients/_components/) :
 * `Button` rend un vrai <button>, invalide à imbriquer dans un <a> de navigation
 * — jamais de deuxième jeu de classes redéfini ailleurs pour ce cas.
 */
export const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-900 text-white hover:bg-primary-800 active:bg-primary-950 disabled:bg-primary-100 disabled:text-text-subtle",
  secondary:
    "bg-surface text-primary-900 border border-border-strong hover:bg-surface-muted active:bg-primary-50 disabled:text-text-subtle disabled:border-border",
  tertiary:
    "bg-transparent text-primary-900 hover:bg-surface-muted active:bg-primary-50 disabled:text-text-subtle",
  danger:
    "bg-danger text-white hover:brightness-90 active:brightness-80 disabled:bg-danger-bg disabled:text-text-subtle",
  whatsapp:
    "bg-[#25D366] text-white hover:brightness-95 active:brightness-90 disabled:bg-primary-100 disabled:text-text-subtle",
};

export const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Affiche un indicateur de chargement et désactive le bouton. */
  isLoading?: boolean;
  /** Icône affichée avant le libellé. */
  icon?: ReactNode;
  /** Étend le bouton sur toute la largeur disponible (utile en mobile). */
  fullWidth?: boolean;
}

/**
 * Bouton d'action Fildor. Un seul bouton `primary` par vue ou section
 * (PROJECT_RULES.md §4 "Boutons"). Libellé toujours orienté action.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      fullWidth = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          icon
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
