import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PaymentHistory } from "@/app/(dashboard)/commandes/[orderId]/_components/payment-history";
import type { Payment } from "@/features/payments/types";

// Le composant importe une Server Action : on la neutralise, le test porte sur
// l'affichage (ce que le couturier voit), pas sur l'appel serveur.
vi.mock("@/features/payments/actions", () => ({
  cancelPaymentAction: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

function makePayment(overrides: Partial<Payment> = {}): Payment {
  return {
    id: "payment-1",
    workshopId: "workshop-1",
    orderId: "order-1",
    clientId: "client-1",
    type: "acompte",
    method: "mtn_momo",
    amount: 15000,
    status: "confirme",
    receiptNumber: "REC-2026-000001",
    recordedByUserId: "user-1",
    createdAt: "2026-08-20T10:00:00.000Z",
    ...overrides,
  };
}

describe("PaymentHistory", () => {
  it("annonce l'absence de paiement sans laisser de doute", () => {
    render(<PaymentHistory payments={[]} currentUserRole="owner" />);
    expect(screen.getByText(/Aucun paiement encaissé pour l'instant/i)).toBeInTheDocument();
    expect(screen.getByText(/Règlements reçus \(0\)/)).toBeInTheDocument();
  });

  it("affiche le montant, le moyen de paiement et le numéro de reçu", () => {
    render(<PaymentHistory payments={[makePayment()]} currentUserRole="owner" />);

    expect(screen.getByText("15 000 FCFA")).toBeInTheDocument();
    expect(screen.getByText(/MTN MoMo/)).toBeInTheDocument();
    expect(screen.getByText("REC-2026-000001")).toBeInTheDocument();
  });

  it("ne compte pas un paiement annulé, mais garde sa trace et son motif", () => {
    const payments = [
      makePayment(),
      makePayment({
        id: "payment-2",
        amount: 5000,
        status: "annule",
        cancellationReason: "Montant saisi en double",
      }),
    ];

    render(<PaymentHistory payments={payments} currentUserRole="owner" />);

    // Un seul règlement compte…
    expect(screen.getByText(/Règlements reçus \(1\)/)).toBeInTheDocument();
    // …mais la ligne annulée reste lisible, avec son motif.
    expect(screen.getByText("Annulé")).toBeInTheDocument();
    expect(screen.getByText(/Montant saisi en double/)).toBeInTheDocument();
    expect(screen.getByText("5 000 FCFA")).toBeInTheDocument();
  });

  it("propose l'annulation au propriétaire", () => {
    render(<PaymentHistory payments={[makePayment()]} currentUserRole="owner" />);
    expect(screen.getByRole("button", { name: /Annuler ce paiement/i })).toBeInTheDocument();
  });

  it("cache l'annulation aux rôles qui n'y ont pas droit", () => {
    // Miroir exact de `requireCan("paiement:annuler")` côté serveur : une
    // couturière ou une réception ne doit pas voir un bouton qui serait refusé.
    for (const role of ["couturiere", "reception", "comptable", "manager"] as const) {
      const { unmount } = render(
        <PaymentHistory payments={[makePayment()]} currentUserRole={role} />
      );
      expect(screen.queryByRole("button", { name: /Annuler ce paiement/i })).toBeNull();
      unmount();
    }
  });

  it("n'offre pas d'annuler un paiement déjà annulé", () => {
    render(
      <PaymentHistory
        payments={[makePayment({ status: "annule", cancellationReason: "Erreur" })]}
        currentUserRole="owner"
      />
    );
    expect(screen.queryByRole("button", { name: /Annuler ce paiement/i })).toBeNull();
  });
});
