import { cn } from "@/lib/utils/cn";

export interface AvatarProps {
  /** Nom complet — sert à générer les initiales et le texte alternatif. */
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
} as const;

// Paires fond/texte réutilisant uniquement les tokens sémantiques existants
// (aucune couleur en dur) pour varier visuellement les avatars sans photo.
const PALETTE = [
  "bg-primary-100 text-primary-900",
  "bg-accent-100 text-accent-700",
  "bg-info-bg text-info",
  "bg-success-bg text-success",
  "bg-warning-bg text-warning",
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
}

function paletteIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i) * (i + 1)) % PALETTE.length;
  }
  return hash;
}

/** Avatar avec repli sur initiales colorées de façon déterministe (sans photo). */
export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const initials = getInitials(name);

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- avatar générique, source arbitraire (pas toujours next/image compatible)
      <img
        src={src}
        alt={name}
        className={cn("shrink-0 rounded-full object-cover", SIZE_CLASSES[size], className)}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-medium",
        PALETTE[paletteIndex(name)],
        SIZE_CLASSES[size],
        className
      )}
    >
      {initials}
    </span>
  );
}
