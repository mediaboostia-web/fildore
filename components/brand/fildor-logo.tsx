import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/**
 * Point d'entrée unique de la marque dans l'interface. Les fichiers pointés
 * vivent dans `public/brand/` et sont régénérés par
 * `node scripts/brand/build-brand-assets.js` — ne jamais réimporter le PNG
 * source (2816 × 1584) pour afficher une icône de 32 px.
 *
 * - `variant="mark"`   : le symbole seul (barre latérale, favicon, avatar).
 * - `variant="lockup"` : symbole + logotype (navigation, pied de page, documents).
 * - `tone="white"`     : version renversée, pour un fond encre ou une photo.
 */
export interface FildorLogoProps {
  variant?: "mark" | "lockup";
  tone?: "color" | "white";
  /** Hauteur de rendu en pixels ; la largeur suit le ratio du fichier. */
  height?: number;
  className?: string;
  priority?: boolean;
}

/** Ratios largeur/hauteur des fichiers générés, pour réserver la bonne place. */
const RATIO = { mark: 580 / 562, lockup: 1748 / 562 } as const;

const SRC = {
  mark: { color: "/brand/logo/fildor-mark.svg", white: "/brand/logo/fildor-mark-white.svg" },
  lockup: { color: "/brand/logo/fildor-logo.svg", white: "/brand/logo/fildor-logo-white.svg" },
} as const;

export function FildorLogo({
  variant = "mark",
  tone = "color",
  height = 32,
  className,
  priority = false,
}: FildorLogoProps) {
  const width = Math.round(height * RATIO[variant]);

  return (
    <Image
      src={SRC[variant][tone]}
      alt={variant === "mark" ? "Fildor" : "Fildor"}
      width={width}
      height={height}
      className={cn("object-contain", className)}
      priority={priority}
    />
  );
}
