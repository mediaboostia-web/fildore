"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { duplicateMeasurementProfileAction } from "@/features/measurements/actions";

export interface DuplicateProfileDialogProps {
  profileId: string;
  clientId: string;
  currentLabel: string;
}

/** Bouton "Dupliquer" + Dialog demandant le nouveau libellé du profil copié. */
export function DuplicateProfileDialog({ profileId, clientId, currentLabel }: DuplicateProfileDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [newLabel, setNewLabel] = useState(`${currentLabel} (copie)`);
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleDuplicate() {
    if (!newLabel.trim()) {
      setError("Le nom du profil est obligatoire.");
      return;
    }
    setError(undefined);
    setIsSubmitting(true);
    const result = await duplicateMeasurementProfileAction(profileId, newLabel.trim(), clientId);
    setIsSubmitting(false);

    if (!result.success || !result.data) {
      setError(result.error ?? "Impossible de dupliquer ce profil. Réessayez.");
      return;
    }

    setOpen(false);
    toast.success("Profil dupliqué");
    router.push(`/clients/${clientId}/mesures/${result.data.id}`);
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        icon={<Copy className="size-4" aria-hidden="true" />}
        onClick={() => setOpen(true)}
      >
        Dupliquer
      </Button>
      <Dialog open={open} onOpenChange={(next) => !isSubmitting && setOpen(next)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dupliquer ce profil de mesures</DialogTitle>
            <DialogDescription>
              Une copie est créée avec les mêmes mesures — utile pour suivre l&apos;évolution du client
              dans le temps.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Input
              label="Nom du nouveau profil"
              required
              value={newLabel}
              onChange={(event) => setNewLabel(event.target.value)}
              error={error}
            />
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" disabled={isSubmitting}>
                Annuler
              </Button>
            </DialogClose>
            <Button onClick={handleDuplicate} isLoading={isSubmitting}>
              Dupliquer le profil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
