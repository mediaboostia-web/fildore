import { getClients, getClientById } from "@/lib/mock-data/clients";
import { getCatalogItemById } from "@/lib/mock-data/catalog";
import { getCurrentUser } from "@/lib/auth/session";
import { OrderWizardClientStepClient } from "./_components/client-step-client";
import type { WizardCatalogItem, WizardClient } from "@/features/orders/wizard-actions";
import type { Client } from "@/features/clients/types";

/**
 * Réduit un client à ce que l'étape affiche réellement. L'adresse, les notes
 * internes et l'historique n'ont rien à faire dans le bundle envoyé au
 * navigateur (PROJECT_RULES.md §7).
 */
function toWizardClient(client: Client): WizardClient {
  return {
    id: client.id,
    firstName: client.firstName,
    lastName: client.lastName,
    phone: client.phone,
    city: client.city,
    district: client.district,
  };
}

export default async function OrderWizardClientStepPage({
  searchParams,
}: {
  searchParams: Promise<{ modele?: string; client?: string; profil?: string }>;
}) {
  const { modele, client: clientId, profil } = await searchParams;
  const [clients, user] = await Promise.all([getClients(), getCurrentUser()]);

  // Commande lancée depuis une fiche modèle : on prérempli le brouillon avec ce
  // modèle (titre, type de vêtement, prix indicatif) et on garde le lien
  // `catalogItemId` sur la commande créée.
  let catalogItem: WizardCatalogItem | null = null;
  if (modele && user) {
    const item = await getCatalogItemById(modele);
    if (item && item.workshopId === user.workshopId && !item.isArchived) {
      catalogItem = {
        id: item.id,
        name: item.name,
        garmentType: item.garmentType,
        description: item.description,
        indicativePrice: item.indicativePrice,
        estimatedDelayDays: item.estimatedDelayDays,
      };
    }
  }

  // Commande lancée depuis une fiche client : le client est déjà choisi, il n'y
  // a aucune raison de le faire rechercher à nouveau.
  let preselectedClient: WizardClient | null = null;
  if (clientId && user) {
    const found = await getClientById(clientId);
    if (found && found.workshopId === user.workshopId && found.status === "active") {
      preselectedClient = toWizardClient(found);
    }
  }

  return (
    <OrderWizardClientStepClient
      initialClients={clients.map(toWizardClient)}
      catalogItem={catalogItem}
      preselectedClient={preselectedClient}
      preselectedProfileId={preselectedClient && profil ? profil : null}
    />
  );
}
