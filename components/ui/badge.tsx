import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral" | "primary" | "accent";

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  info: "bg-info-bg text-info",
  neutral: "bg-surface-muted text-text-muted border border-border",
  primary: "bg-primary-100 text-primary-900",
  accent: "bg-accent-100 text-accent-700",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: ReactNode;
}

/**
 * Étiquette de statut générique : fond très léger + texte contrasté.
 * Jamais utilisée avec la couleur seule — toujours un libellé explicite
 * (PROJECT_RULES.md §4 "Badges et statuts").
 */
export function Badge({ className, tone = "neutral", icon, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-2 py-0.5 text-xs font-medium",
        TONE_CLASSES[tone],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
