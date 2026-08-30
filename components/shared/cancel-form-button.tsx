"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { ButtonWidth } from "@/components/ui/button-styles";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface CancelFormButtonBaseProps {
  /**
   * Vrai dès que l'utilisateur a saisi quelque chose. Quand c'est faux, le
   * bouton sort directement : demander confirmation sur un formulaire vide
   * apprend à l'utilisateur à cliquer « Oui » sans lire.
   */
  isDirty: boolean;
  label?: string;
  /** Ce qui sera perdu, formulé concrètement. */
  description?: string;
  fullWidth?: ButtonWidth;
  disabled?: boolean;
}

/**
 * Deux façons de sortir, jamais les deux : une page à rejoindre (`href`) ou un
 * état à refermer (`onCancel`, pour un formulaire affiché en place).
 */
export type CancelFormButtonProps = CancelFormButtonBaseProps &
  ({ href: string; onCancel?: never } | { href?: never; onCancel: () => void });

/**
 * Bouton « Annuler » d'un formulaire. Remplace les liens qui jetaient la saisie
 * sans prévenir, et les boîtes `window.confirm` du navigateur.
 */
export function CancelFormButton({
  href,
  onCancel,
  isDirty,
  label = "Annuler",
  description = "Les informations saisies ne seront pas enregistrées.",
  fullWidth = "mobile",
  disabled,
}: CancelFormButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const leave = () => (onCancel ? onCancel() : router.push(href!));

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        fullWidth={fullWidth}
        disabled={disabled}
        onClick={() => (isDirty ? setIsOpen(true) : leave())}
      >
        {label}
      </Button>

      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        tone="danger"
        title="Abandonner la saisie ?"
        description={description}
        confirmLabel="Abandonner"
        cancelLabel="Continuer la saisie"
        onConfirm={leave}
      />
    </>
  );
}
