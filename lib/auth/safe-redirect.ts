/**
 * Nettoie la destination d'après-connexion.
 *
 * `/connexion?redirect=…` est renseigné par `proxy.ts` avec le chemin demandé,
 * mais rien n'empêche quelqu'un d'envoyer à un couturier un lien
 * `…/connexion?redirect=https://site-pirate/` : après une connexion tout à fait
 * normale, l'atelier atterrirait sur un site tiers qui n'a plus qu'à imiter
 * Fildor pour lui redemander ses identifiants. On n'accepte donc qu'un chemin
 * interne, et on retombe sinon sur l'accueil.
 */

export const DEFAULT_REDIRECT = "/tableau-de-bord";

export function safeRedirectPath(
  value: FormDataEntryValue | string | null | undefined,
  fallback: string = DEFAULT_REDIRECT
): string {
  if (typeof value !== "string" || value === "") return fallback;

  // Un chemin interne commence par une seule barre oblique. « // » et « /\ »
  // sont lus comme une URL protocol-relative par les navigateurs : `//evil.com`
  // mène bien à `https://evil.com`.
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;

  // Les retours chariot et caractères de contrôle servent à casser l'en-tête
  // `Location` ; les rejeter coûte une ligne.
  if (/[\u0000-\u001F\u007F]/.test(value)) return fallback;

  return value;
}
