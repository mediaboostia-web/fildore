"use client";

import { Printer, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function DocumentPrintButton({
  docNumber,
  clientPhone,
}: {
  docNumber: string;
  clientPhone?: string;
}) {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: `Facture ${docNumber} — Atelier Élégance`,
          text: `Bonjour, voici le document ${docNumber} de votre commande chez Atelier Élégance.`,
          url: window.location.href,
        });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Lien du document copié dans le presse-papiers !");
      }
    } catch {
      toast.error("Partage annulé.");
    }
  };

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(
      `Bonjour, voici le lien vers votre facture/reçu ${docNumber} chez Atelier Élégance :\n${typeof window !== "undefined" ? window.location.href : ""}`
    );
    const phoneClean = clientPhone ? clientPhone.replace(/\D/g, "") : "";
    const url = phoneClean
      ? `https://wa.me/${phoneClean}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 no-print">
      <Button
        variant="whatsapp"
        size="sm"
        onClick={handleWhatsAppSend}
        icon={<MessageCircle className="size-4" />}
      >
        Envoyer WhatsApp
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleShare}
        icon={<Share2 className="size-4" />}
      >
        Partager / Lien
      </Button>
      <Button
        size="sm"
        onClick={handlePrint}
        icon={<Printer className="size-4" />}
      >
        Imprimer / PDF
      </Button>
    </div>
  );
}
