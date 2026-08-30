import Image from "next/image";
import { Scissors } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ModelPhotoProps {
  /** Photo du modèle. Absente = emplacement sobre, jamais une image d'emprunt. */
  src?: string;
  alt: string;
  /** Libellé de catégorie affiché en pastille sur la photo. */
  category?: string;
  className?: string;
  /** `sizes` de `next/image`, pour les photos servies depuis un chemin. */
  sizes?: string;
  priority?: boolean;
}

/**
 * Photo d'un modèle du catalogue.
 *
 * Deux cas, un seul composant :
 * - **photo téléversée** (`data:image/…`) → balise `<img>`. `next/image`
 *   n'optimise pas les URL de données et échouerait au build ;
 * - **chemin de fichier** (`/images/…`) → `next/image`, qui les optimise.
 *
 * Sans photo, on affiche un emplacement neutre. On n'affiche **jamais** une
 * photo de banque d'images à la place : un atelier doit reconnaître ses propres
 * créations dans son catalogue.
 */
export function ModelPhoto({
  src,
  alt,
  category,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  priority,
}: ModelPhotoProps) {
  const isUploaded = src?.startsWith("data:");

  return (
    <div className={cn("relative overflow-hidden bg-surface-muted", className)}>
      {src ? (
        isUploaded ? (
          // eslint-disable-next-line @next/next/no-img-element -- photo téléversée en data: URL, hors du domaine de next/image
          <img src={src} alt={alt} className="h-full w-full object-cover object-top" />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover object-top"
          />
        )
      ) : (
        <div
          role="img"
          aria-label={`${alt} — aucune photo`}
          className="flex h-full w-full flex-col items-center justify-center gap-2 border-b border-border bg-primary-50 p-4 text-center"
        >
          <div className="flex size-11 items-center justify-center rounded-full bg-surface text-primary-900 shadow-xs">
            <Scissors className="size-5" aria-hidden="true" />
          </div>
          <span className="text-[11px] font-semibold text-text-muted">Photo à ajouter</span>
        </div>
      )}

      {category ? (
        <span className="absolute left-3 top-3 rounded-full bg-primary-950/90 px-2.5 py-1 text-[11px] font-bold text-white">
          {category}
        </span>
      ) : null}
    </div>
  );
}
