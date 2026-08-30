import { describe, expect, it } from "vitest";
import { computeBalance, isFullyPaid } from "@/lib/money/balance";
import { formatAmount } from "@/lib/money/format";

describe("computeBalance", () => {
  it("calcule total - remise - payé", () => {
    expect(computeBalance(35000, 0, 15000)).toBe(20000);
  });

  it("applique la remise avant le calcul", () => {
    expect(computeBalance(35000, 5000, 15000)).toBe(15000);
  });

  it("rejette les montants non entiers", () => {
    expect(() => computeBalance(35000.5, 0, 0)).toThrow();
  });
});

describe("isFullyPaid", () => {
  it("est vrai quand le solde est nul ou négatif", () => {
    expect(isFullyPaid(35000, 0, 35000)).toBe(true);
    expect(isFullyPaid(35000, 0, 40000)).toBe(true);
  });

  it("est faux quand un solde reste dû", () => {
    expect(isFullyPaid(35000, 0, 15000)).toBe(false);
  });
});

describe("formatAmount", () => {
  it("formate avec séparateur d'espace et devise", () => {
    expect(formatAmount(35000)).toBe("35 000 FCFA");
  });
});
