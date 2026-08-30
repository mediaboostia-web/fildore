import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DocumentPreview } from "@/components/ui/document-preview";
import { computeBalance } from "@/lib/money/balance";

describe("DocumentPreview", () => {
  it("affiche un solde qui tient compte de la remise (computeBalance), pas seulement total - encaissé", () => {
    // Régression : une version antérieure calculait `totalAmount - paidAmount`
    // en ignorant complètement `discountAmount`.
    render(
      <DocumentPreview
        documentType="facture"
        number="FAC-2026-000142"
        date="30/08/2026"
        organizationName="Atelier Élégance"
        clientName="Adjoa Koudjo"
        totalAmount={65000}
        discountAmount={5000}
        paidAmount={45000}
      />
    );

    const expectedBalance = computeBalance(65000, 5000, 45000);
    expect(expectedBalance).toBe(15000);
    expect(screen.getByText("15 000 FCFA")).toBeInTheDocument();
    // La valeur erronée (ignorant la remise) ne doit apparaître nulle part.
    expect(screen.queryByText("20 000 FCFA")).not.toBeInTheDocument();
  });

  it("affiche la ligne « Remise » uniquement quand une remise est appliquée", () => {
    const { rerender } = render(
      <DocumentPreview
        documentType="facture"
        number="FAC-2026-000143"
        date="30/08/2026"
        organizationName="Atelier Élégance"
        clientName="Adjoa Koudjo"
        totalAmount={65000}
        discountAmount={5000}
        paidAmount={45000}
      />
    );
    expect(screen.getByText("Remise")).toBeInTheDocument();

    rerender(
      <DocumentPreview
        documentType="facture"
        number="FAC-2026-000143"
        date="30/08/2026"
        organizationName="Atelier Élégance"
        clientName="Adjoa Koudjo"
        totalAmount={65000}
        paidAmount={45000}
      />
    );
    expect(screen.queryByText("Remise")).not.toBeInTheDocument();
  });

  it("n'affiche pas le bloc de solde quand aucun paiement n'est renseigné (devis)", () => {
    render(
      <DocumentPreview
        documentType="devis"
        number="DEV-2026-000010"
        date="30/08/2026"
        organizationName="Atelier Élégance"
        clientName="Adjoa Koudjo"
        totalAmount={65000}
      />
    );
    expect(screen.queryByText("Solde restant")).not.toBeInTheDocument();
  });
});
