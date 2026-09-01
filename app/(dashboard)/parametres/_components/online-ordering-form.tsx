"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Globe, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { updateOnlineOrderingAction } from "@/features/public-orders/actions";
import { CATALOG_CATEGORY_LABELS, type CatalogCategory } from "@/features/catalog/types";
import type { OnlineOrderingSettings } from "@/features/public-orders/types";

export interface OnlineOrderingFormProps {
  workshopSlug: string;
  initialSettings: OnlineOrderingSettings;
  /** Catégories réellement présentes dans le catalogue de cet atelier. */
  availableCategories: CatalogCategory[];
}

/** Interrupteur accessible, sans dépendance : une case à cocher stylée. */
function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-3.5 transition-colors hover:bg-surface-muted">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-primary-900"
      />
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-text">{label}</span>
        {hint ? <span className="text-xs text-text-muted">{hint}</span> : null}
      </span>
    </label>
  );
}

/**
 * Règles de la page publique de l'atelier.
 *
 * Le principe est écrit dans l'écran : c'est l'atelier qui décide de ce qu'il
 * accepte. Sans ces réglages, un couturier recevrait des demandes qu'il ne peut
 * pas honorer — un délai de deux jours, une catégorie qu'il ne fait pas — et
 * finirait par fermer sa page.
 */
export function OnlineOrderingForm({
  workshopSlug,
  initialSettings,
  availableCategories,
}: OnlineOrderingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState<OnlineOrderingSettings>(initialSettings);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const publicPath = `/atelier/${workshopSlug}`;
  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}${publicPath}` : "";

  const patch = (next: Partial<OnlineOrderingSettings>) =>
    setSettings((previous) => ({ ...previous, ...next }));

  const toggleCategory = (category: CatalogCategory) => {
    const current = settings.allowedCategories;
    patch({
      allowedCategories: current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category],
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    startTransition(async () => {
      const res = await updateOnlineOrderingAction(settings);
      if (res.success) {
        toast.success(
          res.data?.enabled
            ? "Vos commandes en ligne sont ouvertes"
            : "Vos commandes en ligne sont fermées"
        );
        router.refresh();
        return;
      }

      setFieldErrors(res.fieldErrors ?? {});
      setErrorMsg(
        res.error ??
          (res.fieldErrors
            ? "Vérifiez les champs signalés ci-dessous."
            : "Les réglages n'ont pas pu être enregistrés. Réessayez.")
      );
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Lien copié. Partagez-le à vos clients.");
    } catch {
      toast.error("Le lien n'a pas pu être copié. Sélectionnez-le à la main.");
    }
  };

  const handleShareWhatsApp = () => {
    const message = `Découvrez nos modèles et commandez en ligne :\n${publicUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <form
      // Cible de « Régler ma page publique » depuis l'écran Demandes : sur une
      // page de réglages longue, le couturier arrive directement à la section.
      id="commandes-en-ligne"
      onSubmit={handleSubmit}
      noValidate
      className="scroll-mt-20 space-y-5 rounded-lg border border-border bg-surface p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Globe className="size-5 text-primary-800" aria-hidden="true" />
        <h2 className="text-base font-bold text-text">Commandes en ligne</h2>
      </div>

      {/* État réellement enregistré, pas l'état du formulaire : savoir si sa page
          est ouverte au public ne doit pas dépendre d'un toast déjà disparu. */}
      <p
        className={
          initialSettings.enabled
            ? "rounded-[var(--radius-md)] bg-success-bg px-3 py-2 text-sm font-medium text-success"
            : "rounded-[var(--radius-md)] bg-surface-muted px-3 py-2 text-sm font-medium text-text-muted"
        }
        role="status"
      >
        {initialSettings.enabled
          ? "Vos commandes en ligne sont ouvertes"
          : "Vos commandes en ligne sont fermées"}
      </p>

      <p className="text-sm text-text-muted">
        Partagez une page publique à vos clients. Ils choisissent un modèle et vous envoient une
        demande, que vous acceptez ou refusez. <strong className="text-text">Vous fixez les
        règles</strong> : ce que vous montrez, le délai minimum et l&apos;acompte.
      </p>

      {errorMsg ? (
        <div className="rounded-[var(--radius-md)] bg-danger-bg p-3 text-sm text-danger" role="alert">
          {errorMsg}
        </div>
      ) : null}

      <Toggle
        label="Ouvrir mes commandes en ligne"
        hint="Fermées, vos clients voient le message ci-dessous au lieu du catalogue."
        checked={settings.enabled}
        onChange={(enabled) => patch({ enabled })}
      />

      <div className="rounded-[var(--radius-md)] border border-border bg-canvas/60 p-3.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Votre lien public
        </p>
        <p className="mt-1 break-all font-mono text-xs text-text">{publicUrl || publicPath}</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            fullWidth="mobile"
            onClick={handleCopy}
            icon={<Copy className="size-4" />}
          >
            Copier le lien
          </Button>
          <Button
            type="button"
            variant="whatsapp"
            size="sm"
            fullWidth="mobile"
            onClick={handleShareWhatsApp}
            icon={<MessageCircle className="size-4" />}
          >
            Partager sur WhatsApp
          </Button>
        </div>
      </div>

      <Toggle
        label="Afficher les prix indicatifs"
        hint="Sinon, la page indique « Prix communiqué après votre demande »."
        checked={settings.showPrices}
        onChange={(showPrices) => patch({ showPrices })}
      />

      <div>
        <p className="mb-1 text-xs font-semibold text-text">Modèles proposés en ligne</p>
        <p className="mb-2 text-xs text-text-muted">
          Aucune catégorie cochée = tout votre catalogue est visible.
        </p>
        <div className="flex flex-wrap gap-2">
          {availableCategories.length === 0 ? (
            <p className="text-xs text-text-subtle">
              Votre catalogue est vide : ajoutez des modèles pour choisir ce que vous montrez.
            </p>
          ) : (
            availableCategories.map((category) => {
              const active = settings.allowedCategories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-primary-800 bg-primary-900 text-white"
                      : "border-border-strong bg-surface text-text-muted hover:bg-surface-muted"
                  }`}
                >
                  {CATALOG_CATEGORY_LABELS[category] ?? category}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Délai minimum (en jours)"
          type="number"
          min={0}
          max={180}
          value={settings.minDelayDays}
          onChange={(e) => patch({ minDelayDays: parseInt(e.target.value, 10) || 0 })}
          error={fieldErrors.minDelayDays?.[0]}
          hint="Une date plus proche est refusée au client."
        />
        <Input
          label="Acompte annoncé (en %)"
          type="number"
          min={0}
          max={100}
          disabled={!settings.requireDeposit}
          value={settings.depositPercent}
          onChange={(e) => patch({ depositPercent: parseInt(e.target.value, 10) || 0 })}
          error={fieldErrors.depositPercent?.[0]}
          hint="Affiché à titre indicatif. Rien n'est encaissé en ligne."
        />
      </div>

      <Toggle
        label="Annoncer qu'un acompte est demandé"
        hint="Le client sait dès le départ ce qu'il faudra verser pour lancer la coupe."
        checked={settings.requireDeposit}
        onChange={(requireDeposit) => patch({ requireDeposit })}
      />

      <Toggle
        label="Laisser le client indiquer ses mesures"
        hint="Sinon, la page lui dit que vous le contacterez pour les prendre."
        checked={settings.acceptMeasurementsOnline}
        onChange={(acceptMeasurementsOnline) => patch({ acceptMeasurementsOnline })}
      />

      <Textarea
        label="Message d'accueil"
        rows={3}
        value={settings.welcomeMessage}
        onChange={(e) => patch({ welcomeMessage: e.target.value })}
        error={fieldErrors.welcomeMessage?.[0]}
        hint="Affiché en haut de votre page publique."
      />

      <Textarea
        label="Message quand vos commandes sont fermées"
        rows={2}
        value={settings.closedMessage}
        onChange={(e) => patch({ closedMessage: e.target.value })}
        error={fieldErrors.closedMessage?.[0]}
      />

      <div className="flex justify-end border-t border-border pt-4">
        <Button type="submit" fullWidth="mobile" isLoading={isPending} icon={<Check className="size-4" />}>
          Enregistrer ces règles
        </Button>
      </div>
    </form>
  );
}
