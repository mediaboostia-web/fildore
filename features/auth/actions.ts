"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSession, destroySession, requireCurrentUser } from "@/lib/auth/session";
import { createUser, findUserByEmail, getUsers } from "@/lib/mock-data/users";
import { getWorkshop, updateWorkshop } from "@/lib/mock-data/workshop";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  onboardingSchema,
} from "./schemas";

/**
 * Ces actions sont invoquées directement en `<form action={…}>` : elles ne
 * peuvent donc pas retourner d'erreur au composant. Les échecs de validation
 * repartent en paramètre d'URL, lu et traduit par la page — ce qui garde le
 * formulaire fonctionnel sans JavaScript.
 */
function firstErrorCode(fieldErrors: Record<string, string[] | undefined>): string {
  return Object.keys(fieldErrors)[0] ?? "invalide";
}

/**
 * Raccourci de démonstration « connexion Google ».
 *
 * Aucun OAuth n'est branché : cette action ouvre la session du compte
 * propriétaire de l'atelier de démonstration. Elle est volontairement isolée ici
 * pour être remplacée d'un bloc par le vrai flux Supabase, sans qu'aucune autre
 * partie du code ne dépende de ce raccourci.
 */
export async function googleAuthAction(formData?: FormData): Promise<void> {
  const redirectTo = formData?.get("redirect");
  const target = typeof redirectTo === "string" && redirectTo ? redirectTo : "/tableau-de-bord";

  const users = await getUsers();
  const demoUser = users.find((u) => u.role === "owner") ?? users[0];
  if (demoUser) {
    await createSession(demoUser.id);
  }

  redirect(target);
}

/**
 * Connexion.
 *
 * `userId` correspond aux boutons « accès rapide démo » ; `email` au formulaire.
 * Une adresse inconnue est refusée — elle ouvrait auparavant la session du
 * premier utilisateur de la liste, ce qui donnait accès à l'atelier à n'importe
 * quelle saisie.
 */
export async function loginAction(formData: FormData): Promise<void> {
  const redirectTo = formData.get("redirect");
  const target = typeof redirectTo === "string" && redirectTo ? redirectTo : "/tableau-de-bord";

  const userId = formData.get("userId");
  if (typeof userId === "string" && userId) {
    const users = await getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) redirect("/connexion?erreur=utilisateur");
    await createSession(user.id);
    redirect(target);
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    redirect(`/connexion?erreur=${firstErrorCode(parsed.error.flatten().fieldErrors)}`);
  }

  const user = await findUserByEmail(parsed.data.email);
  if (!user) {
    redirect("/connexion?erreur=identifiants");
  }

  await createSession(user.id);
  redirect(target);
}

/**
 * Création d'atelier.
 *
 * Le mock ne gère qu'un atelier (voir `MockDatabase.workshop`) : l'inscription
 * crée donc un vrai compte propriétaire — visible ensuite dans Paramètres →
 * Membres de l'équipe — et renomme l'atelier avec celui saisi. Le multi-atelier
 * arrivera avec Supabase, où `workshop_id` isolera réellement les données.
 */
export async function signupAction(formData: FormData): Promise<void> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    workshopName: formData.get("workshopName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    redirect(`/inscription?erreur=${firstErrorCode(parsed.error.flatten().fieldErrors)}`);
  }

  const existing = await findUserByEmail(parsed.data.email);
  if (existing) {
    redirect("/inscription?erreur=email_existant");
  }

  const workshop = await getWorkshop();
  await updateWorkshop({
    name: parsed.data.workshopName,
    whatsappPhone: workshop.whatsappPhone,
    city: workshop.city,
    country: workshop.country,
  });

  const owner = await createUser({
    workshopId: workshop.id,
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    role: "owner",
  });

  await createSession(owner.id);
  revalidatePath("/parametres");
  redirect("/onboarding");
}

/**
 * Configuration initiale de l'atelier : enregistre réellement les coordonnées
 * saisies, qui alimentent ensuite les reçus, factures et messages WhatsApp.
 */
export async function completeOnboardingAction(formData: FormData): Promise<void> {
  const user = await requireCurrentUser();

  const parsed = onboardingSchema.safeParse({
    country: formData.get("country"),
    city: formData.get("city"),
    whatsappPhone: formData.get("whatsappPhone"),
  });
  if (!parsed.success) {
    redirect(`/onboarding?erreur=${firstErrorCode(parsed.error.flatten().fieldErrors)}`);
  }

  const workshop = await getWorkshop();
  if (workshop.id !== user.workshopId) {
    redirect("/onboarding?erreur=atelier");
  }

  await updateWorkshop({
    name: workshop.name,
    whatsappPhone: parsed.data.whatsappPhone,
    city: parsed.data.city,
    country: parsed.data.country,
  });

  revalidatePath("/parametres");
  redirect("/tableau-de-bord");
}

/**
 * Demande de réinitialisation.
 *
 * Aucun e-mail n'est envoyé (pas de service de mail branché) : la page l'indique
 * explicitement plutôt que d'afficher un « e-mail envoyé » mensonger. La réponse
 * ne révèle pas si l'adresse existe — ce serait une fuite d'information.
 */
export async function forgotPasswordAction(formData: FormData): Promise<void> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    redirect("/mot-de-passe-oublie?erreur=email");
  }

  redirect("/mot-de-passe-oublie?succes=1");
}

/**
 * Réinitialisation du mot de passe : la validation de format et la concordance
 * des deux saisies sont réelles ; le stockage arrivera avec Supabase Auth.
 */
export async function resetPasswordAction(formData: FormData): Promise<void> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    redirect(`/reinitialiser-mot-de-passe?erreur=${firstErrorCode(parsed.error.flatten().fieldErrors)}`);
  }

  redirect("/connexion?succes=mot_de_passe_reinitialise");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/connexion");
}
