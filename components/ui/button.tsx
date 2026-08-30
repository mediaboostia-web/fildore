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

export const WHATSAPP_GREEN = "#25D366";

/**
 * Styles de variantes inspirés d'Origin UI :
 * Finitions soignées avec micro-relief, reflets subtils et retour tactile.
 */
export const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-900 text-white shadow-sm shadow-primary-950/20 border border-primary-800/80 hover:bg-primary-800 hover:shadow-md hover:border-primary-700 active:bg-primary-950 active:scale-[0.98] disabled:bg-primary-100 disabled:text-text-subtle disabled:border-transparent disabled:shadow-none disabled:active:scale-100",
  secondary:
    "bg-surface text-text border border-border/90 shadow-xs hover:bg-surface-muted hover:text-primary-950 hover:border-border-strong active:bg-canvas active:scale-[0.98] disabled:text-text-subtle disabled:border-border disabled:shadow-none disabled:active:scale-100",
  tertiary:
    "bg-transparent text-primary-900 hover:bg-surface-muted hover:text-primary-950 active:bg-primary-50 active:scale-[0.98] disabled:text-text-subtle disabled:active:scale-100",
  danger:
    "bg-danger text-white shadow-sm shadow-danger/20 border border-danger/80 hover:brightness-95 hover:shadow-md active:brightness-90 active:scale-[0.98] disabled:bg-danger-bg disabled:text-text-subtle disabled:border-transparent disabled:shadow-none disabled:active:scale-100",
  whatsapp:
    "bg-[#25D366] text-white shadow-sm shadow-[#25D366]/20 border border-[#20ba5a] hover:brightness-95 hover:shadow-md active:brightness-90 active:scale-[0.98] disabled:bg-primary-100 disabled:text-text-subtle disabled:border-transparent disabled:shadow-none disabled:active:scale-100",
};

export const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs font-semibold gap-1.5 [&_svg]:size-3.5",
  md: "h-10 px-4 text-sm font-semibold gap-2 [&_svg]:size-4",
  lg: "h-12 px-6 text-base font-semibold gap-2.5 [&_svg]:size-5",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

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
          "inline-flex items-center justify-center rounded-xl font-medium tracking-tight select-none",
          "transition-all duration-150 ease-out cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0",
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
