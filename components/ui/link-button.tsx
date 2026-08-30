import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import {
  BUTTON_BASE_CLASSES,
  SIZE_CLASSES,
  VARIANT_CLASSES,
  widthClass,
} from "./button-styles";
import type { ButtonVariant, ButtonSize, ButtonWidth } from "./button-styles";
import { cn } from "@/lib/utils/cn";

export interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  /** `"mobile"` : pleine largeur sous 640 px, largeur naturelle au-dessus. */
  fullWidth?: ButtonWidth;
}

/**
 * Lien présenté comme un bouton. Rendu côté serveur : les styles viennent de
 * `button-styles.ts`, qui n'est pas un module client — importer `widthClass`
 * depuis `button.tsx` ferait échouer le build au prérendu.
 */
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
        BUTTON_BASE_CLASSES,
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        widthClass(fullWidth),
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}
