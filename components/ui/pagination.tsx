"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface PaginationProps {
  /** Page courante, 1-indexée. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Pagination compacte ("Page X sur Y") adaptée au mobile. */
export function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  if (pageCount <= 1) return null;

  const canGoPrevious = page > 1;
  const canGoNext = page < pageCount;

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <button
        type="button"
        disabled={!canGoPrevious}
        onClick={() => onPageChange(page - 1)}
        className={cn(
          "flex h-10 items-center gap-1.5 rounded-[var(--radius-md)] border border-border-strong bg-surface px-3 text-sm font-medium text-text",
          "hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Précédent
      </button>
      <p className="text-sm text-text-muted">
        Page {page} sur {pageCount}
      </p>
      <button
        type="button"
        disabled={!canGoNext}
        onClick={() => onPageChange(page + 1)}
        className={cn(
          "flex h-10 items-center gap-1.5 rounded-[var(--radius-md)] border border-border-strong bg-surface px-3 text-sm font-medium text-text",
          "hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        Suivant
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
