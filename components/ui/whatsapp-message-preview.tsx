"use client";

import { useState } from "react";
import { Copy, MessageCircle, Pencil } from "lucide-react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { toast } from "./toast";
import { cn } from "@/lib/utils/cn";

export interface WhatsAppMessagePreviewProps {
  recipientName: string;
  message: string;
  /** Si fourni, le message reste modifiable avant envoi (PROJECT_RULES.md §6 "Messagerie"). */
  onMessageChange?: (value: string) => void;
  /** Lien wa.me pré-construit par l'appelant (numéro + message déjà résolus). */
  whatsappHref?: string;
  className?: string;
}

/**
 * Aperçu d'un message WhatsApp préparé pour un client. Reste un composant
 * de présentation : la résolution des variables et la journalisation de
 * l'envoi seront branchées sur les vraies données de commande plus tard.
 */
export function WhatsAppMessagePreview({
  recipientName,
  message,
  onMessageChange,
  whatsappHref,
  className,
}: WhatsAppMessagePreviewProps) {
  const [isEditing, setIsEditing] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Message copié");
    } catch {
      toast.error("Impossible de copier le message");
    }
  }

  return (
    <div className={cn("flex flex-col gap-2 rounded-[var(--radius-lg)] border border-border bg-surface p-4", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          Aperçu du message à <span className="font-medium text-text">{recipientName}</span>
        </p>
        {onMessageChange ? (
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="flex items-center gap-1 text-sm font-medium text-primary-800 hover:text-primary-900"
          >
            <Pencil className="size-3.5" aria-hidden="true" />
            {isEditing ? "Aperçu" : "Modifier"}
          </button>
        ) : null}
      </div>

      {isEditing && onMessageChange ? (
        <Textarea
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          rows={5}
        />
      ) : (
        // Fond bulle vert clair WhatsApp — reproduit l'apparence réelle de l'app cible
        // (pas une couleur d'interface Fildor), même exception que WHATSAPP_GREEN dans button.tsx.
        <div className="rounded-[var(--radius-md)] rounded-tl-none bg-[#DCF8C6] p-3">
          <p className="whitespace-pre-wrap text-sm text-text">{message}</p>
        </div>
      )}

      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <Button variant="secondary" size="sm" icon={<Copy className="size-4" />} onClick={handleCopy}>
          Copier le message
        </Button>
        {whatsappHref ? (
          <Button
            variant="whatsapp"
            size="sm"
            icon={<MessageCircle className="size-4" />}
            onClick={() => window.open(whatsappHref, "_blank", "noopener,noreferrer")}
          >
            Ouvrir dans WhatsApp
          </Button>
        ) : null}
      </div>
    </div>
  );
}
