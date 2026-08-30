import { test, expect, type Page } from "@playwright/test";

/**
 * Recherche et filtres des cinq listes.
 *
 * Ce que ces tests protègent concrètement :
 * - la recherche écrit dans l'URL (elle survit à un rechargement et se partage) ;
 * - elle **conserve** le filtre déjà posé, au lieu de l'écraser ;
 * - le compteur de résultats change, sans quoi une liste filtrée vide est
 *   indiscernable d'une liste vide tout court ;
 * - une seule croix efface la recherche.
 */

async function signIn(page: Page) {
  await page.goto("/connexion");
  await page.getByRole("button", { name: /Amina Chabi/ }).click();
  await expect(page).toHaveURL(/\/tableau-de-bord/, { timeout: 15000 });
}

test.describe("Recherche et filtres des listes", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("clients : la recherche filtre, s'écrit dans l'URL et s'efface d'une seule croix", async ({
    page,
  }) => {
    await page.goto("/clients");
    await expect(page.getByRole("heading", { name: "Clients" })).toBeVisible();

    const search = page.getByPlaceholder("Nom, numéro, ville ou quartier");
    await search.fill("Adjoavi");

    // Anti-rebond de 250 ms : l'URL n'est réécrite qu'une fois la frappe finie.
    await expect(page).toHaveURL(/[?&]q=Adjoavi/, { timeout: 10000 });
    await expect(page.getByText(/\d+ clients? sur \d+/)).toBeVisible();
    await expect(page.getByText("Adjoavi").first()).toBeVisible();

    // Une seule croix : Chrome dessine la sienne sur `type="search"`, masquée en CSS.
    const clear = page.getByRole("button", { name: "Effacer la recherche" });
    await expect(clear).toHaveCount(1);

    await clear.click();
    await expect(search).toHaveValue("");
    await expect(page).not.toHaveURL(/[?&]q=/, { timeout: 10000 });
  });

  test("clients : la recherche est un accent près", async ({ page }) => {
    // « Houngbedji » sans accent doit trouver « Houngbédji ».
    await page.goto("/clients?q=Houngbedji");
    await expect(page.getByText("Houngbédji").first()).toBeVisible();
  });

  test("commandes : le filtre et la recherche cohabitent dans l'URL", async ({ page }) => {
    await page.goto("/commandes");
    await expect(page.getByRole("heading", { name: "Commandes" })).toBeVisible();

    await page.getByRole("button", { name: /^En cours/ }).click();
    await expect(page).toHaveURL(/[?&]status=in_progress/, { timeout: 10000 });
    await expect(page.getByRole("button", { name: /^En cours/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await page.getByPlaceholder("Référence, titre, client ou numéro").fill("robe");

    // Le bug corrigé : la recherche écrasait tous les autres paramètres.
    await expect(page).toHaveURL(/[?&]q=robe/, { timeout: 10000 });
    await expect(page).toHaveURL(/[?&]status=in_progress/);

    await page.getByRole("button", { name: "Réinitialiser" }).click();
    await expect(page).not.toHaveURL(/status=in_progress/, { timeout: 10000 });
    await expect(page).toHaveURL(/[?&]q=robe/);
  });

  test("commandes : une valeur de filtre inconnue ne vide pas la liste", async ({ page }) => {
    await page.goto("/commandes?status=nimportequoi");
    await expect(page.getByRole("button", { name: /^Toutes/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  test("factures : le filtre par type de document répond", async ({ page }) => {
    await page.goto("/factures");
    await expect(page.getByRole("heading", { name: "Factures" })).toBeVisible();

    await page.getByRole("button", { name: /^Devis/ }).click();
    await expect(page).toHaveURL(/[?&]type=devis/, { timeout: 10000 });
    await expect(page.getByText(/\d+ documents? sur \d+/)).toBeVisible();
  });

  test("paiements : le filtre par moyen répond enfin", async ({ page }) => {
    // La page lisait déjà `?method=` côté serveur, mais aucune interface ne l'écrivait.
    await page.goto("/paiements");
    await expect(page.getByRole("heading", { name: /Paiements/ })).toBeVisible();

    await page.getByRole("button", { name: /^Espèces/ }).click();
    await expect(page).toHaveURL(/[?&]method=especes/, { timeout: 10000 });
    await expect(page.getByRole("button", { name: /^Espèces/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  test("modèles : la recherche porte sur le nom", async ({ page }) => {
    await page.goto("/modeles");
    await page.getByPlaceholder("Nom, description ou mot-clé").fill("boubou");

    await expect(page).toHaveURL(/[?&]q=boubou/, { timeout: 10000 });
    await expect(page.getByText("Boubou brodé homme").first()).toBeVisible();
    await expect(page.getByText("Uniforme scolaire")).toHaveCount(0);
  });

  test("une recherche sans résultat l'explique au lieu de laisser un écran vide", async ({
    page,
  }) => {
    await page.goto("/clients?q=zzzzzzintrouvable");
    await expect(page.getByText(/0 clients? sur \d+/)).toBeVisible();
    await expect(page.getByText(/Aucun client ne correspond/i)).toBeVisible();
  });
});
