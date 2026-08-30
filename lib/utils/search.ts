/**
 * Recherche texte des listes — une seule implémentation pour les commandes,
 * clients, modèles, factures et paiements.
 *
 * Deux exigences venues du terrain béninois :
 * - **Les accents ne doivent pas bloquer.** Un couturier tape « Houngbedji » au
 *   clavier ; le client s'appelle « Houngbédji ». Sans normalisation, il ne
 *   trouve rien et croit avoir perdu la fiche.
 * - **Les numéros doivent se retrouver comme on les lit.** Le numéro est stocké
 *   `+22997000001` mais se saisit « 97 00 00 01 » ou « 9700 ».
 */

/** Minuscules, accents retirés, espaces réduits. */
export function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Vrai si **tous** les mots de la requête se retrouvent dans l'un des champs.
 * « adjoavi robe » trouve la robe d'Adjoavi, quel que soit l'ordre des mots.
 * Une requête vide laisse tout passer.
 */
export function matchesQuery(
  fields: Array<string | number | null | undefined>,
  query: string
): boolean {
  const normalizedQuery = normalizeForSearch(query);
  if (!normalizedQuery) return true;

  const haystack = normalizeForSearch(
    fields
      .filter((field) => field !== null && field !== undefined && field !== "")
      .join(" ")
  );
  const haystackDigits = haystack.replace(/\D/g, "");

  return normalizedQuery.split(" ").every((term) => {
    if (haystack.includes(term)) return true;
    const termDigits = term.replace(/\D/g, "");
    return termDigits.length > 0 && haystackDigits.includes(termDigits);
  });
}
