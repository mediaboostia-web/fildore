"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "./button";

/** Côté le plus long après redimensionnement. Suffisant pour une fiche modèle et un catalogue public. */
const MAX_EDGE_PX = 1280;
const JPEG_QUALITY = 0.75;
/** Plafond de sécurité, aligné sur la validation serveur. */
export const MAX_PHOTO_BYTES = 400 * 1024;

export interface PhotoFieldProps {
  /** Photo actuelle : `data:image/…` téléversée, ou vide. */
  value: string;
  onChange: (next: string) => void;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Compresse la photo **dans le navigateur** avant de l'envoyer.
 *
 * Une photo prise au téléphone pèse 3 à 5 Mo. Sur une connexion mobile
 * béninoise, l'envoyer telle quelle prend des dizaines de secondes et le
 * couturier croit que l'application a planté. Redimensionnée à 1280 px et
 * réencodée en JPEG, elle tombe autour de 150 ko sans perte visible à l'écran.
 */
async function compressImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("lecture impossible"));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image illisible"));
    img.src = dataUrl;
  });

  const scale = Math.min(1, MAX_EDGE_PX / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas indisponible");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export function PhotoField({
  value,
  onChange,
  label = "Photo",
  hint,
  error,
  disabled,
  className,
}: PhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState("");

  const message = error || localError;

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setLocalError("");

    if (!file.type.startsWith("image/")) {
      setLocalError("Choisissez une photo (JPG, PNG ou HEIC).");
      return;
    }

    setIsProcessing(true);
    try {
      const compressed = await compressImage(file);
      if (compressed.length > MAX_PHOTO_BYTES) {
        setLocalError("Cette photo reste trop lourde. Essayez une photo moins détaillée.");
        return;
      }
      onChange(compressed);
    } catch {
      setLocalError("La photo n'a pas pu être préparée. Réessayez avec une autre photo.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="block text-xs font-semibold text-text">{label}</span>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div
          className={cn(
            "relative flex aspect-4/3 w-full shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border bg-surface-muted sm:w-44",
            message ? "border-danger" : "border-border"
          )}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- aperçu local en data: URL
            <img src={value} alt="Aperçu de la photo" className="h-full w-full object-cover" />
          ) : (
            <span className="px-3 text-center text-xs text-text-subtle">Aucune photo</span>
          )}

          {isProcessing ? (
            <div className="absolute inset-0 flex items-center justify-center bg-surface/80">
              <Loader2 className="size-5 animate-spin text-primary-800" aria-hidden="true" />
            </div>
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-2">
          <Button
            type="button"
            variant="secondary"
            fullWidth="mobile"
            disabled={disabled || isProcessing}
            onClick={() => inputRef.current?.click()}
            icon={<ImagePlus className="size-4" />}
          >
            {value ? "Changer la photo" : "Ajouter une photo"}
          </Button>

          {value ? (
            <Button
              type="button"
              variant="tertiary"
              fullWidth="mobile"
              disabled={disabled || isProcessing}
              onClick={() => {
                onChange("");
                setLocalError("");
              }}
              icon={<Trash2 className="size-4" />}
            >
              Retirer la photo
            </Button>
          ) : null}

          {message ? (
            <p className="text-xs text-danger" role="alert">
              {message}
            </p>
          ) : (
            <p className="text-xs text-text-muted">
              {hint ??
                "Prenez la photo à la lumière du jour. Elle est réduite automatiquement avant l'envoi."}
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          void handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </div>
  );
}
