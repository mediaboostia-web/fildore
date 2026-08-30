import { describe, expect, it } from "vitest";
import {
  can,
  rolesAllowedTo,
  ROLE_PERMISSIONS,
  PERMISSION_LABELS,
  type Permission,
} from "@/features/auth/permissions";
import { ROLE_LABELS, type Role } from "@/features/auth/types";

const ALL_ROLES = Object.keys(ROLE_LABELS) as Role[];

describe("droits par rôle", () => {
  it("le propriétaire a tous les droits", () => {
    const every = Object.keys(PERMISSION_LABELS) as Permission[];
    for (const permission of every) {
      expect(can("owner", permission)).toBe(true);
    }
  });

  it("une couturière ne touche jamais à l'argent", () => {
    // Règle métier centrale : la couturière fait avancer la production,
    // elle n'encaisse pas et n'émet pas de document comptable.
    expect(can("couturiere", "commande:changer_statut")).toBe(true);
    expect(can("couturiere", "paiement:encaisser")).toBe(false);
    expect(can("couturiere", "paiement:annuler")).toBe(false);
    expect(can("couturiere", "document:generer")).toBe(false);
  });

  it("seul le propriétaire peut annuler un paiement ou une commande", () => {
    expect(rolesAllowedTo("paiement:annuler")).toEqual(["owner"]);
    expect(rolesAllowedTo("commande:annuler")).toEqual(["owner"]);
  });

  it("seul le propriétaire gère l'atelier et l'équipe", () => {
    expect(rolesAllowedTo("atelier:parametres")).toEqual(["owner"]);
    expect(rolesAllowedTo("equipe:gerer")).toEqual(["owner"]);
  });

  it("la réception peut encaisser un acompte et enregistrer des mesures", () => {
    expect(can("reception", "paiement:encaisser")).toBe(true);
    expect(can("reception", "mesures:enregistrer")).toBe(true);
    expect(can("reception", "client:creer")).toBe(true);
  });

  it("le comptable édite les documents mais ne modifie pas les commandes", () => {
    expect(can("comptable", "document:generer")).toBe(true);
    expect(can("comptable", "commande:modifier")).toBe(false);
    expect(can("comptable", "commande:changer_statut")).toBe(false);
  });

  it("un utilisateur sans session n'a aucun droit", () => {
    expect(can(null, "commande:changer_statut")).toBe(false);
    expect(can(undefined, "paiement:encaisser")).toBe(false);
  });

  it("chaque rôle connu possède une entrée explicite", () => {
    // Un rôle ajouté sans droits déclarés se retrouverait muet : autant le voir
    // ici plutôt que sur un écran vide en production.
    for (const role of ALL_ROLES) {
      expect(ROLE_PERMISSIONS[role]).toBeDefined();
    }
  });

  it("chaque droit a un libellé affichable sur la page Profil", () => {
    const declared = new Set(Object.values(ROLE_PERMISSIONS).flat());
    for (const permission of declared) {
      expect(PERMISSION_LABELS[permission]).toBeTruthy();
    }
  });
});
