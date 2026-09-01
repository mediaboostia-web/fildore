import { test, expect } from "@playwright/test";

test.describe("Parcours de commande (Wizard 5 étapes)", () => {
  test.beforeEach(async ({ page }) => {
    // Connexion
    await page.goto("/connexion");
    await page.getByRole("button", { name: /Amina Chabi/ }).click();
    await expect(page).toHaveURL(/\/tableau-de-bord/);
  });

  test("créer une commande complète via le wizard en 5 étapes", async ({ page }) => {
    // 1. Démarrage
    await page.goto("/commandes/nouveau/client");
    await expect(page.getByText("Étape 1 : Choisir le client")).toBeVisible();

    // Attendre le chargement des clients
    const firstClient = page.getByTestId(/client-select-/).first();
    await expect(firstClient).toBeVisible({ timeout: 15000 });
    await firstClient.click();
    await page.getByTestId("wizard-continuer").click();

    // 2. Étape Détails
    await expect(page).toHaveURL(/\/commandes\/nouveau\/details/);
    await expect(page.getByText("Étape 2 : Détails de la tenue")).toBeVisible();

    await page.getByPlaceholder(/Robe sirène/i).fill("Robe sirène cérémonie test");
    await page.getByRole("button", { name: /Continuer vers Mesures/i }).click();

    // 3. Étape Mesures
    await expect(page).toHaveURL(/\/commandes\/nouveau\/mesures/);
    await expect(page.getByText("Étape 3 : Profil de mesures")).toBeVisible();

    // Attendre que le profil soit sélectionné et que le bouton devienne actif
    const toPricingBtn = page.getByRole("button", { name: /Continuer vers Prix/i });
    await expect(toPricingBtn).toBeEnabled({ timeout: 15000 });
    await toPricingBtn.click();

    // 4. Étape Prix — le montant doit être saisi. Aucun prix par défaut n'est
    // inventé : facturer un montant que le couturier n'a jamais tapé serait pire
    // qu'un blocage.
    await expect(page).toHaveURL(/\/commandes\/nouveau\/prix/);
    await expect(page.getByText("Étape 4 : Prix et acompte")).toBeVisible();

    await page.getByLabel(/Montant total/i).fill("35000");
    await page.getByRole("button", { name: /Continuer vers Vérification/i }).click();

    // 5. Étape Vérification
    await expect(page).toHaveURL(/\/commandes\/nouveau\/verification/);
    await expect(page.getByText("Étape 5 : Vérification & Confirmation")).toBeVisible();
    await expect(page.getByText("Total de la commande")).toBeVisible({ timeout: 15000 });

    // Confirmation
    await page.getByRole("button", { name: /Confirmer et créer la commande/i }).click();

    // Redirection vers la fiche commande
    await expect(page).toHaveURL(/\/commandes\/order_/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: /Robe sirène cérémonie test/i })).toBeVisible();
    await expect(page.getByText(/FIL-CTN-/).first()).toBeVisible();
  });
});
