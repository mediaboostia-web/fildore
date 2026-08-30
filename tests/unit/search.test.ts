import { describe, expect, it } from "vitest";
import { matchesQuery, normalizeForSearch } from "@/lib/utils/search";

describe("normalizeForSearch", () => {
  it("retire les accents", () => {
    expect(normalizeForSearch("Houngbédji")).toBe("houngbedji");
    expect(normalizeForSearch("Grâce Ahouansou")).toBe("grace ahouansou");
    expect(normalizeForSearch("Cadjèhoun")).toBe("cadjehoun");
  });

  it("réduit les espaces multiples", () => {
    expect(normalizeForSearch("  Robe   wax  ")).toBe("robe wax");
  });
});

describe("matchesQuery", () => {
  it("laisse tout passer sur une requête vide", () => {
    expect(matchesQuery(["Adjoavi"], "")).toBe(true);
    expect(matchesQuery(["Adjoavi"], "   ")).toBe(true);
  });

  it("trouve un nom accentué tapé sans accent", () => {
    // C'est le cas réel : le couturier tape au clavier ce qu'il entend.
    expect(matchesQuery(["Adjoavi", "Houngbédji"], "houngbedji")).toBe(true);
    expect(matchesQuery(["Grâce", "Ahouansou"], "grace")).toBe(true);
  });

  it("exige que tous les mots correspondent, dans n'importe quel ordre", () => {
    const fields = ["FIL-CTN-000124", "Robe soirée wax", "Adjoavi Houngbédji"];
    expect(matchesQuery(fields, "adjoavi robe")).toBe(true);
    expect(matchesQuery(fields, "robe adjoavi")).toBe(true);
    expect(matchesQuery(fields, "adjoavi costume")).toBe(false);
  });

  it("retrouve un numéro tel qu'on le lit à voix haute", () => {
    // Stocké `+22997000001`, saisi « 97 00 00 » ou « 9700 ».
    expect(matchesQuery(["+22997000001"], "97 00 00")).toBe(true);
    expect(matchesQuery(["+22997000001"], "9700")).toBe(true);
    expect(matchesQuery(["+22997000001"], "+229 97")).toBe(true);
    expect(matchesQuery(["+22997000001"], "98 00")).toBe(false);
  });

  it("ignore les champs absents sans planter", () => {
    expect(matchesQuery([undefined, null, "", "Robe"], "robe")).toBe(true);
    expect(matchesQuery([undefined, null], "robe")).toBe(false);
  });

  it("cherche aussi dans les nombres", () => {
    expect(matchesQuery(["Commande", 35000], "35000")).toBe(true);
  });
});
