"use client";

import { useState } from "react";
import { Building, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import type { Workshop } from "@/features/auth/types";

export function WorkshopSettingsForm({ initialWorkshop }: { initialWorkshop: Workshop }) {
  const [name, setName] = useState(initialWorkshop.name);
  const [whatsappPhone, setWhatsappPhone] = useState(initialWorkshop.whatsappPhone || "");
  const [city, setCity] = useState(initialWorkshop.city || "Cotonou");
  const [country, setCountry] = useState(initialWorkshop.country || "Bénin");
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    toast.success("Coordonnées de l'atelier enregistrées avec succès !");
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Building className="size-5 text-primary-800" />
        <h2 className="font-bold text-base text-text">Coordonnées de l&apos;atelier</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-text">Nom de l&apos;atelier *</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text">Numéro WhatsApp officiel *</label>
          <Input value={whatsappPhone} onChange={(e) => setWhatsappPhone(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text">Ville</label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text">Pays</label>
          <Input value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          size="sm"
          icon={isSaved ? <Check className="size-4 text-success" /> : <Save className="size-4" />}
        >
          {isSaved ? "Enregistré !" : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  );
}
