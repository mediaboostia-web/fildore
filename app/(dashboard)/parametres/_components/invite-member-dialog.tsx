"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { ROLE_LABELS, type Role } from "@/features/auth/types";

export function InviteMemberDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("couturiere");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Invitation envoyée à ${fullName} (${email}) avec le rôle ${ROLE_LABELS[role]} !`);
    setFullName("");
    setEmail("");
    setIsOpen(false);
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Inviter un membre d&apos;équipe</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-text">Nom et prénom *</label>
                <Input
                  placeholder="Ex. Christian Agbodjan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-text">Adresse email *</label>
                <Input
                  type="email"
                  placeholder="collaborateur@atelier-elegance.bj"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-text">Rôle d&apos;atelier *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary-800 focus:outline-none focus:ring-1 focus:ring-primary-800"
                >
                  <option value="couturiere">Couturière / Tailleur</option>
                  <option value="reception">Réception / Accueil</option>
                  <option value="manager">Responsable d&apos;atelier (Manager)</option>
                  <option value="comptable">Comptable / Gestionnaire</option>
                  <option value="owner">Propriétaire (Owner)</option>
                </select>
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="tertiary" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" icon={<UserPlus className="size-4" />}>
                Envoyer l&apos;invitation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
