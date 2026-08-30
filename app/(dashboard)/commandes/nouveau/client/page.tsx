import { getClients } from "@/lib/mock-data/clients";
import { OrderWizardClientStepClient } from "./_components/client-step-client";

export default async function OrderWizardClientStepPage() {
  const clients = await getClients();
  return <OrderWizardClientStepClient initialClients={clients} />;
}
