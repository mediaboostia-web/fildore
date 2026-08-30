"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  MessageCircle,
  FileText,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { OrderStatusSelector } from "@/components/ui/order-status-selector";
import { RoleGate } from "@/components/shared/role-gate";
import { updateOrderStatusAction } from "@/features/orders/actions";
import type { Order, OrderStatus } from "@/features/orders/types";
import type { Client } from "@/features/clients/types";
import type { Role } from "@/features/auth/types";
import { RecordPaymentDialog } from "./record-payment-dialog";
import { OrderWhatsAppDialog } from "./order-whatsapp-dialog";
import { OrderCancelDialog } from "./order-cancel-dialog";

/** Annulation réservée aux propriétaires (voir la même règle server-side dans cancelOrderAction). */
const CANCEL_ORDER_ROLES: Role[] = ["owner"];

interface OrderActionsBarProps {
  order: Order;
  client: Client;
  balance: number;
  paidAmount: number;
  currentUserRole: Role | null | undefined;
}

export function OrderActionsBar({ order, client, balance, paidAmount, currentUserRole }: OrderActionsBarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (newStatus === "annulee") {
      setIsCancelOpen(true);
      return;
    }

    startTransition(async () => {
      await updateOrderStatusAction({ orderId: order.id, status: newStatus });
      router.refresh();
    });
  };

  const isCancelled = order.status === "annulee";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Statut actuel :
          </span>
          <OrderStatusSelector
            status={order.status}
            onStatusChange={handleStatusChange}
            disabled={isPending || isCancelled}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {balance > 0 && !isCancelled && (
            <Button
              size="sm"
              onClick={() => setIsPaymentOpen(true)}
              icon={<CreditCard className="size-4" />}
            >
              Encaisser un acompte / solde
            </Button>
          )}

          <Button
            size="sm"
            variant="whatsapp"
            onClick={() => setIsWhatsAppOpen(true)}
            icon={<MessageCircle className="size-4" />}
          >
            WhatsApp
          </Button>

          <LinkButton
            href={`/factures?orderId=${order.id}`}
            variant="secondary"
            size="sm"
            icon={<FileText className="size-4" />}
          >
            Documents
          </LinkButton>

          {!isCancelled && (
            <RoleGate allow={CANCEL_ORDER_ROLES} role={currentUserRole}>
              <Button
                size="sm"
                variant="tertiary"
                onClick={() => setIsCancelOpen(true)}
                className="text-text-muted hover:text-danger"
                icon={<XCircle className="size-4" />}
              >
                Annuler
              </Button>
            </RoleGate>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <RecordPaymentDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        orderId={order.id}
        clientId={client.id}
        balance={balance}
      />

      <OrderWhatsAppDialog
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        order={order}
        client={client}
        balance={balance}
        paidAmount={paidAmount}
      />

      <OrderCancelDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        orderId={order.id}
        reference={order.reference}
      />
    </>
  );
}
