import { describe, expect, it } from "vitest";
import { normalizePhoneBenin, isSamePhone } from "@/lib/utils/phone";

describe("normalizePhoneBenin", () => {
  it("normalise un numéro local avec 0 initial", () => {
    expect(normalizePhoneBenin("0197123456")).toBe("+229197123456");
  });

  it("normalise un numéro déjà au format international +229", () => {
    expect(normalizePhoneBenin("+229 01 97 12 34 56")).toBe("+2290197123456");
  });

  it("normalise un numéro écrit avec le préfixe international 00", () => {
    expect(normalizePhoneBenin("00229 97 12 34 56")).toBe("+22997123456");
  });
});

describe("isSamePhone", () => {
  it("détecte deux formats différents comme le même numéro", () => {
    expect(isSamePhone("0197123456", "+229 197 123 456")).toBe(true);
  });

  it("distingue deux numéros différents", () => {
    expect(isSamePhone("0197123456", "0197123457")).toBe(false);
  });
});
