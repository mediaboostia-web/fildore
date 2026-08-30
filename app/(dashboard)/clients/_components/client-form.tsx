"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { clientFormSchema } from "@/features/clients/schemas";
import type { ClientFormInput } from "@/features/clients/schemas";
import { createClientAction, updateClientAction } from "@/features/clients/actions";
import type { Client } from "@/features/clients/types";

export type ClientFormProps =
  | {
      mode: "create";
      client?: undefined;
      onSuccess: (clientId: string) => void;
      onCancel?: () => void;
    }
  | {
      mode: "edit";
      client: Client;
      onSuccess: (clientId: string) => void;
      onCancel?: () => void;
    };

/**
 * Découpe un numéro déjà normalisé par `normalizePhoneBenin` (toujours de la
 * forme "+229XXXXXXXX" en sortie, voir lib/utils/phone.ts) en indicatif +
 * numéro national, pour préremplir `PhoneInput` en mode édition. Limite connue :
 * `normalizePhoneBenin` force l'indicatif 229 quel que soit celui choisi à la
 * saisie (comportement de la couche données, hors périmètre de cette passe) —
 * cette fonction part donc de l'hypothèse Bénin, cohérente avec les données
 * mockées de l'atelier.
 */
function splitPhone(phone: string | undefined): { countryCode: string; number: string } {
  if (!phone) return { countryCode: "+229", number: "" };
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("229")) {
    return { countryCode: "+229", number: digits.slice(3) };
  }
  return { countryCode: "+229", number: digits };
}

/**
 * Formulaire client partagé création/édition — un seul schéma Zod
 * (`clientFormSchema`) validé côté client via `zodResolver` ET côté serveur
 * dans les Server Actions, jamais deux règles de validation distinctes.
 */
export function ClientForm({ mode, client, onSuccess, onCancel }: ClientFormProps) {
  const initialPhone = splitPhone(client?.phone);
  const [countryCode, setCountryCode] = useState(initialPhone.countryCode);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone.number);
  const [duplicateError, setDuplicateError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormInput>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      firstName: client?.firstName ?? "",
      lastName: client?.lastName ?? "",
      phone: client?.phone ?? "",
      city: client?.city ?? "",
      district: client?.district ?? "",
      address: client?.address ?? "",
      notes: client?.notes ?? "",
    },
  });

  function handleNumberChange(digits: string) {
    setPhoneNumber(digits);
    setValue("phone", `${countryCode}${digits}`, { shouldValidate: true });
  }

  function handleCountryCodeChange(value: string) {
    setCountryCode(value);
    setValue("phone", `${value}${phoneNumber}`, { shouldValidate: true });
  }

  useEffect(() => {
    register("phone");
    setValue("phone", `${countryCode}${phoneNumber}`);
  }, [register, countryCode, phoneNumber, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setDuplicateError(undefined);

    const fullPhone = values.phone || `${countryCode}${phoneNumber}`;
    const formData = new FormData();
    formData.set("firstName", values.firstName);
    formData.set("lastName", values.lastName);
    formData.set("phone", fullPhone);
    formData.set("city", values.city);
    formData.set("district", values.district ?? "");
    if (values.address) formData.set("address", values.address);
    if (values.notes) formData.set("notes", values.notes);

    const result =
      mode === "create"
        ? await createClientAction(formData)
        : await updateClientAction(client.id, formData);

    if (result.success && result.data) {
      onSuccess(result.data.id);
      return;
    }

    if (result.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        if (messages?.[0]) {
          setError(field as FieldPath<ClientFormInput>, { type: "server", message: messages[0] });
        }
      }
    }
    if (result.error) {
      setDuplicateError(result.error);
    } else if (!result.fieldErrors) {
      setDuplicateError("Impossible d'enregistrer ce client. Vérifiez votre connexion puis réessayez.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Prénom" required {...register("firstName")} error={errors.firstName?.message} />
        <Input label="Nom" required {...register("lastName")} error={errors.lastName?.message} />
      </div>
      <PhoneInput
        label="Téléphone"
        required
        countryCode={countryCode}
        onCountryCodeChange={handleCountryCodeChange}
        number={phoneNumber}
        onNumberChange={handleNumberChange}
        error={errors.phone?.message}
        hint="Utilisé pour les rappels WhatsApp de commande."
      />
      {duplicateError ? (
        <p className="rounded-[var(--radius-md)] bg-danger-bg px-3 py-2 text-sm text-danger">
          {duplicateError}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Ville" required {...register("city")} error={errors.city?.message} />
        <Input label="Quartier" {...register("district")} error={errors.district?.message} />
      </div>
      <Input
        label="Adresse"
        hint="Facultatif — utile pour une livraison."
        {...register("address")}
        error={errors.address?.message}
      />
      <Textarea
        label="Notes"
        hint="Facultatif — préférences, historique, remarques utiles à l'atelier."
        {...register("notes")}
        error={errors.notes?.message}
      />
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Annuler
          </Button>
        ) : null}
        <Button type="submit" isLoading={isSubmitting}>
          {mode === "create" ? "Créer le client" : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  );
}
