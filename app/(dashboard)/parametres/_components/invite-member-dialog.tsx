"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { inviteMemberAction } from "@/features/workshop/actions";
import { type Role } from "@/features/auth/types";

const ROLE_OPTIONS = [
  { value: "couturiere", label: "Couturière / Tailleur" },
  { value: "reception", label: "Réception / Accueil" },
  { value: "manager", label: "Responsable d'atelier (Manager)" },
  { value: "comptable", label: "Comptable / Gestionnaire" },
  { value: "owner", label: "Propriétaire (Owner)" },
];

export function InviteMemberDialog() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("couturiere");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function resetForm() {
    setFullName("");
    setEmail("");
    setRole("couturiere");
    setErrorMsg("");
    setFieldErrors({});
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    startTransition(async () => {
      const res = await inviteMemberAction({ fullName, email, role });

      if (res.success && res.data) {
        toast.success(`${res.data.fullName} a été ajouté à votre équipe`);
        resetForm();
        setIsOpen(false);
        router.refresh();
        return;
      }

      setFieldErrors(res.fieldErrors ?? {});
      setErrorMsg(
        res.error ??
          (res.fieldErrors
            ? "Vérifiez les champs signalés ci-dessous."
            : "Le collaborateur n'a pas pu être ajouté. Réessayez.")
      );
    });
  };

  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setIsOpen(true)}
        icon={<UserPlus className="size-4" />}
      >
        Inviter un collaborateur
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <DialogHeader>
              <DialogTitle>Inviter un membre d&apos;équipe</DialogTitle>
            </DialogHeader>

            {errorMsg && (
              <div className="rounded bg-danger-bg p-3 text-sm text-danger" role="alert">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3 py-2">
              <Input
                label="Nom et prénom"
                required
                placeholder="Ex. Christian Agbodjan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={fieldErrors.fullName?.[0]}
              />

              <Input
                label="Adresse e-mail"
                type="email"
                required
                placeholder="collaborateur@atelier-elegance.bj"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email?.[0]}
              />

              <Select
                label="Rôle d'atelier"
                required
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                options={ROLE_OPTIONS}
                error={fieldErrors.role?.[0]}
              />
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="tertiary" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" isLoading={isPending} icon={<UserPlus className="size-4" />}>
                Ajouter à l&apos;équipe
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
