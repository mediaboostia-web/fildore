"use client";

import { useId, useRef, useState } from "react";
import type { DragEvent } from "react";
import { FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  label?: string;
  hint?: string;
  error?: string;
  accept?: string;
  multiple?: boolean;
  /** Taille maximale par fichier, en Mo. */
  maxSizeMb?: number;
  disabled?: boolean;
  containerClassName?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/**
 * Zone d'ajout de fichiers (glisser-déposer ou clic) : preuves de paiement,
 * pièces jointes de commande. Reste un composant "dumb" : la persistance
 * réelle des fichiers sera branchée dans une passe ultérieure.
 */
export function FileUpload({
  files,
  onFilesChange,
  label = "Fichiers",
  hint,
  error,
  accept,
  multiple = true,
  maxSizeMb = 10,
  disabled,
  containerClassName,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const maxBytes = maxSizeMb * 1024 * 1024;
    const accepted = Array.from(incoming).filter((file) => file.size <= maxBytes);
    onFilesChange(multiple ? [...files, ...accepted] : accepted.slice(0, 1));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    addFiles(event.dataTransfer.files);
  }

  function removeFile(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label ? <span className="text-sm font-medium text-text">{label}</span> : null}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-dashed px-4 py-8 text-center transition-colors",
          disabled ? "cursor-not-allowed bg-surface-muted opacity-60" : "cursor-pointer hover:bg-surface-muted",
          isDragOver ? "border-primary-700 bg-primary-50" : error ? "border-danger" : "border-border-strong"
        )}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <Upload className="size-6 text-text-subtle" aria-hidden="true" />
        <p className="text-sm text-text">
          <span className="font-medium text-primary-800">Cliquez pour ajouter</span> ou glissez vos
          fichiers ici
        </p>
        <p className="text-xs text-text-subtle">Taille maximale par fichier : {maxSizeMb} Mo</p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          onChange={(event) => addFiles(event.target.files)}
        />
      </div>
      {files.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm"
            >
              <FileText className="size-4 shrink-0 text-text-subtle" aria-hidden="true" />
              <span className="flex-1 truncate text-text">{file.name}</span>
              <span className="shrink-0 text-xs text-text-subtle">{formatFileSize(file.size)}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                aria-label={`Retirer ${file.name}`}
                className="shrink-0 rounded-full p-1 text-text-subtle hover:bg-surface-muted hover:text-danger"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : hint ? (
        <p className="text-sm text-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
