"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { generateDocumentAction } from "@/features/invoices/actions";
import {
  MANUAL_DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  type ManualDocumentType,
  type WorkshopDocument,
} from "@/features/invoices/types";

export interface OrderDocumentMenuProps {
  orderId: string;
  /** Documents déjà émis, pour griser ceux qu'on ne peut créer qu'une fois. */
  existingDocuments: WorkshopDocument[];
}

/**
 * Création des documents d'une commande : devis, bon de commande, reçu
 * d'acompte, facture, bon de livraison. Le reçu de paiement n'est pas proposé —
 * il s'émet tout seul à chaque encaissement.
 */
export function OrderDocumentMenu({ orderId, existingDocuments }: OrderDocumentMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const issuedInvoice = existingDocuments.find((document) => document.type === "facture");

  const handleCreate = (type: ManualDocumentType) => {
    startTransition(async () => {
      const res = await generateDocumentAction({ orderId, type });

      if (res.success && res.data) {
        toast.success(`${DOCUMENT_TYPE_LABELS[type]} ${res.data.number} créé`);
        // Le document est revalidé par l'action : pas de second rendu ici.
        router.push(`/factures/${res.data.id}`);
        return;
      }

      toast.error(res.error ?? "Le document n'a pas pu être créé. Réessayez.");
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          isLoading={isPending}
          icon={<FilePlus2 className="size-4" aria-hidden="true" />}
        >
          Créer un document
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {MANUAL_DOCUMENT_TYPES.map((type) => {
          const alreadyIssued = type === "facture" && issuedInvoice !== undefined;
          return (
            <DropdownMenuItem
              key={type}
              disabled={alreadyIssued}
              onSelect={() => {
                if (!alreadyIssued) handleCreate(type);
              }}
            >
              <span className="flex-1">{DOCUMENT_TYPE_LABELS[type]}</span>
              {alreadyIssued ? (
                <span className="text-xs text-text-subtle">déjà émise</span>
              ) : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
