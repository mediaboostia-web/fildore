/**
 * Normalisation des numéros de téléphone béninois/ouest-africains, utilisée
 * à l'écriture ET à la comparaison (détection de doublon client) — une seule
 * fonction pour éviter les faux négatifs dus au formatage (espaces, tirets, 0 initial).
 */
const DEFAULT_COUNTRY_CODE = "229";

export function normalizePhoneBenin(rawPhone: string): string {
  let digits = rawPhone.replace(/[^\d+]/g, "");

  if (digits.startsWith("+")) {
    digits = digits.slice(1);
  } else if (digits.startsWith("00")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0")) {
    digits = DEFAULT_COUNTRY_CODE + digits.slice(1);
  } else if (!digits.startsWith(DEFAULT_COUNTRY_CODE)) {
    digits = DEFAULT_COUNTRY_CODE + digits;
  }

  return `+${digits}`;
}

export function formatPhoneDisplay(normalizedPhone: string): string {
  const digits = normalizedPhone.replace(/^\+/, "");
  const countryCode = digits.slice(0, 3);
  const rest = digits.slice(3);
  const groups = rest.match(/.{1,2}/g) ?? [];
  return `+${countryCode} ${groups.join(" ")}`;
}

export function isSamePhone(phoneA: string, phoneB: string): boolean {
  return normalizePhoneBenin(phoneA) === normalizePhoneBenin(phoneB);
}
