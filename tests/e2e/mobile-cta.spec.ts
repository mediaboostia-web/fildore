import { test, expect, type Locator, type Page } from "@playwright/test";

/**
 * À 375 px, les actions principales occupent toute la largeur.
 *
 * Règle demandée et inscrite dans PROJECT_RULES.md §3 : sur mobile, l'action
 * principale d'un écran, le pied d'un formulaire et le pied d'une modale se
 * visent au pouce. Les actions internes à une carte ou à une ligne restent
 * compactes, sinon chaque carte s'allonge de plusieurs blocs empilés.
 */

test.skip(
  ({ viewport }) => (viewport?.width ?? 0) > 420,
  "Vérification propre au format mobile 375 px"
);

/** Le bouton occupe-t-il toute la largeur de son conteneur ? */
async function fillsItsRow(button: Locator): Promise<boolean> {
  return button.evaluate((el) => {
    const parent = el.parentElement;
    if (!parent) return false;
    // 1 px de tolérance : les largeurs rendues ne sont pas des entiers.
    return el.getBoundingClientRect().width >= parent.getBoundingClientRect().width - 1;
  });
}

async function signIn(page: Page) {
  await page.goto("/connexion");
  await page.getByRole("button", { name: /Amina Chabi/ }).click();
  await expect(page).toHaveURL(/\/tableau-de-bord/, { timeout: 15000 });
}

test.describe("Boutons pleine largeur sur mobile", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("l'action principale d'une page s'étend sur toute la largeur", async ({ page }) => {
    await page.goto("/clients");
    const cta = page.getByRole("link", { name: "Nouveau client" }).first();
    await expect(cta).toBeVisible();
    expect(await fillsItsRow(cta)).toBe(true);
  });

  test("le pied d'un formulaire s'étend sur toute la largeur", async ({ page }) => {
    await page.goto("/clients/nouveau");
    const submit = page.getByRole("button", { name: "Créer le client" });
    await expect(submit).toBeVisible();
    expect(await fillsItsRow(submit)).toBe(true);

    const cancel = page.getByRole("button", { name: "Annuler" });
    await expect(cancel).toBeVisible();
    expect(await fillsItsRow(cancel)).toBe(true);
  });

  test("le pied d'une modale s'étend sur toute la largeur", async ({ page }) => {
    await page.goto("/clients/nouveau");
    // Une saisie en cours : c'est ce qui déclenche la confirmation.
    await page.getByRole("textbox", { name: /Prénom/ }).fill("Gérard");
    await page.getByRole("button", { name: "Annuler" }).click();

    // Une modale, pas une alerte de navigateur.
    await expect(page.getByRole("heading", { name: "Abandonner la saisie ?" })).toBeVisible();

    const confirm = page.getByRole("button", { name: "Abandonner" });
    await expect(confirm).toBeVisible();
    expect(await fillsItsRow(confirm)).toBe(true);
  });

  test("les actions internes à une carte restent compactes", async ({ page }) => {
    // La contrepartie de la règle : tout mettre en pleine largeur allongerait
    // chaque carte de la liste et rendrait le défilement interminable.
    await page.goto("/modeles");
    const detail = page.getByRole("link", { name: /Détails/ }).first();
    await expect(detail).toBeVisible();
    const box = await detail.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThan(300);
  });
});
