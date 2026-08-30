import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge, ORDER_STATUS_CONFIG, type OrderStatus } from "@/components/ui/status-badge";

describe("StatusBadge", () => {
  it("affiche le libellé français explicite pour chaque statut", () => {
    render(<StatusBadge status="acompte_attendu" />);
    expect(screen.getByText("Acompte attendu")).toBeInTheDocument();
  });

  it.each<[OrderStatus, string]>([
    ["confirmee", "success"],
    ["prete", "success"],
    ["livree", "success"],
    ["terminee", "success"],
    ["acompte_attendu", "warning"],
    ["a_confirmer", "warning"],
    ["couture", "info"],
    ["essayage", "info"],
    ["annulee", "danger"],
    ["suspendue", "danger"],
    ["brouillon", "neutral"],
  ])(
    "mappe le statut « %s » sur la couleur fonctionnelle « %s » (PROJECT_RULES.md §4)",
    (status, expectedTone) => {
      expect(ORDER_STATUS_CONFIG[status].tone).toBe(expectedTone);
    }
  );

  it("n'exprime jamais un statut par la couleur seule : un libellé texte est toujours présent", () => {
    render(<StatusBadge status="annulee" />);
    const badge = screen.getByText("Annulée");
    expect(badge.textContent).toBe("Annulée");
  });

  it("couvre bien les 15 statuts de commande Fildor", () => {
    expect(Object.keys(ORDER_STATUS_CONFIG)).toHaveLength(15);
  });
});
