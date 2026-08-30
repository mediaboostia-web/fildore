"use client";

import { useState, useTransition } from "react";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { WhatsAppMessagePreview } from "@/components/ui/whatsapp-message-preview";
import {
  MESSAGE_TEMPLATES,
  getMessageTemplate,
  resolveMessageTemplate,
  buildWhatsAppLink,
} from "@/features/messaging/templates";
import { logMessageAction } from "@/features/messaging/actions";
import type { MessageTemplateKey } from "@/features/messaging/types";
import type { Order } from "@/features/orders/types";
import type { Client } from "@/features/clients/types";
import { clientDisplayName } from "@/features/clients/types";
import { formatAmount } from "@/lib/money/format";
import { formatDateFr } from "@/lib/utils/dates";

interface OrderWhatsAppDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  client: Client;
  balance: number;
  paidAmount: number;
}

export function OrderWhatsAppDialog({
  isOpen,
  onClose,
  order,
  client,
  balance,
  paidAmount,
}: OrderWhatsAppDialogProps) {
  const [templateKey, setTemplateKey] = useState<MessageTemplateKey>(
    order.status === "prete"
      ? "commande_prete"
      : order.status === "essayage"
      ? "invitation_essayage"
      : balance > 0
      ? "demande_acompte"
      : "confirmation_commande"
  );
  const [customBody, setCustomBody] = useState("");
  const [isPending, startTransition] = useTransition();

  const variables = {
    prenom_client: client.firstName || "Client(e)",
    nom_client: client.lastName || "",
    reference_commande: order.reference,
    nom_commande: order.title,
    date_livraison: formatDateFr(order.deliveryDate),
    date_evenement: order.eventDate ? formatDateFr(order.eventDate) : undefined,
    montant_total: formatAmount(order.totalAmount),
    acompte: formatAmount(paidAmount || Math.round(order.totalAmount / 2)),
    solde: formatAmount(balance),
    nom_atelier: "Atelier Élégance",
    numero_atelier: "+229 97 00 00 00",
    lien_document: `https://fildor.app/c/${order.reference.toLowerCase()}`,
  };

  const currentTemplate = getMessageTemplate(templateKey);
  const resolvedDefault = resolveMessageTemplate(currentTemplate, variables);
  const activeMessage = customBody || resolvedDefault;
  const whatsappUrl = buildWhatsAppLink(client.phone, activeMessage);

  const handleTemplateChange = (key: MessageTemplateKey) => {
    setTemplateKey(key);
    const tmpl = getMessageTemplate(key);
    setCustomBody(resolveMessageTemplate(tmpl, variables));
  };

  const templateOptions = MESSAGE_TEMPLATES.map((tmpl) => ({
    value: tmpl.key,
    label: tmpl.label,
  }));

  const handleSendAndLog = () => {
    startTransition(async () => {
      await logMessageAction({
        clientId: client.id,
        orderId: order.id,
        templateKey,
        resolvedBody: activeMessage,
      });
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      onClose();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Envoyer un message WhatsApp</DialogTitle>
          <DialogDescription>
            Choisissez un modèle ou personnalisez le texte avant d&apos;ouvrir WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Select
            label="Modèle de message"
            value={templateKey}
            onChange={(e) => handleTemplateChange(e.target.value as MessageTemplateKey)}
            options={templateOptions}
          />

          <WhatsAppMessagePreview
            recipientName={clientDisplayName(client)}
            message={activeMessage}
            onMessageChange={setCustomBody}
            whatsappHref={whatsappUrl}
          />

          <div className="flex items-center justify-between border-t border-border pt-4">
            <Button variant="secondary" onClick={onClose}>
              Fermer
            </Button>
            <Button
              variant="whatsapp"
              onClick={handleSendAndLog}
              isLoading={isPending}
              icon={<ExternalLink className="size-4" />}
            >
              Envoyer & Enregistrer l&apos;envoi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
