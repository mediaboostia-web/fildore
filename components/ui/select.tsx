import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

/**
 * Liste déroulante native — préférée à un composant custom pour bénéficier
 * du picker natif Android/iOS (meilleure ergonomie tactile qu'un menu web).
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      containerClassName,
      label,
      hint,
      error,
      options,
      placeholder,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const messageId = `${selectId}-message`;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label ? (
          <label htmlFor={selectId} className="text-sm font-medium text-text">
            {label}
            {required ? <span className="text-danger"> *</span> : null}
          </label>
        ) : null}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={hint || error ? messageId : undefined}
            className={cn(
              "h-11 w-full appearance-none rounded-[var(--radius-md)] border bg-surface px-3 pr-10 text-sm text-text",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle",
              error ? "border-danger" : "border-border-strong",
              className
            )}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 size-4 text-text-subtle"
            aria-hidden="true"
          />
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

Select.displayName = "Select";
