"use client";

import { useState } from "react";
import { Copy, MessageCircle, Pencil, AlertCircle } from "lucide-react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { toast } from "./toast";
import { cn } from "@/lib/utils/cn";

export interface WhatsAppMessagePreviewProps {
  recipientName: string;
  recipientPhone?: string;
  message: string;
  onMessageChange?: (value: string) => void;
  whatsappHref?: string;
  onSendClick?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function WhatsAppMessagePreview({
  recipientName,
  recipientPhone,
  message,
  onMessageChange,
  whatsappHref,
  onSendClick,
  isLoading = false,
  className,
}: WhatsAppMessagePreviewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const phoneDigits = recipientPhone ? recipientPhone.replace(/[^\d]/g, "") : "";
  const hasValidPhone = phoneDigits.length >= 8;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Message copié dans le presse-papiers !");
    } catch {
      toast.error("Le message n'a pas pu être copié. Sélectionnez-le et copiez-le à la main.");
    }
  }

  function handleOpenWhatsApp() {
    if (!hasValidPhone) {
      toast.error("Numéro de téléphone non valide pour WhatsApp.");
      return;
    }
    if (onSendClick) {
      onSendClick();
    } else if (whatsappHref) {
      window.open(whatsappHref, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className={cn("flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          Message pour <strong className="font-semibold text-text">{recipientName}</strong>
          {recipientPhone ? <span className="text-xs ml-1 text-text-subtle">({recipientPhone})</span> : null}
        </p>
        {onMessageChange ? (
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="flex items-center gap-1 text-xs font-semibold text-primary-800 hover:text-primary-950 transition-colors cursor-pointer"
          >
            <Pencil className="size-3.5" aria-hidden="true" />
            <span>{isEditing ? "Voir l'aperçu" : "Personnaliser"}</span>
          </button>
        ) : null}
      </div>

      {isEditing && onMessageChange ? (
        <Textarea
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          rows={6}
          className="text-sm font-sans"
        />
      ) : (
        <div className="rounded-2xl rounded-tl-none bg-[#E7F7EE] border border-[#25D366]/30 p-4 shadow-xs">
          <p className="whitespace-pre-wrap text-sm text-[#0B443B] leading-relaxed font-sans">{message}</p>
        </div>
      )}

      {/* Alerte si le contact n'a pas de numéro WhatsApp valide */}
      {!hasValidPhone ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-warning/40 bg-warning-bg/60 p-3 text-xs text-text">
          <AlertCircle className="size-4 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-text">Numéro de téléphone non renseigné ou non compatible WhatsApp</p>
            <p className="text-text-muted text-[11px] mt-0.5">
              Ce contact ne possède pas d&apos;identifiant WhatsApp direct. Vous pouvez copier le texte ci-dessous pour lui envoyer par SMS.
            </p>
          </div>
        </div>
      ) : null}

      {/* Boutons d'action clairs : 1 bouton WhatsApp direct + 1 bouton Copier */}
      <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <Button
          variant="whatsapp"
          size="md"
          icon={<MessageCircle className="size-4.5" />}
          onClick={handleOpenWhatsApp}
          isLoading={isLoading}
          disabled={!hasValidPhone}
          className="flex-1 justify-center"
        >
          Ouvrir dans WhatsApp
        </Button>

        <Button
          variant="secondary"
          size="md"
          icon={<Copy className="size-4" />}
          onClick={handleCopy}
          className="justify-center"
        >
          Copier le texte
        </Button>
      </div>
    </div>
  );
}
