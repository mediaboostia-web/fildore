"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { StatusBadge, ORDER_STATUS_CONFIG, ORDER_STATUS_ORDER, type OrderStatus } from "./status-badge";
import { cn } from "@/lib/utils/cn";

const CLOSING_STATUSES: OrderStatus[] = ["suspendue", "annulee"];

const TONE_DOT_CLASSES: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  neutral: "bg-text-subtle",
};

export interface OrderStatusSelectorProps {
  status: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Changement de statut d'une commande parmi les 15 statuts Fildor.
 * Réutilise `ORDER_STATUS_CONFIG` (défini dans `status-badge.tsx`) — aucun
 * mapping statut → couleur dupliqué.
 */
export function OrderStatusSelector({
  status,
  onStatusChange,
  disabled,
  className,
}: OrderStatusSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex items-center gap-1.5 rounded-[var(--radius-md)] border border-border-strong bg-surface px-2 py-1.5",
            "hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700",
            className
          )}
        >
          <StatusBadge status={status} />
          <ChevronDown className="size-4 text-text-subtle" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Suivi de production</DropdownMenuLabel>
        {ORDER_STATUS_ORDER.map((option) => (
          <DropdownMenuItem key={option} onSelect={() => onStatusChange(option)}>
            <span
              className={cn("size-2 shrink-0 rounded-full", TONE_DOT_CLASSES[ORDER_STATUS_CONFIG[option].tone])}
              aria-hidden="true"
            />
            <span className="flex-1">{ORDER_STATUS_CONFIG[option].label}</span>
            {option === status ? <Check className="size-4 text-primary-700" aria-hidden="true" /> : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Autre</DropdownMenuLabel>
        {CLOSING_STATUSES.map((option) => (
          <DropdownMenuItem
            key={option}
            variant="danger"
            onSelect={() => onStatusChange(option)}
          >
            <span
              className={cn("size-2 shrink-0 rounded-full", TONE_DOT_CLASSES[ORDER_STATUS_CONFIG[option].tone])}
              aria-hidden="true"
            />
            <span className="flex-1">{ORDER_STATUS_CONFIG[option].label}</span>
            {option === status ? <Check className="size-4" aria-hidden="true" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
