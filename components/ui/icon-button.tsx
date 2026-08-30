"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ButtonVariant } from "./button";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-primary-900 text-white hover:bg-primary-800 active:bg-primary-950",
  secondary:
    "bg-surface text-primary-900 border border-border-strong hover:bg-surface-muted",
  tertiary: "bg-transparent text-text-muted hover:bg-surface-muted hover:text-text",
  danger: "bg-danger text-white hover:brightness-90",
  // Vert WhatsApp officiel — exception sanctionnée PROJECT_RULES.md §4 (voir WHATSAPP_GREEN dans button.tsx).
  whatsapp: "bg-[#25D366] text-white hover:brightness-95",
};

const SIZE_CLASSES = {
  sm: "size-9",
  md: "size-11",
  lg: "size-12",
} as const;

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icône affichée seule dans le bouton (obligatoire). */
  icon: ReactNode;
  /** Libellé accessible — obligatoire puisqu'aucun texte visible n'accompagne l'icône. */
  label: string;
  variant?: ButtonVariant;
  size?: keyof typeof SIZE_CLASSES;
  isLoading?: boolean;
}

/**
 * Bouton icône seule (zone tactile ≥ 44×44 px, PROJECT_RULES.md §3).
 * Toujours accompagné d'un `label` pour les lecteurs d'écran.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      icon,
      label,
      variant = "tertiary",
      size = "md",
      isLoading = false,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-md)] transition-colors shrink-0",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          icon
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
