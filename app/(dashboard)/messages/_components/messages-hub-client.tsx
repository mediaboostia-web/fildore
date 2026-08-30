"use client";

import { useState, useTransition } from "react";
import { Select } from "@/components/ui/select";
import { WhatsAppMessagePreview } from "@/components/ui/whatsapp-message-preview";
import {
  MESSAGE_TEMPLATES,
  getMessageTemplate,
  resolveMessageTemplate,
  buildWhatsAppLink,
} from "@/features/messaging/templates";
import { logMessageAction } from "@/features/messaging/actions";
import type { MessageTemplateKey } from "@/features/messaging/types";
import type { Client } from "@/features/clients/types";
import type { Order } from "@/features/orders/types";
import { clientDisplayName } from "@/features/clients/types";
import { formatAmount } from "@/lib/money/format";
import { formatDateFr } from "@/lib/utils/dates";
import { formatPhoneDisplay } from "@/lib/utils/phone";

export function MessagesHubClient({
  clients,
  orders,
}: {
  clients: Client[];
  orders: Order[];
}) {
  const [selectedClientId, setSelectedClientId] = useState<string>(
    clients[0]?.id || ""
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [templateKey, setTemplateKey] = useState<MessageTemplateKey>("confirmation_commande");
  const [customBody, setCustomBody] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];
  const clientOrders = orders.filter((o) => o.clientId === selectedClientId);
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || clientOrders[0];

  const variables = {
    prenom_client: selectedClient?.firstName || "Client(e)",
    nom_client: selectedClient?.lastName || "",
    reference_commande: selectedOrder?.reference || "FIL-CTN-000000",
    nom_commande: selectedOrder?.title || "Confection sur mesure",
    date_livraison: selectedOrder ? formatDateFr(selectedOrder.deliveryDate) : "dans 7 jours",
    date_evenement: selectedOrder?.eventDate ? formatDateFr(selectedOrder.eventDate) : undefined,
    montant_total: selectedOrder ? formatAmount(selectedOrder.totalAmount) : "35 000 FCFA",
    acompte: selectedOrder ? formatAmount(Math.round(selectedOrder.totalAmount / 2)) : "15 000 FCFA",
    solde: selectedOrder ? formatAmount(selectedOrder.totalAmount) : "20 000 FCFA",
    nom_atelier: "Atelier Élégance",
    numero_atelier: "+229 97 00 00 00",
    lien_document: selectedOrder
      ? `https://fildor.app/c/${selectedOrder.reference.toLowerCase()}`
      : "https://fildor.app/c/devis",
  };

  const currentTemplate = getMessageTemplate(templateKey);
  const resolvedDefault = resolveMessageTemplate(currentTemplate, variables);
  const activeMessage = customBody || resolvedDefault;
  const whatsappUrl = selectedClient
    ? buildWhatsAppLink(selectedClient.phone, activeMessage)
    : "#";

  const handleTemplateChange = (key: MessageTemplateKey) => {
    setTemplateKey(key);
    const tmpl = getMessageTemplate(key);
    setCustomBody(resolveMessageTemplate(tmpl, variables));
  };

  const handleClientChange = (id: string) => {
    setSelectedClientId(id);
    const firstOrder = orders.find((o) => o.clientId === id);
    setSelectedOrderId(firstOrder ? firstOrder.id : "");
    setCustomBody("");
  };

  const handleSend = () => {
    if (!selectedClient) return;

    startTransition(async () => {
      await logMessageAction({
        clientId: selectedClient.id,
        orderId: selectedOrder?.id,
        templateKey,
        resolvedBody: activeMessage,
      });
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  };

  const clientOptions = clients.map((c) => ({
    value: c.id,
    label: `${clientDisplayName(c)} (${formatPhoneDisplay(c.phone)})`,
  }));

  const orderOptions = clientOrders.map((o) => ({
    value: o.id,
    label: `${o.reference} — ${o.title}`,
  }));

  const templateOptions = MESSAGE_TEMPLATES.map((tmpl) => ({
    value: tmpl.key,
    label: tmpl.label,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-12 rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs">
      {/* Colonne configuration */}
      <div className="space-y-4 lg:col-span-5">
        <h2 className="font-bold text-base text-text">Préparer une communication</h2>

        <Select
          label="Destinataire (Client) *"
          value={selectedClientId}
          onChange={(e) => handleClientChange(e.target.value)}
          options={clientOptions}
        />

        {clientOrders.length > 0 && (
          <Select
            label="Commande associée"
            value={selectedOrderId || clientOrders[0]?.id}
            onChange={(e) => {
              setSelectedOrderId(e.target.value);
              setCustomBody("");
            }}
            options={orderOptions}
          />
        )}

        <Select
          label="Modèle de message *"
          value={templateKey}
          onChange={(e) => handleTemplateChange(e.target.value as MessageTemplateKey)}
          options={templateOptions}
        />
      </div>

      {/* Colonne prévisualisation */}
      <div className="space-y-4 lg:col-span-7">
        <h2 className="font-bold text-base text-text">Aperçu & Envoi direct</h2>

        {selectedClient ? (
          <WhatsAppMessagePreview
            recipientName={clientDisplayName(selectedClient)}
            recipientPhone={formatPhoneDisplay(selectedClient.phone)}
            message={activeMessage}
            onMessageChange={setCustomBody}
            whatsappHref={whatsappUrl}
            onSendClick={handleSend}
            isLoading={isPending}
          />
        ) : (
          <p className="text-sm text-text-muted">Sélectionnez un client pour voir l&apos;aperçu.</p>
        )}
      </div>
    </div>
  );
}
