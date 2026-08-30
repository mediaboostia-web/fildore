"use client";

import type { ComponentProps } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

/**
 * Dropdown fluide inspiré de Smooth Dropdown :
 * Animations douces, angles arrondis 2xl, verre dépoli et retour visuel soigné.
 */
export function DropdownMenuContent({
  className,
  sideOffset = 8,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-52 rounded-2xl border border-border/80 bg-surface/98 p-1.5 shadow-2xl backdrop-blur-lg",
          "animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 duration-150 ease-out",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "danger";
}) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium outline-none transition-colors select-none",
        "data-[highlighted]:bg-surface-muted data-[highlighted]:text-primary-950",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset && "pl-8",
        variant === "danger" ? "text-danger data-[highlighted]:bg-danger-bg data-[highlighted]:text-danger" : "text-text",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-xl py-2 pl-8 pr-3 text-sm font-medium text-text outline-none transition-colors select-none",
        "data-[highlighted]:bg-surface-muted data-[highlighted]:text-primary-950",
        className
      )}
      {...props}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="size-4 text-primary-700" aria-hidden="true" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-text-subtle select-none",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("my-1 h-px bg-border/80", className)}
      {...props}
    />
  );
}

export function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-text outline-none transition-colors select-none",
        "data-[highlighted]:bg-surface-muted data-[state=open]:bg-surface-muted",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto size-4 text-text-subtle" aria-hidden="true" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

export function DropdownMenuSubContent({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        className={cn(
          "z-50 min-w-48 rounded-2xl border border-border/80 bg-surface/98 p-1.5 shadow-2xl backdrop-blur-lg",
          "animate-in fade-in zoom-in-95 duration-150 ease-out",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}
