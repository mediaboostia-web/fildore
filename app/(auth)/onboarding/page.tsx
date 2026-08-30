import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function OnboardingPage() {
  const countryOptions = [
    { value: "BJ", label: "Bénin (+229)" },
    { value: "TG", label: "Togo (+228)" },
    { value: "CI", label: "Côte d'Ivoire (+225)" },
    { value: "SN", label: "Sénégal (+221)" },
  ];

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Configuration de votre atelier</CardTitle>
        <CardDescription>
          Personnalisez les coordonnées de votre atelier pour vos reçus et messages WhatsApp.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action="/tableau-de-bord" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Pays"
              defaultValue="BJ"
              options={countryOptions}
            />
            <div>
              <label className="mb-1 block text-xs font-medium text-text">Ville principale</label>
              <Input defaultValue="Cotonou" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text">Numéro WhatsApp atelier *</label>
            <Input placeholder="+229 97 00 00 00" required />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text">Devise par défaut</label>
            <Input defaultValue="FCFA (XOF)" disabled className="bg-canvas" />
          </div>

          <Button type="submit" fullWidth icon={<ArrowRight className="size-4" />}>
            Accéder à mon tableau de bord
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
