import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { VARIANT_CLASSES, SIZE_CLASSES } from "./button";
import type { ButtonVariant, ButtonSize } from "./button";
import { cn } from "@/lib/utils/cn";

export interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function LinkButton({
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium tracking-tight select-none",
        "transition-all duration-150 ease-out cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}
