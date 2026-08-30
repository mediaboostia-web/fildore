"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { RoleGate } from "@/components/shared/role-gate";
import { archiveClientAction } from "@/features/clients/actions";
import type { Role } from "@/features/auth/types";

export interface ArchiveClientButtonProps {
  clientId: string;
  clientName: string;
  currentUserRole: Role | null | undefined;
}

/**
 * Archivage d'un client : il sort des listes et de la recherche, mais ses
 * commandes, paiements et documents restent intacts. Rien n'est supprimé.
 */
export function ArchiveClientButton({
  clientId,
  clientName,
  currentUserRole,
}: ArchiveClientButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const res = await archiveClientAction(clientId);

      if (res.success) {
        toast.success(`${clientName} a été archivé`);
        // L'action a déjà revalidé /clients : un `refresh()` après le `push`
        // ajouterait un second rendu, ressenti comme un temps d'attente.
        router.push("/clients");
        return;
      }

      toast.error(res.error ?? "Le client n'a pas pu être archivé. Réessayez.");
    });
  };

  return (
    <RoleGate require="client:archiver" role={currentUserRole}>
      <Button
        variant="secondary"
        size="sm"
        icon={<Archive className="size-4" aria-hidden="true" />}
        onClick={() => setIsOpen(true)}
      >
        Archiver
      </Button>

      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={`Archiver ${clientName} ?`}
        description="Ce client n'apparaîtra plus dans vos listes ni dans la recherche. Ses commandes, paiements et documents sont conservés."
        confirmLabel="Archiver ce client"
        cancelLabel="Revenir"
        tone="danger"
        onConfirm={handleConfirm}
      />
    </RoleGate>
  );
}
