"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { updateWorkshopAction } from "@/features/workshop/actions";
import type { Workshop } from "@/features/auth/types";

export function WorkshopSettingsForm({ initialWorkshop }: { initialWorkshop: Workshop }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialWorkshop.name);
  const [whatsappPhone, setWhatsappPhone] = useState(initialWorkshop.whatsappPhone || "");
  const [city, setCity] = useState(initialWorkshop.city || "");
  const [country, setCountry] = useState(initialWorkshop.country || "");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    startTransition(async () => {
      const res = await updateWorkshopAction({ name, whatsappPhone, city, country });

      if (res.success) {
        toast.success("Coordonnées de l'atelier enregistrées");
        // Les coordonnées alimentent les documents et messages : on relit le serveur
        // plutôt que de faire confiance à l'état local.
        router.refresh();
        return;
      }

      setFieldErrors(res.fieldErrors ?? {});
      setErrorMsg(
        res.error ??
          (res.fieldErrors
            ? "Vérifiez les champs signalés ci-dessous."
            : "Les coordonnées n'ont pas pu être enregistrées. Réessayez.")
      );
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-lg border border-border bg-surface p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Building className="size-5 text-primary-800" />
        <h2 className="text-base font-bold text-text">Coordonnées de l&apos;atelier</h2>
      </div>

      {errorMsg && (
        <div className="rounded bg-danger-bg p-3 text-sm text-danger" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nom de l'atelier"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name?.[0]}
        />
        <Input
          label="Numéro WhatsApp officiel"
          required
          value={whatsappPhone}
          onChange={(e) => setWhatsappPhone(e.target.value)}
          hint="Utilisé sur vos reçus et factures."
          error={fieldErrors.whatsappPhone?.[0]}
        />
        <Input
          label="Ville"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={fieldErrors.city?.[0]}
        />
        <Input
          label="Pays"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          error={fieldErrors.country?.[0]}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          size="sm"
          fullWidth="mobile"
          isLoading={isPending}
          icon={<Save className="size-4" />}
        >
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}
