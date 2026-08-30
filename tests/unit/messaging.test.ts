import { describe, expect, it } from "vitest";
import {
  MESSAGE_TEMPLATES,
  getMessageTemplate,
  resolveMessageTemplate,
  buildWhatsAppLink,
} from "@/features/messaging/templates";
import type { MessageTemplateVariables } from "@/features/messaging/types";

/** Variables résolues à partir des données réelles du client et de la commande ciblés. */
function makeVariables(overrides: Partial<MessageTemplateVariables> = {}): MessageTemplateVariables {
  return {
    prenom_client: "Adjoa",
    nom_client: "Adjoa Koudjo",
    reference_commande: "FIL-CTN-000124",
    nom_commande: "Robe de soirée wax",
    date_livraison: "05/09/2026",
    montant_total: "65 000 FCFA",
    acompte: "20 000 FCFA",
    solde: "20 000 FCFA",
    nom_atelier: "Atelier Élégance",
    numero_atelier: "+229 97 00 00 00",
    lien_document: "https://fildor.app/d/abc123",
    ...overrides,
  };
}

describe("MESSAGE_TEMPLATES", () => {
  it("fournit les 11 templates du cahier des charges (section 6.7)", () => {
    expect(MESSAGE_TEMPLATES).toHaveLength(11);
  });

  it("a des clés uniques", () => {
    const keys = MESSAGE_TEMPLATES.map((t) => t.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("getMessageTemplate", () => {
  it("retrouve un template par sa clé", () => {
    const template = getMessageTemplate("confirmation_commande");
    expect(template.label).toBe("Confirmation commande");
  });

  it("lève une erreur explicite pour une clé inconnue", () => {
    // @ts-expect-error clé volontairement invalide pour tester la garde
    expect(() => getMessageTemplate("clef_inexistante")).toThrow();
  });
});

describe("resolveMessageTemplate", () => {
  it("résout chaque variable avec les données du client et de la commande ciblés", () => {
    const template = getMessageTemplate("rappel_solde");
    const resolved = resolveMessageTemplate(
      template,
      makeVariables({ prenom_client: "Adjoa", reference_commande: "FIL-CTN-000124", solde: "20 000 FCFA" })
    );

    expect(resolved).toBe(
      "Bonjour Adjoa, petit rappel : le solde de votre commande FIL-CTN-000124 est de 20 000 FCFA. Merci de le régler dès que possible."
    );
  });

  it("laisse un espace réservé inchangé plutôt que d'injecter « undefined » si une variable manque", () => {
    const template = getMessageTemplate("confirmation_commande");
    const incompleteVariables = makeVariables({ prenom_client: "Koffi" });
    // @ts-expect-error simule un appelant qui oublierait une variable requise
    delete incompleteVariables.reference_commande;

    const resolved = resolveMessageTemplate(template, incompleteVariables);

    expect(resolved).toContain("Bonjour Koffi");
    expect(resolved).toContain("{reference_commande}");
    expect(resolved).not.toContain("undefined");
  });
});

describe("buildWhatsAppLink", () => {
  it("construit un lien wa.me avec uniquement les chiffres du numéro", () => {
    const link = buildWhatsAppLink("+229 90 01 02 03", "Bonjour !");
    expect(link).toBe(`https://wa.me/22990010203?text=${encodeURIComponent("Bonjour !")}`);
  });

  it("encode le message pour l'URL", () => {
    const link = buildWhatsAppLink("22990010203", "Solde : 20 000 FCFA & merci");
    expect(link).toBe(
      `https://wa.me/22990010203?text=${encodeURIComponent("Solde : 20 000 FCFA & merci")}`
    );
  });
});
