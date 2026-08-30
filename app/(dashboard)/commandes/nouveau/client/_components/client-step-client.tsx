"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, MapPin, Phone, Plus, Scissors, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import { useOrderWizardStore } from "@/features/orders/store";
import { createClientAction } from "@/features/clients/actions";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import { matchesQuery } from "@/lib/utils/search";
import type { WizardCatalogItem, WizardClient } from "@/features/orders/wizard-actions";

interface Props {
  initialClients: WizardClient[];
  /** Modèle du catalogue à l'origine de la commande, si elle vient d'une fiche modèle. */
  catalogItem?: WizardCatalogItem | null;
  /** Client déjà choisi, si la commande part d'une fiche client. */
  preselectedClient?: WizardClient | null;
  /** Profil de mesures déjà choisi (`?profil=`), transmis à l'étape 3. */
  preselectedProfileId?: string | null;
}

function displayName(client: WizardClient): string {
  return `${client.firstName} ${client.lastName}`.trim();
}

export function OrderWizardClientStepClient({
  initialClients,
  catalogItem,
  preselectedClient,
  preselectedProfileId,
}: Props) {
  const router = useRouter();
  const { draft, setStepData } = useOrderWizardStore();
  const [clients, setClients] = useState<WizardClient[]>(initialClients);
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>(
    preselectedClient?.id || draft.clientId || ""
  );
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

  // Préremplissage depuis une fiche client : le brouillon porte le client (et son
  // profil de mesures s'il a été choisi) dès l'arrivée sur l'étape.
  const preselectedClientId = preselectedClient?.id;
  useEffect(() => {
    if (!preselectedClientId || draft.clientId === preselectedClientId) return;
    setStepData({
      clientId: preselectedClientId,
      ...(preselectedProfileId ? { measurementProfileId: preselectedProfileId } : {}),
    });
  }, [preselectedClientId, preselectedProfileId, draft.clientId, setStepData]);

  const filteredClients = clients.filter((client) =>
    matchesQuery([client.firstName, client.lastName, client.phone, client.city, client.district], search)
  );

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
      setErrorMsg("Renseignez le prénom, le nom, le téléphone et la ville.");
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
        const created = res.data.client;
        setClients((prev) => [
          {
            id: created.id,
            firstName: created.firstName,
            lastName: created.lastName,
            phone: created.phone,
            city: created.city,
            district: created.district,
          },
          ...prev,
        ]);
        setSelectedClientId(res.data.id);
        setStepData({ clientId: res.data.id });
        setIsCreatingNew(false);
        setNewFirstName("");
        setNewLastName("");
        setNewPhone("");
        setNewDistrict("");
      } else {
        setErrorMsg(res.error || "Le client n'a pas pu être enregistré. Réessayez.");
      }
    });
  };

  const selectedClient = clients.find((client) => client.id === selectedClientId);

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

      {preselectedClient && selectedClientId === preselectedClient.id ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-md)] border border-primary-100 bg-primary-50/60 p-3.5">
          <p className="text-sm text-text">
            Commande pour <strong>{displayName(preselectedClient)}</strong>
            {preselectedProfileId ? " — ses mesures sont déjà sélectionnées." : "."}
          </p>
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={() => {
              setSelectedClientId("");
              setStepData({ clientId: "" });
            }}
          >
            Choisir un autre client
          </Button>
        </div>
      ) : null}

      {isCreatingNew ? (
        <form
          onSubmit={handleCreateInlineClient}
          className="space-y-4 rounded-lg border border-primary-800 bg-primary-50/20 p-5 shadow-sm"
          noValidate
        >
          <div className="flex items-center justify-between border-b border-primary-800/20 pb-3">
            <h3 className="font-semibold text-text">Création rapide du client</h3>
          </div>

          {errorMsg && (
            <div className="rounded-md bg-danger-bg p-3 text-sm text-danger" role="alert">
              {errorMsg}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Prénom"
              placeholder="Ex. Christiane"
              required
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
            />
            <Input
              label="Nom"
              placeholder="Ex. Dossou"
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
            placeholder="Ex. Cadjèhoun"
            value={newDistrict}
            onChange={(e) => setNewDistrict(e.target.value)}
          />

          <div className="flex flex-col-reverse gap-2 border-t border-primary-800/20 pt-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              fullWidth="mobile"
              onClick={() => setIsCreatingNew(false)}
            >
              Revenir à la liste
            </Button>
            <Button
              type="submit"
              fullWidth="mobile"
              isLoading={isPending}
              icon={<Plus className="size-4" />}
            >
              Enregistrer et sélectionner
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchInput
              className="flex-1"
              value={search}
              onChange={setSearch}
              label="Rechercher un client"
              placeholder="Nom, numéro ou quartier"
            />
            <Button
              type="button"
              variant="secondary"
              fullWidth="mobile"
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
                      <span className="font-medium text-text">{displayName(client)}</span>
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

      <div className="flex border-t border-border pt-4 sm:justify-end">
        <Button
          type="button"
          fullWidth="mobile"
          onClick={handleNext}
          disabled={!selectedClientId}
          icon={<ArrowRight className="size-4" />}
        >
          {selectedClient ? `Continuer avec ${selectedClient.firstName}` : "Continuer vers Détails"}
        </Button>
      </div>
    </div>
  );
}
