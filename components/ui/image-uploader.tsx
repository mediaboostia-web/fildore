"use client";

import { useEffect, useMemo, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ImageUploaderProps {
  images: File[];
  onImagesChange: (files: File[]) => void;
  label?: string;
  hint?: string;
  error?: string;
  /** Nombre maximal de photos (modèle, tissu, réalisation). Défaut : 6. */
  maxImages?: number;
  disabled?: boolean;
  containerClassName?: string;
}

/**
 * Grille de photos avec aperçu (modèles, tissus, réalisations).
 * Compression et recadrage seront ajoutés lors du branchement au stockage réel.
 */
export function ImageUploader({
  images,
  onImagesChange,
  label = "Photos",
  hint,
  error,
  maxImages = 6,
  disabled,
  containerClassName,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Les URLs d'aperçu sont dérivées directement des fichiers (pas d'état à
  // resynchroniser) ; l'effet ne sert qu'à libérer la mémoire des blobs créés.
  const previewUrls = useMemo(() => images.map((file) => URL.createObjectURL(file)), [images]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  function handleAdd(fileList: FileList | null) {
    if (!fileList) return;
    const remaining = Math.max(0, maxImages - images.length);
    onImagesChange([...images, ...Array.from(fileList).slice(0, remaining)]);
  }

  function removeImage(index: number) {
    onImagesChange(images.filter((_, i) => i !== index));
  }

  const canAddMore = images.length < maxImages;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label ? <span className="text-sm font-medium text-text">{label}</span> : null}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {images.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface-muted"
          >
            {previewUrls[index] ? (
              // eslint-disable-next-line @next/next/no-img-element -- aperçu local (blob:), next/image ne gère pas les URLs objet
              <img
                src={previewUrls[index]}
                alt={`Photo ${index + 1}`}
                className="h-full w-full object-cover"
              />
            ) : null}
            <button
              type="button"
              onClick={() => removeImage(index)}
              aria-label={`Retirer la photo ${index + 1}`}
              className="absolute right-1 top-1 rounded-full bg-text/70 p-1 text-white hover:bg-danger"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
        {canAddMore ? (
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-dashed text-text-subtle transition-colors",
              disabled ? "cursor-not-allowed opacity-60" : "hover:border-primary-700 hover:text-primary-800",
              error ? "border-danger" : "border-border-strong"
            )}
          >
            <ImagePlus className="size-5" aria-hidden="true" />
            <span className="text-xs">Ajouter</span>
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={disabled}
        className="hidden"
        onChange={(event) => {
          handleAdd(event.target.files);
          event.target.value = "";
        }}
      />
      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : hint ? (
        <p className="text-sm text-text-muted">{hint}</p>
      ) : (
        <p className="text-xs text-text-subtle">
          {images.length} / {maxImages} photo{maxImages > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
