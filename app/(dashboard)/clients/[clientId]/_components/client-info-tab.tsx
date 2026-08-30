"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import type { Client } from "@/features/clients/types";
import { ClientForm } from "../../_components/client-form";

/**
 * Onglet "Infos" de la fiche client : vue lecture par défaut, bascule vers le
 * même `ClientForm` que la création (mode "edit") au clic sur "Modifier" —
 * pas de deuxième formulaire à maintenir en parallèle.
 */
export function ClientInfoTab({ client }: { client: Client }) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  if (isEditing) {
    return (
      <Card>
        <ClientForm
          mode="edit"
          client={client}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => {
            toast.success("Client mis à jour");
            setIsEditing(false);
            router.refresh();
          }}
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <dl className="flex flex-1 flex-col gap-3 text-sm">
          <div>
            <dt className="text-text-subtle">Téléphone</dt>
            <dd className="text-text">{formatPhoneDisplay(client.phone)}</dd>
          </div>
          <div>
            <dt className="text-text-subtle">Ville</dt>
            <dd className="text-text">{client.city}</dd>
          </div>
          {client.district ? (
            <div>
              <dt className="text-text-subtle">Quartier</dt>
              <dd className="text-text">{client.district}</dd>
            </div>
          ) : null}
          {client.address ? (
            <div>
              <dt className="text-text-subtle">Adresse</dt>
              <dd className="text-text">{client.address}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-text-subtle">Notes</dt>
            <dd className="text-text">{client.notes || "Aucune note pour ce client."}</dd>
          </div>
        </dl>
        <Button
          variant="secondary"
          size="sm"
          icon={<Pencil className="size-4" aria-hidden="true" />}
          onClick={() => setIsEditing(true)}
        >
          Modifier
        </Button>
      </div>
    </Card>
  );
}
