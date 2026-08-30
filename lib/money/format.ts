/**
 * Format local des montants : "35 000 FCFA" — espace comme séparateur de milliers,
 * jamais de virgule/point décimal (les montants sont des entiers). PROJECT_RULES.md §4.
 */
// Intl.NumberFormat("fr-FR") sépare les milliers avec une espace insécable
// (code 160, ou fine, code 8239, selon l'environnement) : on la remplace par
// une espace ASCII normale (code 32) pour éviter les soucis de copier-coller
// (WhatsApp, PDF, champs texte bruts). On construit le regex à partir des
// codes de caractères plutôt que d'un littéral, pour ne laisser aucun
// caractère invisible ambigu dans le code source.
const NON_BREAKING_SPACE_CHARS = [160, 8239].map((code) => String.fromCharCode(code)).join("");
const NON_BREAKING_SPACES = new RegExp(`[${NON_BREAKING_SPACE_CHARS}]`, "g");

export function formatAmount(amount: number, currencyLabel = "FCFA"): string {
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(NON_BREAKING_SPACES, " ");
  return `${formatted} ${currencyLabel}`;
}
