import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { getUsers } from "@/lib/mock-data/users";
import { getWorkshop } from "@/lib/mock-data/workshop";
import { ROLE_LABELS } from "@/features/auth/types";
import { loginAction } from "@/features/auth/actions";

const ERROR_MESSAGES: Record<string, string> = {
  selection: "Choisissez un utilisateur pour continuer.",
  utilisateur: "Utilisateur introuvable. Réessayez.",
};

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; erreur?: string }>;
}) {
  const { redirect, erreur } = await searchParams;
  const [users, workshop] = await Promise.all([getUsers(), getWorkshop()]);
  const errorMessage = erreur ? ERROR_MESSAGES[erreur] : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>
          Choisissez un utilisateur de {workshop.name} pour accéder à l&apos;atelier.
        </CardDescription>
      </CardHeader>
      {errorMessage ? (
        <p className="mt-2 rounded-[var(--radius-md)] bg-danger-bg px-3 py-2 text-sm text-danger">
          {errorMessage}
        </p>
      ) : null}
      <CardContent>
        <form action={loginAction} className="flex flex-col gap-2">
          <input type="hidden" name="redirect" value={redirect ?? ""} />
          {users.map((user) => (
            <Button
              key={user.id}
              type="submit"
              name="userId"
              value={user.id}
              variant="secondary"
              fullWidth
              className="justify-start"
              icon={<Avatar name={user.fullName} size="sm" />}
            >
              <span className="flex flex-col items-start">
                <span>{user.fullName}</span>
                <span className="text-xs font-normal text-text-subtle">{ROLE_LABELS[user.role]}</span>
              </span>
            </Button>
          ))}
        </form>
      </CardContent>
    </Card>
  );
}
