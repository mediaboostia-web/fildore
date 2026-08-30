"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth/session";
import { getUserById, getUsers } from "@/lib/mock-data/users";

/**
 * Connexion rapide Google (1-clic) :
 * Connecte immédiatement l'utilisateur avec son compte Google / atelier principal
 * et redirige vers le tableau de bord ou la destination demandée.
 */
export async function googleAuthAction(formData?: FormData): Promise<void> {
  const redirectTo = formData?.get("redirect");
  const target = typeof redirectTo === "string" && redirectTo ? redirectTo : "/tableau-de-bord";

  // Récupère l'utilisateur chef d'atelier par défaut ou le premier profil
  const users = await getUsers();
  const defaultUser = users.find((u) => u.role === "manager") || users[0];

  if (defaultUser) {
    await createSession(defaultUser.id);
  }

  redirect(target);
}

/**
 * Connexion par formulaire (Email / Mot de passe ou sélection profil).
 */
export async function loginAction(formData: FormData): Promise<void> {
  const userId = formData.get("userId");
  const email = formData.get("email");
  const redirectTo = formData.get("redirect");
  const fallbackRedirect = typeof redirectTo === "string" && redirectTo ? redirectTo : "/tableau-de-bord";

  const users = await getUsers();

  if (typeof userId === "string" && userId) {
    const user = await getUserById(userId);
    if (!user) {
      redirect("/connexion?erreur=utilisateur");
    }
    await createSession(user.id);
    redirect(fallbackRedirect);
  }

  if (typeof email === "string" && email.trim()) {
    // Si un email est saisi, on trouve l'utilisateur correspondant ou on prend le compte manager par défaut
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || users[0];
    await createSession(user.id);
    redirect(fallbackRedirect);
  }

  // Si aucun champ n'est fourni
  redirect("/connexion?erreur=selection");
}

/**
 * Création d'atelier / Inscription.
 */
export async function signupAction(formData: FormData): Promise<void> {
  const users = await getUsers();
  const managerUser = users.find((u) => u.role === "manager") || users[0];

  if (managerUser) {
    await createSession(managerUser.id);
  }

  redirect("/tableau-de-bord");
}

/**
 * Demande de réinitialisation de mot de passe.
 */
export async function forgotPasswordAction(formData: FormData): Promise<void> {
  const email = formData.get("email");
  if (!email || typeof email !== "string") {
    redirect("/mot-de-passe-oublie?erreur=email_requis");
  }

  redirect("/mot-de-passe-oublie?succes=1");
}

/**
 * Réinitialisation du mot de passe.
 */
export async function resetPasswordAction(formData: FormData): Promise<void> {
  redirect("/connexion?succes=mot_de_passe_reinitialise");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/connexion");
}
