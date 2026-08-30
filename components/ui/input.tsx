import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Texte d'aide affiché sous le champ (masqué si `error` est présent). */
  hint?: string;
  /** Message d'erreur affiché au niveau du champ (PROJECT_RULES.md §4 "Formulaires"). */
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  containerClassName?: string;
}

/**
 * Champ texte générique avec label toujours visible (jamais de placeholder seul),
 * marqueur "obligatoire" discret et erreur rattachée au champ via aria-describedby.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      hint,
      error,
      leadingIcon,
      trailingIcon,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-text">
            {label}
            {required ? <span className="text-danger"> *</span> : null}
          </label>
        ) : null}
        <div className="relative flex items-center">
          {leadingIcon ? (
            <span className="pointer-events-none absolute left-3 flex items-center text-text-subtle">
              {leadingIcon}
            </span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={hint || error ? messageId : undefined}
            className={cn(
              "h-11 w-full rounded-[var(--radius-md)] border bg-surface px-3 text-sm text-text placeholder:text-text-subtle",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle",
              error ? "border-danger" : "border-border-strong",
              leadingIcon && "pl-10",
              trailingIcon && "pr-10",
              className
            )}
            {...props}
          />
          {trailingIcon ? (
            <span className="pointer-events-none absolute right-3 flex items-center text-text-subtle">
              {trailingIcon}
            </span>
          ) : null}
        </div>
        {error ? (
          <p id={messageId} className="text-sm text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={messageId} className="text-sm text-text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
