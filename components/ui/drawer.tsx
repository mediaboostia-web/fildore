"use client";

import type { ComponentProps } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

function DrawerOverlay({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-text/45 transition-opacity duration-200",
        "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

export interface DrawerContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  /**
   * "full" (défaut) : panneau quasi plein écran sur mobile qui glisse depuis
   * le bas — utilisé pour les vues détaillées. "auto" : feuille compacte
   * ajustée au contenu — utilisée pour les menus courts (ex. MoreMenuSheet).
   */
  size?: "full" | "auto";
  hideClose?: boolean;
}

/** Panneau mobile plein écran en glissement vertical, basé sur Radix Dialog. */
export function DrawerContent({
  className,
  children,
  size = "full",
  hideClose,
  ...props
}: DrawerContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DrawerOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex flex-col border-t border-border bg-surface",
          "rounded-t-[var(--radius-xl)] shadow-md",
          "transition-transform duration-200 ease-out",
          "data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full",
          "focus:outline-none",
          size === "full" ? "top-6 sm:top-auto sm:max-h-[85vh]" : "max-h-[85vh]",
          "sm:inset-x-auto sm:left-1/2 sm:bottom-8 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:rounded-[var(--radius-lg)]",
          "data-[state=closed]:sm:translate-y-8",
          className
        )}
        {...props}
      >
        <div className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-border-strong sm:hidden" />
        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-3">{children}</div>
        {!hideClose ? (
          <DialogPrimitive.Close
            aria-label="Fermer"
            className="absolute right-4 top-4 hidden rounded-full p-1 text-text-subtle hover:bg-surface-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 sm:flex"
          >
            <X className="size-4" aria-hidden="true" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DrawerHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1 pb-3", className)} {...props} />;
}

export function DrawerTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("text-lg font-semibold text-text", className)} {...props} />;
}

export function DrawerDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-sm text-text-muted", className)} {...props} />;
}

export function DrawerFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mt-5 flex flex-col gap-2", className)} {...props} />;
}
