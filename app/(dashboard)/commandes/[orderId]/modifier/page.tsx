import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { LinkButton } from "@/components/ui/link-button";
import { getOrderById } from "@/lib/mock-data/orders";
import { getClientById } from "@/lib/mock-data/clients";
import { clientDisplayName } from "@/features/clients/types";
import { OrderEditForm } from "./_components/order-edit-form";

export default async function OrderEditPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);
  if (!order) notFound();

  const client = await getClientById(order.clientId);
  if (!client) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <LinkButton
          href={`/commandes/${order.id}`}
          variant="tertiary"
          size="sm"
          icon={<ArrowLeft className="size-4 mr-1" />}
        >
          Retour à la commande {order.reference}
        </LinkButton>
      </div>

      <PageHeader
        title={`Modifier ${order.reference}`}
        description={`Client : ${clientDisplayName(client)}`}
      />

      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <OrderEditForm order={order} />
      </div>
    </div>
  );
}
