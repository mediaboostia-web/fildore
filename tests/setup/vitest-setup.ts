import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * Sans `globals: true` dans vitest.config.ts, l'auto-cleanup intégré de
 * @testing-library/react ne s'enregistre pas tout seul : chaque `render()`
 * laissait le DOM du test précédent en place, ce qui ne se voyait pas tant
 * que les tests interrogeaient des textes distincts. Démonte explicitement
 * après chaque test pour que `screen.getByText(...)` reste fiable même
 * quand plusieurs tests d'un même fichier rendent des contenus similaires.
 */
afterEach(() => {
  cleanup();
});
