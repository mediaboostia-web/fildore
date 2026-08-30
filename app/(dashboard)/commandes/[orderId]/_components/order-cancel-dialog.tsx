"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cancelOrderAction } from "@/features/orders/actions";

interface OrderCancelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  reference: string;
}

export function OrderCancelDialog({
  isOpen,
  onClose,
  orderId,
  reference,
}: OrderCancelDialogProps) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg("Veuillez préciser le motif de l'annulation.");
      return;
    }

    startTransition(async () => {
      const res = await cancelOrderAction({ orderId, reason: reason.trim() });
      if (res.success) {
        onClose();
        router.refresh();
      } else {
        setErrorMsg(res.error || "Erreur lors de l'annulation de la commande.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2 text-danger">
              <AlertTriangle className="size-5" />
              <DialogTitle>Annuler la commande {reference}</DialogTitle>
            </div>
            <DialogDescription>
              Cette commande sera marquée comme annulée dans l&apos;historique et retirée de la production active.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="rounded bg-danger-bg p-2 text-xs text-danger" role="alert">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-text">
              Motif de l&apos;annulation *
            </label>
            <Textarea
              placeholder="Ex. Client a annulé l'événement, tissu non fourni..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrorMsg("");
              }}
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
              Retour
            </Button>
            <Button type="submit" variant="danger" isLoading={isPending}>
              Confirmer l&apos;annulation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
