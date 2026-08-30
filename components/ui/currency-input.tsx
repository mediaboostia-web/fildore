import { useId } from "react";
import type { ChangeEvent } from "react";
import { cn } from "@/lib/utils/cn";

export interface CurrencyInputProps {
  /** Montant en entier (FCFA n'a pas de sous-unité usuelle) — jamais un float. */
  value: number;
  onChange: (value: number) => void;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  /** Devise affichée après le montant. Défaut : FCFA. */
  currencyLabel?: string;
  placeholder?: string;
  containerClassName?: string;
  className?: string;
}

/**
 * Formate un entier avec un espace comme séparateur de milliers : 35000 → "35 000".
 * Exporté pour être réutilisé par tout composant affichant un montant XOF
 * (PaymentSummary, DocumentPreview…) — jamais reformaté indépendamment ailleurs.
 */
export function formatThousands(value: number): string {
  const digits = Math.trunc(Math.abs(value)).toString();
  const withSpaces = digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return value < 0 ? `-${withSpaces}` : withSpaces;
}

/** Montant formaté avec devise : 35000 → "35 000 FCFA". */
export function formatXof(value: number, currencyLabel = "FCFA"): string {
  return `${formatThousands(value)} ${currencyLabel}`;
}

/**
 * Champ montant XOF. Parse strictement en entier (jamais `parseFloat`) :
 * tout caractère non numérique saisi (virgule, point, lettre) est ignoré.
 * Affiche le format local « 35 000 FCFA » — jamais de décimales.
 */
export function CurrencyInput({
  value,
  onChange,
  label,
  hint,
  error,
  required,
  disabled,
  id,
  name,
  currencyLabel = "FCFA",
  placeholder = "0",
  containerClassName,
  className,
}: CurrencyInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  // Composant entièrement contrôlé par `value` — pas d'état local à
  // resynchroniser : l'affichage est dérivé directement de la prop à chaque rendu.
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const digitsOnly = event.target.value.replace(/\D/g, "");
    const parsed = digitsOnly === "" ? 0 : Number.parseInt(digitsOnly, 10);
    onChange(parsed);
  }

  const displayValue = value > 0 ? formatThousands(value) : "";

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
          {required ? <span className="text-danger"> *</span> : null}
        </label>
      ) : null}
      <div className="relative flex items-center">
        <input
          id={inputId}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          required={required}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={hint || error ? messageId : undefined}
          className={cn(
            "h-11 w-full rounded-[var(--radius-md)] border bg-surface pl-3 pr-16 text-right text-sm tabular-nums text-text placeholder:text-text-subtle",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle",
            error ? "border-danger" : "border-border-strong",
            className
          )}
        />
        <span className="pointer-events-none absolute right-3 text-sm text-text-subtle">
          {currencyLabel}
        </span>
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
