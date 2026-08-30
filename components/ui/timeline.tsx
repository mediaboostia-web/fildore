import type { ReactNode } from "react";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  /** Date/heure déjà formatée par l'appelant (ex. "28 août à 14:32"). */
  timestamp: string;
  icon?: ReactNode;
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

/** Historique chronologique (changements de statut, paiements, messages envoyés). */
export function Timeline({ events, className }: TimelineProps) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <li key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-900">
                {event.icon ?? <Circle className="size-2.5 fill-current" aria-hidden="true" />}
              </span>
              {!isLast ? <span aria-hidden="true" className="w-px flex-1 bg-border" /> : null}
            </div>
            <div className={cn("flex flex-col gap-0.5", isLast ? "pb-0" : "pb-5")}>
              <p className="text-sm font-medium text-text">{event.title}</p>
              {event.description ? (
                <p className="text-sm text-text-muted">{event.description}</p>
              ) : null}
              <p className="text-xs text-text-subtle">{event.timestamp}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
