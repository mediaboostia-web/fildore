import { getClients } from "@/lib/mock-data/clients";
import { getCatalogItemById } from "@/lib/mock-data/catalog";
import { getCurrentUser } from "@/lib/auth/session";
import { OrderWizardClientStepClient } from "./_components/client-step-client";
import type { WizardCatalogItem } from "@/features/orders/wizard-actions";

export default async function OrderWizardClientStepPage({
  searchParams,
}: {
  searchParams: Promise<{ modele?: string }>;
}) {
  const { modele } = await searchParams;
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

  return <OrderWizardClientStepClient initialClients={clients} catalogItem={catalogItem} />;
}
