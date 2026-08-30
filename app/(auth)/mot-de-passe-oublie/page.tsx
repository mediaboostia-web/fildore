import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MotDePasseOubliePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mot de passe oublié</CardTitle>
        <CardDescription>
          Saisissez l&apos;adresse email de votre compte pour recevoir un lien de réinitialisation sécurisé.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text">Email</label>
            <Input type="email" placeholder="amina@elegance.bj" required />
          </div>

          <Button type="submit" fullWidth>
            Envoyer le lien de réinitialisation
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-border pt-4">
        <Link
          href="/connexion"
          className="inline-flex items-center text-xs font-semibold text-primary-900 hover:underline"
        >
          <ArrowLeft className="size-3.5 mr-1" />
          Retour à la connexion
        </Link>
      </CardFooter>
    </Card>
  );
}
