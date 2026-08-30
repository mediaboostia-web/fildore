import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Ombre légère pour indiquer un élément interactif (ex. carte cliquable). */
  elevated?: boolean;
  padding?: "none" | "sm" | "md";
}

const PADDING_CLASSES = {
  none: "",
  sm: "p-3",
  md: "p-4",
} as const;

/** Conteneur de base pour une entité autonome (commande, client, facture). */
export function Card({ className, elevated = false, padding = "md", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-surface",
        elevated && "shadow-[0_1px_2px_rgba(27,36,34,0.06),0_1px_1px_rgba(27,36,34,0.04)]",
        PADDING_CLASSES[padding],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold text-text", className)} {...props} />;
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-text-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-3", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 flex items-center gap-2 border-t border-border pt-3", className)}
      {...props}
    />
  );
}

export function CardAction({ children }: { children: ReactNode }) {
  return <div className="ml-auto flex items-center gap-2">{children}</div>;
}
