"use client";

import { useId, useState } from "react";
import { CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import "react-day-picker/style.css";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/lib/utils/cn";

export interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
  minDate?: Date;
  maxDate?: Date;
  containerClassName?: string;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Construit la liste de contraintes `disabled` de react-day-picker en ignorant les bornes absentes. */
function buildDisabledMatchers(minDate?: Date, maxDate?: Date) {
  const matchers: ({ before: Date } | { after: Date })[] = [];
  if (minDate) matchers.push({ before: minDate });
  if (maxDate) matchers.push({ after: maxDate });
  return matchers.length > 0 ? matchers : undefined;
}

/**
 * Sélecteur de date basé sur react-day-picker (locale française) dans une
 * popover Radix. Couleurs pilotées via les variables CSS du design system,
 * jamais de valeur hex en dur.
 */
export function DatePicker({
  value,
  onChange,
  label,
  hint,
  error,
  required,
  disabled,
  placeholder = "Sélectionner une date",
  id,
  minDate,
  maxDate,
  containerClassName,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const messageId = `${triggerId}-message`;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label ? (
        <label htmlFor={triggerId} className="text-sm font-medium text-text">
          {label}
          {required ? <span className="text-danger"> *</span> : null}
        </label>
      ) : null}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            id={triggerId}
            disabled={disabled}
            aria-describedby={hint || error ? messageId : undefined}
            className={cn(
              "flex h-11 w-full items-center gap-2 rounded-[var(--radius-md)] border bg-surface px-3 text-left text-sm",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle",
              error ? "border-danger" : "border-border-strong",
              value ? "text-text" : "text-text-subtle"
            )}
          >
            <CalendarDays className="size-4 shrink-0 text-text-subtle" aria-hidden="true" />
            {value ? dateFormatter.format(value) : placeholder}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            className="z-50 rounded-[var(--radius-lg)] border border-border bg-surface p-3 shadow-md"
          >
            <DayPicker
              mode="single"
              locale={fr}
              selected={value}
              onSelect={(date) => {
                onChange(date);
                setOpen(false);
              }}
              disabled={buildDisabledMatchers(minDate, maxDate)}
              className={cn(
                "text-sm",
                "[--rdp-accent-color:var(--color-primary-800)]",
                "[--rdp-accent-background-color:var(--color-primary-100)]",
                "[--rdp-today-color:var(--color-accent-600)]"
              )}
              classNames={{
                caption_label: "font-medium text-text",
                weekday: "text-text-subtle",
                day_button: "rounded-[var(--radius-sm)] text-text hover:bg-surface-muted",
              }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
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
