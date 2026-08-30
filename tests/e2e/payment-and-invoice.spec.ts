import { test, expect } from "@playwright/test";

test.describe("Paiement et documents depuis la fiche commande", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/connexion");
    await page.getByRole("button", { name: /Amina Chabi/ }).click();
    await expect(page).toHaveURL(/\/tableau-de-bord/);
  });

  test("créer une commande, encaisser le solde et voir le reçu généré", async ({ page }) => {
    // Création rapide d'une commande via le wizard (mêmes étapes que order-wizard.spec.ts).
    await page.goto("/commandes/nouveau/client");
    const firstClient = page.getByTestId(/client-select-/).first();
    await expect(firstClient).toBeVisible({ timeout: 15000 });
    await firstClient.click();
    await page.getByRole("button", { name: /Continuer vers Détails/i }).click();

    await expect(page).toHaveURL(/\/commandes\/nouveau\/details/);
    await page.getByPlaceholder(/Robe sirène/i).fill("Robe test paiement");
    await page.getByRole("button", { name: /Continuer vers Mesures/i }).click();

    await expect(page).toHaveURL(/\/commandes\/nouveau\/mesures/);
    const toPricingBtn = page.getByRole("button", { name: /Continuer vers Prix/i });
    await expect(toPricingBtn).toBeEnabled({ timeout: 15000 });
    await toPricingBtn.click();

    await expect(page).toHaveURL(/\/commandes\/nouveau\/prix/);
    await page.getByRole("button", { name: /Continuer vers Vérification/i }).click();

    await expect(page).toHaveURL(/\/commandes\/nouveau\/verification/);
    await expect(page.getByText("Total de la commande")).toBeVisible({ timeout: 15000 });
    await page.getByRole("button", { name: /Confirmer et créer la commande/i }).click();

    await expect(page).toHaveURL(/\/commandes\/order_/, { timeout: 15000 });

    // Un bon de commande est déjà généré automatiquement, aucun paiement encore.
    await expect(page.getByText(/Factures & Documents \(1\)/)).toBeVisible();
    await expect(page.getByText("Aucun paiement encaissé pour l'instant.")).toBeVisible();
    await expect(page.getByText(/Solde restant/)).toBeVisible();

    // Encaisser le solde complet depuis la fiche commande.
    await page.getByRole("button", { name: /Encaisser un acompte \/ solde/i }).click();
    await expect(page.getByText("Enregistrer un paiement")).toBeVisible();
    await page.getByRole("button", { name: /Valider le paiement/i }).click();

    // Le solde et les compteurs de la fiche se mettent à jour après le paiement.
    await expect(page.getByText("Payée en totalité")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Règlements reçus \(1\)/)).toBeVisible();
    await expect(page.getByText(/Factures & Documents \(2\)/)).toBeVisible();

    // Le reçu généré est consultable et imprimable.
    const receiptLink = page.locator('a[href^="/factures/"]').first();
    await receiptLink.waitFor({ state: "visible" });
    await Promise.all([page.waitForURL(/\/factures\//, { timeout: 15000 }), receiptLink.click()]);
    // Ciblé sur le titre de page (unique) plutôt qu'un texte générique
    // "Facture" qui matcherait aussi le lien de navigation "Factures & Paiements".
    await expect(page.getByRole("heading", { name: /^Document / })).toBeVisible();
  });
});
