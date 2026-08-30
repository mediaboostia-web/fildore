"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitOrderRequestAction } from "@/features/public-orders/actions";
import { formatDateShortFr } from "@/lib/utils/dates";

export interface OrderRequestFormProps {
  workshopSlug: string;
  workshopName: string;
  catalogItemId?: string;
  catalogItemName?: string;
  /** Première date acceptable, calculée serveur d'après le délai de l'atelier. */
  earliestDate: string;
  minDelayDays: number;
  acceptMeasurementsOnline: boolean;
  defaultCity: string;
}

export function OrderRequestForm({
  workshopSlug,
  workshopName,
  catalogItemId,
  catalogItemName,
  earliestDate,
  minDelayDays,
  acceptMeasurementsOnline,
  defaultCity,
}: OrderRequestFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(defaultCity);
  const [district, setDistrict] = useState("");
  const [desiredDate, setDesiredDate] = useState("");
  const [note, setNote] = useState("");
  // Champ appât : invisible pour une personne, souvent rempli par un robot.
  const [website, setWebsite] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    startTransition(async () => {
      const res = await submitOrderRequestAction({
        workshopSlug,
        catalogItemId,
        firstName,
        lastName,
        phone,
        city,
        district,
        desiredDate,
        note,
        website,
      });

      if (res.success) {
        router.push(`/atelier/${workshopSlug}/commander/merci`);
        return;
      }

      setFieldErrors(res.fieldErrors ?? {});
      setErrorMsg(
        res.error ??
          (res.fieldErrors
            ? "Vérifiez les champs signalés ci-dessous."
            : "Votre demande n'est pas partie. Vérifiez votre connexion, puis réessayez.")
      );
    });
  };

  return (
    /* `noValidate` : sinon le navigateur affiche ses propres bulles, dans sa
       langue, avant nos messages en français. */
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {errorMsg ? (
        <div className="rounded-[var(--radius-md)] bg-danger-bg p-3 text-sm text-danger" role="alert">
          {errorMsg}
        </div>
      ) : null}

      {catalogItemName ? (
        <input type="hidden" name="modele" value={catalogItemName} readOnly />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Prénom"
          required
          autoComplete="given-name"
          placeholder="Ex. Christiane"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={fieldErrors.firstName?.[0]}
        />
        <Input
          label="Nom"
          required
          autoComplete="family-name"
          placeholder="Ex. Dossou"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={fieldErrors.lastName?.[0]}
        />
      </div>

      <Input
        label="Téléphone WhatsApp"
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+229 97 00 00 00"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={fieldErrors.phone?.[0]}
        hint={`C'est sur ce numéro que ${workshopName} vous rappelle.`}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Ville"
          required
          placeholder="Cotonou"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={fieldErrors.city?.[0]}
        />
        <Input
          label="Quartier"
          placeholder="Ex. Cadjèhoun"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          error={fieldErrors.district?.[0]}
        />
      </div>

      <Input
        label="Date souhaitée"
        type="date"
        min={earliestDate}
        value={desiredDate}
        onChange={(e) => setDesiredDate(e.target.value)}
        error={fieldErrors.desiredDate?.[0]}
        hint={`${workshopName} a besoin d'au moins ${minDelayDays} jours : à partir du ${formatDateShortFr(earliestDate)}.`}
      />

      <Textarea
        label="Votre message"
        rows={4}
        placeholder={
          acceptMeasurementsOnline
            ? "Décrivez la tenue, le tissu, la couleur… et vos mesures si vous les connaissez."
            : "Décrivez la tenue, le tissu, la couleur, l'occasion…"
        }
        value={note}
        onChange={(e) => setNote(e.target.value)}
        error={fieldErrors.note?.[0]}
        hint={
          acceptMeasurementsOnline
            ? undefined
            : "Pas besoin de vos mesures ici : l'atelier vous contacte pour les prendre."
        }
      />

      {/* Champ appât. Hors du flux visuel et retiré des lecteurs d'écran et de
          la tabulation : seul un robot le remplit. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Site web</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isPending}
        icon={<Send className="size-4" />}
        className="mt-2"
      >
        Envoyer ma demande
      </Button>

      <p className="text-center text-xs text-text-muted">
        Vos coordonnées servent uniquement à {workshopName} pour traiter cette demande.
      </p>
    </form>
  );
}
