import { test, expect, type Page } from "@playwright/test";

/**
 * Depuis une fiche client, la commande part avec le client déjà choisi.
 *
 * Le bug corrigé : « Nouvelle commande » depuis une fiche client renvoyait vers
 * une étape 1 vide. Le couturier venait d'ouvrir Adjoavi, et Fildor lui
 * redemandait de chercher Adjoavi.
 */

async function signIn(page: Page) {
  await page.goto("/connexion");
  await page.getByRole("button", { name: /Amina Chabi/ }).click();
  await expect(page).toHaveURL(/\/tableau-de-bord/, { timeout: 15000 });
}

/** Renvoie l'URL de la fiche d'un client trouvé par recherche. */
async function findClientHref(page: Page, query: string): Promise<string> {
  await page.goto(`/clients?q=${encodeURIComponent(query)}`);
  const href = await page.getByRole("link", { name: new RegExp(query) }).first().getAttribute("href");
  expect(href).toMatch(/^\/clients\/client_/);
  return href!;
}

test.describe("Fiche client → commande préremplie", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("le client ouvert est déjà sélectionné à l'étape 1", async ({ page }) => {
    const clientHref = await findClientHref(page, "Adjoavi");
    await page.goto(clientHref);

    await page.getByRole("link", { name: /Commande pour/ }).click();

    await expect(page).toHaveURL(/\/commandes\/nouveau\/client\?client=client_/, {
      timeout: 15000,
    });
    await expect(page.getByText("Étape 1 : Choisir le client")).toBeVisible();
    await expect(page.getByText(/Commande pour\s+Adjoavi/)).toBeVisible();

    // On enchaîne sans rien choisir : c'est tout l'intérêt.
    await page.getByTestId("wizard-continuer").click();
    await expect(page).toHaveURL(/\/commandes\/nouveau\/details/, { timeout: 15000 });
  });

  test("« Choisir un autre client » rend la main", async ({ page }) => {
    const clientHref = await findClientHref(page, "Adjoavi");
    await page.goto(`${clientHref.replace("/clients/", "/commandes/nouveau/client?client=")}`);

    await expect(page.getByText(/Commande pour\s+Adjoavi/)).toBeVisible({ timeout: 15000 });
    await page.getByRole("button", { name: "Choisir un autre client" }).click();
    await expect(page.getByText(/Commande pour\s+Adjoavi/)).toHaveCount(0);
  });

  test("depuis l'onglet Mesures, le profil part avec la commande", async ({ page }) => {
    const clientHref = await findClientHref(page, "Adjoavi");
    await page.goto(clientHref);

    await page.getByRole("tab", { name: /Mesures/ }).click();
    await page.getByRole("link", { name: "Commander avec ces mesures" }).click();

    await expect(page).toHaveURL(/\/commandes\/nouveau\/client\?client=client_[^&]+&profil=/, {
      timeout: 15000,
    });
    await expect(page.getByText(/ses mesures sont déjà sélectionnées/)).toBeVisible();
  });
});
