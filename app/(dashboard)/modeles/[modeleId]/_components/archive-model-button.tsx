"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { RoleGate } from "@/components/shared/role-gate";
import { archiveCatalogItemAction } from "@/features/catalog/actions";
import type { Role } from "@/features/auth/types";

export interface ArchiveModelButtonProps {
  itemId: string;
  itemName: string;
  currentUserRole: Role | null | undefined;
}

/**
 * Retire un modèle du catalogue. Les commandes déjà créées à partir de ce
 * modèle ne changent pas : elles portent leur propre titre et leur propre prix.
 */
export function ArchiveModelButton({
  itemId,
  itemName,
  currentUserRole,
}: ArchiveModelButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const res = await archiveCatalogItemAction(itemId);

      if (res.success) {
        toast.success(`${itemName} a été retiré du catalogue`);
        // `archiveCatalogItemAction` a déjà revalidé /modeles : un `refresh()`
        // après le `push` ne ferait qu'un second rendu inutile.
        router.push("/modeles");
        return;
      }

      toast.error(res.error ?? "Le modèle n'a pas pu être retiré. Réessayez.");
    });
  };

  return (
    <RoleGate require="catalogue:gerer" role={currentUserRole}>
      <Button
        variant="secondary"
        size="sm"
        icon={<Archive className="size-4" aria-hidden="true" />}
        onClick={() => setIsOpen(true)}
      >
        Retirer du catalogue
      </Button>

      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={`Retirer ${itemName} du catalogue ?`}
        description="Ce modèle ne sera plus proposé pour de nouvelles commandes. Les commandes déjà enregistrées ne changent pas."
        confirmLabel="Retirer ce modèle"
        cancelLabel="Revenir"
        tone="danger"
        onConfirm={handleConfirm}
      />
    </RoleGate>
  );
}
