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

function buildDisabledMatchers(minDate?: Date, maxDate?: Date) {
  const matchers: ({ before: Date } | { after: Date })[] = [];
  if (minDate) matchers.push({ before: minDate });
  if (maxDate) matchers.push({ after: maxDate });
  return matchers.length > 0 ? matchers : undefined;
}

/**
 * Sélecteur de date moderne inspiré d'Origin UI avec bouton "Aujourd'hui" :
 * Angles arrondis 2xl, grille aérée, raccourcis rapides et sélection fluide.
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

  const handleSelectToday = () => {
    const today = new Date();
    onChange(today);
    setOpen(false);
  };

  const handleSelectTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    onChange(tomorrow);
    setOpen(false);
  };

  const handleSelectInAWeek = () => {
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);
    onChange(in7Days);
    setOpen(false);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label ? (
        <label htmlFor={triggerId} className="text-sm font-semibold text-text">
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
              "flex h-11 w-full items-center gap-2.5 rounded-xl border bg-surface px-3.5 text-left text-sm font-medium",
              "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle",
              error ? "border-danger" : "border-border shadow-xs hover:border-border-strong",
              value ? "text-text" : "text-text-subtle"
            )}
          >
            <CalendarDays className="size-4 shrink-0 text-primary-900" aria-hidden="true" />
            <span>{value ? dateFormatter.format(value) : placeholder}</span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            className="z-50 rounded-2xl border border-border/80 bg-surface p-3 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
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
                "text-sm p-1",
                "[--rdp-accent-color:var(--color-primary-900)]",
                "[--rdp-accent-background-color:var(--color-primary-100)]",
                "[--rdp-today-color:var(--color-accent-600)]"
              )}
              classNames={{
                caption_label: "font-bold text-text text-sm capitalize",
                weekday: "text-text-subtle font-semibold text-xs py-1",
                day_button: "size-8 rounded-xl text-text font-medium transition-colors hover:bg-primary-50 active:scale-95",
                selected: "bg-primary-900 text-white font-bold rounded-xl shadow-xs",
                today: "font-bold text-accent-600 border border-accent-600/40 rounded-xl",
              }}
            />

            {/* Barre de boutons rapides Origin UI avec bouton Aujourd'hui */}
            <div className="mt-2.5 border-t border-border/80 pt-2.5 flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={handleSelectToday}
                className="flex-1 rounded-lg bg-primary-50 py-1.5 px-2 text-xs font-semibold text-primary-900 hover:bg-primary-100 transition-colors cursor-pointer text-center"
              >
                Aujourd&apos;hui
              </button>
              <button
                type="button"
                onClick={handleSelectTomorrow}
                className="flex-1 rounded-lg bg-surface-muted py-1.5 px-2 text-xs font-semibold text-text-muted hover:bg-border/60 hover:text-text transition-colors cursor-pointer text-center"
              >
                Demain
              </button>
              <button
                type="button"
                onClick={handleSelectInAWeek}
                className="flex-1 rounded-lg bg-surface-muted py-1.5 px-2 text-xs font-semibold text-text-muted hover:bg-border/60 hover:text-text transition-colors cursor-pointer text-center"
              >
                Dans 7j
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {error ? (
        <p id={messageId} className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-xs text-text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
