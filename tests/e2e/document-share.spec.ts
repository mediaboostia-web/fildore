import { test, expect, type Page } from "@playwright/test";

/**
 * Partage d'un document à un client.
 *
 * Le bug corrigé : « Partager » copiait l'adresse du tableau de bord
 * (`/factures/doc_…`), une page protégée. Chaque client à qui l'atelier envoyait
 * un devis tombait sur l'écran de connexion.
 *
 * Ces tests ouvrent le lien dans un **contexte navigateur neuf, sans session** :
 * c'est exactement ce que vit le client qui reçoit le message WhatsApp.
 */

async function signIn(page: Page) {
  await page.goto("/connexion");
  await page.getByRole("button", { name: /Amina Chabi/ }).click();
  await expect(page).toHaveURL(/\/tableau-de-bord/, { timeout: 15000 });
}

/** Ouvre le premier document de la liste sans dépendre du rendu tableau/carte. */
async function openFirstDocument(page: Page) {
  await page.goto("/factures");
  const href = await page.getByRole("link", { name: "Ouvrir" }).first().getAttribute("href");
  expect(href).toMatch(/^\/factures\/doc_/);
  await page.goto(href!);
  await expect(page.getByRole("heading", { name: /^Document / })).toBeVisible({ timeout: 15000 });
}

/** Ouvre la modale de partage et renvoie l'URL publique affichée. */
async function createShareUrl(page: Page): Promise<string> {
  await page.getByRole("button", { name: "Partager au client" }).click();

  const link = page.getByText(/https?:\/\/[^\s]+\/d\/[A-Za-z0-9_-]+/);
  await expect(link).toBeVisible({ timeout: 15000 });

  const url = (await link.textContent())?.trim() ?? "";
  expect(url).toContain("/d/");
  return url;
}

test.describe("Lien public d'un document", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("le client ouvre son document sans compte, et ne voit que celui-là", async ({
    page,
    browser,
  }) => {
    await openFirstDocument(page);
    const docNumber =
      (await page.getByRole("heading", { name: /^Document / }).textContent())?.replace(
        "Document ",
        ""
      ) ?? "";
    expect(docNumber).toMatch(/^[A-Z]+-\d{4}-\d{6}$/);

    const shareUrl = await createShareUrl(page);

    // Contexte neuf : ni cookie de session, ni stockage. C'est le client.
    const anonContext = await browser.newContext();
    const anonPage = await anonContext.newPage();
    await anonPage.goto(shareUrl);

    // Il voit son document…
    await expect(anonPage.getByText(docNumber).first()).toBeVisible({ timeout: 15000 });
    await expect(
      anonPage.getByRole("button", { name: "Télécharger mon document" })
    ).toBeVisible();

    // …et rien de l'atelier : aucune navigation, aucun retour vers les factures.
    await expect(anonPage).not.toHaveURL(/\/connexion/);
    await expect(anonPage.getByRole("link", { name: /Toutes les factures/i })).toHaveCount(0);
    await expect(anonPage.getByRole("link", { name: "Commandes", exact: true })).toHaveCount(0);
    await expect(anonPage.getByRole("link", { name: "Clients", exact: true })).toHaveCount(0);

    await anonContext.close();
  });

  test("désactiver le lien le rend immédiatement inopérant", async ({ page, browser }) => {
    await openFirstDocument(page);
    const shareUrl = await createShareUrl(page);

    const anonContext = await browser.newContext();
    const anonPage = await anonContext.newPage();
    await anonPage.goto(shareUrl);
    await expect(
      anonPage.getByRole("button", { name: "Télécharger mon document" })
    ).toBeVisible({ timeout: 15000 });

    // L'atelier révoque.
    await page.getByRole("button", { name: "Désactiver ce lien" }).click();
    await expect(page.getByRole("heading", { name: "Désactiver ce lien ?" })).toBeVisible();
    await page.getByRole("button", { name: "Désactiver le lien" }).click();
    await expect(page.getByText(/Le lien a été désactivé/i)).toBeVisible({ timeout: 15000 });

    // Le lien déjà envoyé ne s'ouvre plus.
    await anonPage.reload();
    await expect(anonPage.getByText("Ce lien n'est plus valable.")).toBeVisible({
      timeout: 15000,
    });
    await expect(
      anonPage.getByRole("button", { name: "Télécharger mon document" })
    ).toHaveCount(0);

    await anonContext.close();
  });

  test("un jeton inconnu donne exactement la même page qu'un jeton révoqué", async ({
    browser,
  }) => {
    // Distinguer les deux cas apprendrait à un inconnu qu'un document existe.
    const anonContext = await browser.newContext({ baseURL: "http://localhost:3000" });
    const anonPage = await anonContext.newPage();
    await anonPage.goto("/d/jeton-qui-n-a-jamais-existe");

    await expect(anonPage.getByText("Ce lien n'est plus valable.")).toBeVisible({
      timeout: 15000,
    });
    await anonContext.close();
  });
});
