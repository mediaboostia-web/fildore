import { describe, expect, it } from "vitest";
import { DEFAULT_REDIRECT, safeRedirectPath } from "@/lib/auth/safe-redirect";

describe("safeRedirectPath", () => {
  it("garde un chemin interne", () => {
    expect(safeRedirectPath("/commandes/order-1")).toBe("/commandes/order-1");
    expect(safeRedirectPath("/factures?type=facture")).toBe("/factures?type=facture");
  });

  it("refuse une URL absolue vers un autre site", () => {
    // Le scénario réel : un lien envoyé au couturier sur WhatsApp, qui le
    // dépose sur un faux Fildor juste après une connexion réussie.
    expect(safeRedirectPath("https://site-pirate.example/connexion")).toBe(DEFAULT_REDIRECT);
    expect(safeRedirectPath("http://site-pirate.example")).toBe(DEFAULT_REDIRECT);
  });

  it("refuse une URL protocol-relative, qui sort du site sans le dire", () => {
    expect(safeRedirectPath("//site-pirate.example")).toBe(DEFAULT_REDIRECT);
    expect(safeRedirectPath("/\site-pirate.example")).toBe(DEFAULT_REDIRECT);
  });

  it("refuse un javascript: déguisé", () => {
    expect(safeRedirectPath("javascript:alert(1)")).toBe(DEFAULT_REDIRECT);
  });

  it("refuse une injection de retour chariot dans l'en-tête Location", () => {
    expect(safeRedirectPath("/commandes\r\nSet-Cookie: a=b")).toBe(DEFAULT_REDIRECT);
  });

  it("retombe sur l'accueil quand rien n'est fourni", () => {
    expect(safeRedirectPath(null)).toBe(DEFAULT_REDIRECT);
    expect(safeRedirectPath("")).toBe(DEFAULT_REDIRECT);
    expect(safeRedirectPath(undefined)).toBe(DEFAULT_REDIRECT);
  });

  it("accepte une destination de repli explicite", () => {
    expect(safeRedirectPath(null, "/clients")).toBe("/clients");
  });
});
