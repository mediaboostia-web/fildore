import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationPopover } from "@/components/layout/notification-popover";
import type { WorkshopNotification } from "@/features/dashboard/notifications";

const ALERTE_RETARD: WorkshopNotification = {
  id: "livraison-order-1",
  tone: "danger",
  kind: "livraison",
  title: "Livraison en retard",
  description: "Robe soirée wax — Adjoavi Houngbédji (FIL-CTN-000124)",
  timing: "En retard de 8 jours",
  href: "/commandes/order-1",
};

const ALERTE_ACOMPTE: WorkshopNotification = {
  id: "paiement-order-2",
  tone: "danger",
  kind: "paiement",
  title: "Acompte en retard",
  description: "Koffi Dossou — solde de 20 000 FCFA sur FIL-CTN-000125",
  timing: "Échu",
  href: "/commandes/order-2",
};

describe("NotificationPopover", () => {
  it("annonce clairement qu'il n'y a rien à traiter", async () => {
    render(<NotificationPopover notifications={[]} />);

    const bouton = screen.getByRole("button", { name: /rien à signaler/i });
    await userEvent.click(bouton);

    // État vide explicite, jamais un exemple inventé pour « remplir » le panneau.
    expect(screen.getByText("Rien à signaler.")).toBeInTheDocument();
    expect(
      screen.getByText(/Aucune livraison proche, acompte en retard ni demande en attente/i)
    ).toBeInTheDocument();
  });

  it("compte les alertes dans le libellé accessible du bouton", () => {
    render(<NotificationPopover notifications={[ALERTE_RETARD, ALERTE_ACOMPTE]} />);
    expect(screen.getByRole("button", { name: /2 à traiter/i })).toBeInTheDocument();
  });

  it("affiche chaque alerte avec son échéance et un lien vers la commande", async () => {
    render(<NotificationPopover notifications={[ALERTE_RETARD, ALERTE_ACOMPTE]} />);
    await userEvent.click(screen.getByRole("button", { name: /2 à traiter/i }));

    expect(screen.getByText("Livraison en retard")).toBeInTheDocument();
    expect(screen.getByText(/FIL-CTN-000124/)).toBeInTheDocument();
    expect(screen.getByText("En retard de 8 jours")).toBeInTheDocument();

    const lien = screen.getByRole("link", { name: /Livraison en retard/i });
    expect(lien).toHaveAttribute("href", "/commandes/order-1");
  });

  it("ferme le panneau au clic sur la croix", async () => {
    render(<NotificationPopover notifications={[ALERTE_RETARD]} />);
    await userEvent.click(screen.getByRole("button", { name: /1 à traiter/i }));
    expect(screen.getByText("Livraison en retard")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Fermer les notifications/i }));
    expect(screen.queryByText("Livraison en retard")).not.toBeInTheDocument();
  });
});
