"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { ClientForm } from "../_components/client-form";

/**
 * Formulaire de création client — Client Component car `react-hook-form`
 * requiert un contexte navigateur (pas de données à précharger côté serveur
 * ici, contrairement aux pages [clientId] qui restent des Server Components).
 */
export default function NouveauClientPage() {
  const router = useRouter();

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Clients", href: "/clients" }, { label: "Nouveau client" }]}
        className="mb-3"
      />
      <PageHeader
        title="Nouveau client"
        description="Ces informations permettent de retrouver rapidement le client et de le contacter."
      />
      <Card className="max-w-2xl">
        <ClientForm
          mode="create"
          onSuccess={(clientId) => {
            toast.success("Client créé", "Vous pouvez maintenant ajouter ses mesures ou une commande.");
            router.push(`/clients/${clientId}`);
          }}
          onCancel={() => router.push("/clients")}
        />
      </Card>
    </>
  );
}
