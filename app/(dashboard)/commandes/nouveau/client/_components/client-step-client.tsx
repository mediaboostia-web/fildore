"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, MapPin, Phone, Plus, Scissors, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useOrderWizardStore } from "@/features/orders/store";
import { createClientAction } from "@/features/clients/actions";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import type { Client } from "@/features/clients/types";
import { clientDisplayName } from "@/features/clients/types";
import type { WizardCatalogItem } from "@/features/orders/wizard-actions";

interface Props {
  initialClients: Client[];
  /** Modèle du catalogue à l'origine de la commande, si elle vient d'une fiche modèle. */
  catalogItem?: WizardCatalogItem | null;
}

export function OrderWizardClientStepClient({ initialClients, catalogItem }: Props) {
  const router = useRouter();
  const { draft, setStepData } = useOrderWizardStore();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>(draft.clientId || "");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  // Nouveaux champs client inline
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCity, setNewCity] = useState("Cotonou");
  const [newDistrict, setNewDistrict] = useState("");

  // Préremplissage depuis une fiche modèle. Écrit une seule fois, à l'arrivée sur
  // l'étape : le couturier reste libre de tout modifier aux étapes suivantes.
  const catalogItemId = catalogItem?.id;
  useEffect(() => {
    if (!catalogItem || draft.catalogItemId === catalogItem.id) return;
    setStepData({
      catalogItemId: catalogItem.id,
      garmentType: catalogItem.garmentType,
      title: catalogItem.name,
      description: catalogItem.description,
      totalAmount: catalogItem.indicativePrice,
    });
  }, [catalogItem, catalogItemId, draft.catalogItemId, setStepData]);

  const filteredClients = clients.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setStepData({ clientId });
  };

  const handleNext = () => {
    if (!selectedClientId) return;
    setStepData({ clientId: selectedClientId });
    router.push("/commandes/nouveau/details");
  };

  const handleCreateInlineClient = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newFirstName.trim() || !newLastName.trim() || !newPhone.trim() || !newCity.trim()) {
      setErrorMsg("Veuillez renseigner le prénom, nom, téléphone et ville.");
      return;
    }

    const formData = new FormData();
    formData.set("firstName", newFirstName.trim());
    formData.set("lastName", newLastName.trim());
    formData.set("phone", newPhone.trim());
    formData.set("city", newCity.trim());
    formData.set("district", newDistrict.trim());

    startTransition(async () => {
      const res = await createClientAction(formData);
      if (res.success && res.data) {
        // Le client renvoyé par le serveur fait foi (téléphone normalisé,
        // identifiant d'atelier réel) — on n'en refabrique pas une copie ici.
        setClients((prev) => [res.data!.client, ...prev]);
        setSelectedClientId(res.data.id);
        setStepData({ clientId: res.data.id });
        setIsCreatingNew(false);
        // Reset
        setNewFirstName("");
        setNewLastName("");
        setNewPhone("");
        setNewDistrict("");
      } else {
        setErrorMsg(res.error || "Impossible de créer le client.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-text">Étape 1 : Choisir le client</h2>
        <p className="text-sm text-text-muted">
          Sélectionnez le client pour qui cette commande est réalisée, ou ajoutez-en un rapidement.
        </p>
      </div>

      {catalogItem ? (
        <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-primary-100 bg-primary-50/60 p-3.5">
          <Scissors className="mt-0.5 size-4 shrink-0 text-primary-800" aria-hidden="true" />
          <p className="text-sm text-text">
            Commande basée sur le modèle <strong>{catalogItem.name}</strong>. Le titre, le type de
            vêtement et le prix indicatif sont préremplis — vous pourrez les ajuster.
          </p>
        </div>
      ) : null}

      {isCreatingNew ? (
        <form
          onSubmit={handleCreateInlineClient}
          className="rounded-lg border border-primary-800 bg-primary-50/20 p-5 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-primary-800/20 pb-3">
            <h3 className="font-semibold text-text">Création rapide du client</h3>
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={() => setIsCreatingNew(false)}
            >
              Annuler
            </Button>
          </div>

          {errorMsg && (
            <div className="rounded-md bg-danger-bg p-3 text-sm text-danger">{errorMsg}</div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Prénom"
              placeholder="Ex: Christiane"
              required
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
            />
            <Input
              label="Nom"
              placeholder="Ex: Dossou"
              required
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Téléphone (avec indicatif)"
              placeholder="+229 97 00 00 00"
              required
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
            <Input
              label="Ville"
              placeholder="Cotonou"
              required
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            />
          </div>

          <Input
            label="Quartier"
            placeholder="Ex: Cadjèhoun"
            value={newDistrict}
            onChange={(e) => setNewDistrict(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsCreatingNew(false)}
            >
              Annuler
            </Button>
            <Button type="submit" size="sm" isLoading={isPending} icon={<Plus className="size-4" />}>
              Enregistrer et sélectionner
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-subtle" />
              <Input
                placeholder="Rechercher par nom ou numéro..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreatingNew(true)}
              icon={<UserPlus className="size-4" />}
            >
              Nouveau client
            </Button>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {filteredClients.length === 0 ? (
              <div className="rounded-md border border-dashed border-border p-6 text-center">
                <p className="text-sm text-text-muted">Aucun client trouvé pour « {search} ».</p>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="mt-3"
                  onClick={() => {
                    setNewPhone(search);
                    setIsCreatingNew(true);
                  }}
                >
                  Créer ce client maintenant
                </Button>
              </div>
            ) : (
              filteredClients.map((client) => {
                const isSelected = selectedClientId === client.id;
                return (
                  <button
                    key={client.id}
                    type="button"
                    data-testid={`client-select-${client.id}`}
                    onClick={() => handleSelectClient(client.id)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-lg border p-3.5 text-left transition-all ${
                      isSelected
                        ? "border-primary-800 bg-primary-50/50 shadow-sm"
                        : "border-border bg-surface hover:border-border-strong hover:bg-canvas"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-text">{clientDisplayName(client)}</span>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Phone className="size-3" />
                          {formatPhoneDisplay(client.phone)}
                        </span>
                        {client.district && (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {client.district}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected ? (
                      <span className="flex size-6 items-center justify-center rounded-full bg-primary-900 text-white">
                        <Check className="size-4" />
                      </span>
                    ) : (
                      <Badge tone="neutral" className="text-xs">
                        Choisir
                      </Badge>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4 border-t border-border">
        <Button
          type="button"
          onClick={handleNext}
          disabled={!selectedClientId}
          icon={<ArrowRight className="size-4" />}
        >
          Continuer vers Détails
        </Button>
      </div>
    </div>
  );
}
