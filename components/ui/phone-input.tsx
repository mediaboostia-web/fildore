"use client";

import { useId } from "react";
import type { ChangeEvent } from "react";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface PhoneInputProps {
  /** Indicatif pays, éditable. Défaut : Bénin (+229). */
  countryCode?: string;
  onCountryCodeChange?: (value: string) => void;
  /** Numéro national, chiffres uniquement (sans espaces). */
  number: string;
  onNumberChange: (digitsOnly: string) => void;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  containerClassName?: string;
}

/** Regroupe les chiffres par paires pour la lisibilité : "90000000" → "90 00 00 00". */
function formatNationalNumber(digits: string): string {
  return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

/**
 * Champ téléphone pensé pour l'Afrique de l'Ouest : indicatif +229 (Bénin)
 * proposé par défaut mais librement modifiable (Togo, Côte d'Ivoire, etc.).
 */
export function PhoneInput({
  countryCode = "+229",
  onCountryCodeChange,
  number,
  onNumberChange,
  label = "Téléphone",
  hint,
  error,
  required,
  disabled,
  id,
  containerClassName,
}: PhoneInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  function handleNumberChange(event: ChangeEvent<HTMLInputElement>) {
    onNumberChange(event.target.value.replace(/\D/g, ""));
  }

  function handleCountryCodeChange(event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value;
    const normalized = raw.startsWith("+") ? `+${raw.slice(1).replace(/\D/g, "")}` : raw.replace(/\D/g, "");
    onCountryCodeChange?.(normalized);
  }

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
          {required ? <span className="text-danger"> *</span> : null}
        </label>
      ) : null}
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="tel"
          aria-label="Indicatif pays"
          value={countryCode}
          onChange={handleCountryCodeChange}
          disabled={disabled}
          className={cn(
            "h-11 w-20 shrink-0 rounded-[var(--radius-md)] border bg-surface px-2 text-center text-sm text-text",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle",
            error ? "border-danger" : "border-border-strong"
          )}
        />
        <div className="relative flex-1">
          <Phone
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-subtle"
            aria-hidden="true"
          />
          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            autoComplete="tel-national"
            required={required}
            disabled={disabled}
            value={formatNationalNumber(number)}
            onChange={handleNumberChange}
            placeholder="90 00 00 00"
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={hint || error ? messageId : undefined}
            className={cn(
              "h-11 w-full rounded-[var(--radius-md)] border bg-surface pl-10 pr-3 text-sm text-text placeholder:text-text-subtle",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle",
              error ? "border-danger" : "border-border-strong"
            )}
          />
        </div>
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
