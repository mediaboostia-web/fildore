"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth/session";
import { getUserById } from "@/lib/mock-data/users";

/**
 * Connexion mockée : sélection parmi les utilisateurs de test de l'atelier
 * (pas de mot de passe au MVP mocké — l'authentification réelle Supabase Auth
 * arrive lors du branchement backend). Utilisée directement comme `action`
 * d'un `<form>` : elle ne retourne rien, les échecs redirigent vers
 * `/connexion` avec un message d'erreur en query param plutôt que de renvoyer
 * un résultat (le prop `action` d'un `<form>` natif ne consomme pas de valeur
 * de retour — il faudrait `useActionState` côté client pour ça).
 */
export async function loginAction(formData: FormData): Promise<void> {
  const userId = formData.get("userId");
  const redirectTo = formData.get("redirect");
  const fallbackRedirect = typeof redirectTo === "string" && redirectTo ? redirectTo : "/tableau-de-bord";

  if (typeof userId !== "string" || !userId) {
    redirect("/connexion?erreur=selection");
  }

  const user = await getUserById(userId);
  if (!user) {
    redirect("/connexion?erreur=utilisateur");
  }

  await createSession(user.id);
  redirect(fallbackRedirect);
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/connexion");
}
