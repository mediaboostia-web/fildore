import { forwardRef, useId } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

/** Zone de texte multiligne (notes d'atelier, message WhatsApp, description modèle). */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, containerClassName, label, hint, error, id, required, rows = 4, ...props },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const messageId = `${textareaId}-message`;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label ? (
          <label htmlFor={textareaId} className="text-sm font-medium text-text">
            {label}
            {required ? <span className="text-danger"> *</span> : null}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={hint || error ? messageId : undefined}
          className={cn(
            "w-full resize-y rounded-[var(--radius-md)] border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-subtle",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle",
            error ? "border-danger" : "border-border-strong",
            className
          )}
          {...props}
        />
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

Textarea.displayName = "Textarea";
