import { beforeEach, describe, expect, it } from "vitest";
import { resetDb } from "@/lib/mock-data/store";
import {
  createDocument,
  createShareToken,
  getDocumentByShareToken,
  revokeShareToken,
} from "@/lib/mock-data/documents";
import { isShareLinkActive, buildShareLinkPath } from "@/features/invoices/types";

const WORKSHOP_ID = "workshop_atelier_elegance";

async function makeDocument() {
  return createDocument({
    workshopId: WORKSHOP_ID,
    orderId: "order-1",
    clientId: "client-1",
    type: "devis",
    totalAmount: 30000,
    discountAmount: 0,
    paidAmount: 0,
  });
}

describe("lien public d'un document", () => {
  beforeEach(() => {
    resetDb();
  });

  it("n'existe pas tant que l'atelier ne l'a pas créé", async () => {
    const doc = await makeDocument();

    // Aucun document n'est public par défaut (PROJECT_RULES.md §6).
    expect(doc.shareToken).toBeUndefined();
    expect(isShareLinkActive(doc)).toBe(false);
  });

  it("s'ouvre une fois créé, et ne donne accès qu'à ce document", async () => {
    const doc = await makeDocument();
    const other = await makeDocument();

    const shared = await createShareToken(doc.id);
    expect(shared.shareToken).toBeTruthy();
    expect(isShareLinkActive(shared)).toBe(true);

    const found = await getDocumentByShareToken(shared.shareToken!);
    expect(found?.id).toBe(doc.id);
    expect(found?.id).not.toBe(other.id);
  });

  it("produit un jeton long et imprévisible", async () => {
    const doc = await makeDocument();
    const shared = await createShareToken(doc.id);

    // Le lien s'ouvre sans connexion : il ne doit pas se deviner.
    expect(shared.shareToken!.length).toBeGreaterThanOrEqual(32);
  });

  it("ne s'ouvre plus après révocation", async () => {
    const doc = await makeDocument();
    const shared = await createShareToken(doc.id);
    const token = shared.shareToken!;

    await revokeShareToken(doc.id);

    expect(await getDocumentByShareToken(token)).toBeUndefined();
    // Le document lui-même reste dans l'atelier, seul l'accès est coupé.
    expect(isShareLinkActive({ shareToken: token, shareRevokedAt: new Date().toISOString() })).toBe(
      false
    );
  });

  it("répond la même chose pour un jeton inconnu et un jeton révoqué", async () => {
    const doc = await makeDocument();
    const shared = await createShareToken(doc.id);
    await revokeShareToken(doc.id);

    // Rien ne doit laisser deviner qu'un document a existé à cette adresse.
    expect(await getDocumentByShareToken(shared.shareToken!)).toBeUndefined();
    expect(await getDocumentByShareToken("jeton-invente-au-hasard")).toBeUndefined();
    expect(await getDocumentByShareToken("")).toBeUndefined();
  });

  it("renouveler le lien invalide l'ancien", async () => {
    const doc = await makeDocument();
    const first = (await createShareToken(doc.id)).shareToken!;
    const second = (await createShareToken(doc.id)).shareToken!;

    expect(second).not.toBe(first);
    expect(await getDocumentByShareToken(first)).toBeUndefined();
    expect((await getDocumentByShareToken(second))?.id).toBe(doc.id);
  });

  it("construit un chemin public court et collable", () => {
    expect(buildShareLinkPath("abc123")).toBe("/d/abc123");
  });
});
