"use client";

import { useMemo, useState, useTransition } from "react";
import { AlertTriangle } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { CurrencyInput } from "@/components/ui/currency-input";
import { WhatsAppMessagePreview } from "@/components/ui/whatsapp-message-preview";
import {
  MESSAGE_TEMPLATES,
  getMessageTemplate,
  resolveMessageTemplate,
  buildWhatsAppLink,
} from "@/features/messaging/templates";
import { logMessageAction } from "@/features/messaging/actions";
import type {
  MessageTemplateKey,
  MessagingClient,
  MessagingOrder,
  MessagingWorkshop,
} from "@/features/messaging/types";
import { formatAmount } from "@/lib/money/format";
import { formatDateFr } from "@/lib/utils/dates";
import { formatPhoneDisplay } from "@/lib/utils/phone";

export interface MessagesHubClientProps {
  clients: MessagingClient[];
  orders: MessagingOrder[];
  workshop: MessagingWorkshop;
  /** Client présélectionné via `?client=`, depuis une fiche ou une notification. */
  initialClientId?: string;
  /** Commande présélectionnée via `?commande=`. */
  initialOrderId?: string;
  /** Modèle de message présélectionné via `?modele=`. */
  initialTemplateKey?: MessageTemplateKey;
}

function displayName(client: MessagingClient): string {
  return `${client.firstName} ${client.lastName}`.trim();
}

export function MessagesHubClient({
  clients,
  orders,
  workshop,
  initialClientId,
  initialOrderId,
  initialTemplateKey,
}: MessagesHubClientProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>(
    initialClientId || clients[0]?.id || ""
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string>(initialOrderId || "");
  const [templateKey, setTemplateKey] = useState<MessageTemplateKey>(
    initialTemplateKey || "confirmation_commande"
  );
  const [customBody, setCustomBody] = useState("");
  const [depositOverride, setDepositOverride] = useState<{
    orderId: string;
    amount: number;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // Les commandes proposées sont TOUJOURS celles du client sélectionné.
  // `orders.find(...)` cherchait auparavant dans toutes les commandes de
  // l'atelier : un identifiant resté d'une sélection précédente affichait la
  // commande d'un autre client, et ses montants avec.
  const clientOrders = useMemo(
    () => orders.filter((order) => order.clientId === selectedClientId),
    [orders, selectedClientId]
  );

  const selectedOrder =
    clientOrders.find((order) => order.id === selectedOrderId) ?? clientOrders[0];

  // L'acompte réellement encaissé sert de proposition ; sinon l'atelier saisit
  // le montant qu'il demande. Aucun « moitié du total » calculé au passage.
  //
  // La saisie est mémorisée avec l'identifiant de la commande, ce qui la remet
  // seule à la bonne valeur quand on change de commande — sans effet qui
  // resynchronise un état (interdit par `react-hooks/set-state-in-effect`).
  const recordedDeposit = selectedOrder?.recordedDepositAmount;
  const requestedDeposit =
    depositOverride && depositOverride.orderId === (selectedOrder?.id ?? "")
      ? depositOverride.amount
      : (recordedDeposit ?? 0);

  const documentUrl =
    selectedOrder?.documentSharePath && typeof window !== "undefined"
      ? `${window.location.origin}${selectedOrder.documentSharePath}`
      : "";

  const variables = {
    prenom_client: selectedClient?.firstName ?? "",
    nom_client: selectedClient ? displayName(selectedClient) : "",
    reference_commande: selectedOrder?.reference ?? "",
    nom_commande: selectedOrder?.title ?? "",
    date_livraison: selectedOrder ? formatDateFr(selectedOrder.deliveryDate) : "",
    date_evenement: selectedOrder?.eventDate ? formatDateFr(selectedOrder.eventDate) : "",
    montant_total: selectedOrder ? formatAmount(selectedOrder.totalAmount) : "",
    acompte: requestedDeposit > 0 ? formatAmount(requestedDeposit) : "",
    // Le solde vient du serveur (total − remise − encaissé). Il valait
    // auparavant le total : un client ayant versé un acompte était relancé pour
    // la somme entière.
    solde: selectedOrder ? formatAmount(selectedOrder.balance) : "",
    nom_atelier: workshop.name,
    numero_atelier: formatPhoneDisplay(workshop.whatsappPhone),
    lien_document: documentUrl,
  };

  const currentTemplate = getMessageTemplate(templateKey);
  const resolvedDefault = resolveMessageTemplate(currentTemplate, variables);
  const activeMessage = customBody || resolvedDefault;
  const whatsappUrl = selectedClient ? buildWhatsAppLink(selectedClient.phone, activeMessage) : "#";

  const usesDeposit = currentTemplate.body.includes("{acompte}");
  const usesDocumentLink = currentTemplate.body.includes("{lien_document}");

  const handleTemplateChange = (key: MessageTemplateKey) => {
    setTemplateKey(key);
    setCustomBody("");
  };

  const handleClientChange = (id: string) => {
    setSelectedClientId(id);
    setSelectedOrderId("");
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
    label: displayName(c),
    description: formatPhoneDisplay(c.phone),
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
    <div className="grid gap-6 rounded-2xl border border-border bg-surface p-5 shadow-xs sm:p-6 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-5">
        <h2 className="text-base font-bold text-text">Préparer une relance</h2>

        <Combobox
          label="Client"
          required
          value={selectedClientId}
          onChange={handleClientChange}
          options={clientOptions}
          placeholder="Choisir un client"
          searchPlaceholder="Nom ou numéro"
          emptyMessage="Aucun client ne correspond"
        />

        {clientOrders.length > 0 ? (
          <Select
            label="Commande concernée"
            value={selectedOrder?.id ?? ""}
            onChange={(e) => {
              setSelectedOrderId(e.target.value);
              setCustomBody("");
            }}
            options={orderOptions}
            hint={
              selectedOrder && selectedOrder.balance > 0
                ? `Solde restant : ${formatAmount(selectedOrder.balance)}`
                : selectedOrder
                  ? "Cette commande est soldée."
                  : undefined
            }
          />
        ) : selectedClient ? (
          <p className="rounded-[var(--radius-md)] border border-border bg-surface-muted p-3 text-sm text-text-muted">
            {displayName(selectedClient)} n&apos;a aucune commande enregistrée. Les variables liées
            à une commande seront retirées du message.
          </p>
        ) : null}

        <Select
          label="Modèle de message"
          required
          value={templateKey}
          onChange={(e) => handleTemplateChange(e.target.value as MessageTemplateKey)}
          options={templateOptions}
        />

        {usesDeposit ? (
          <CurrencyInput
            label="Acompte demandé"
            value={requestedDeposit}
            onChange={(value) => {
              setDepositOverride({ orderId: selectedOrder?.id ?? "", amount: value });
              setCustomBody("");
            }}
            hint={
              recordedDeposit
                ? "Montant de l'acompte déjà encaissé. Modifiez-le si vous demandez autre chose."
                : "À vous de fixer le montant : Fildor n'en invente aucun."
            }
          />
        ) : null}

        {usesDeposit && requestedDeposit <= 0 ? (
          <p className="flex items-start gap-2 rounded-[var(--radius-md)] border border-warning/30 bg-warning-bg p-3 text-xs text-warning">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Indiquez le montant de l&apos;acompte : sans lui, la phrase correspondante est retirée
            du message.
          </p>
        ) : null}

        {usesDocumentLink && !documentUrl ? (
          <p className="flex items-start gap-2 rounded-[var(--radius-md)] border border-border bg-surface-muted p-3 text-xs text-text-muted">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Aucun document partagé pour cette commande. Ouvrez le document et cliquez « Partager au
            client » pour obtenir un lien, sinon la phrase est retirée du message.
          </p>
        ) : null}
      </div>

      <div className="space-y-4 lg:col-span-7">
        <h2 className="text-base font-bold text-text">Aperçu et envoi</h2>

        {selectedClient ? (
          <WhatsAppMessagePreview
            recipientName={displayName(selectedClient)}
            recipientPhone={formatPhoneDisplay(selectedClient.phone)}
            message={activeMessage}
            onMessageChange={setCustomBody}
            whatsappHref={whatsappUrl}
            onSendClick={handleSend}
            isLoading={isPending}
          />
        ) : (
          <p className="text-sm text-text-muted">
            Choisissez un client pour préparer le message.
          </p>
        )}
      </div>
    </div>
  );
}
