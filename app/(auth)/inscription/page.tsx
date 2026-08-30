import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InscriptionPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer votre atelier</CardTitle>
        <CardDescription>
          Inscrivez votre atelier de couture sur Fildor et commencez à gérer vos commandes et clients.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action="/onboarding" className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text">Votre nom complet *</label>
            <Input placeholder="Ex. Amina Sossou" required />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text">Nom de l&apos;atelier *</label>
            <Input placeholder="Ex. Atelier Élégance Mode" required />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text">Email professionnel *</label>
            <Input type="email" placeholder="amina@elegance.bj" required />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text">Mot de passe *</label>
            <Input type="password" placeholder="••••••••" required />
          </div>

          <Button type="submit" fullWidth>
            Créer mon compte atelier
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-border pt-4">
        <p className="text-xs text-text-muted">
          Vous avez déjà un compte ?{" "}
          <Link href="/connexion" className="font-semibold text-primary-900 hover:underline">
            Se connecter
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
