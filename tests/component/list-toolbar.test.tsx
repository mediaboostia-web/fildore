import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ListToolbar } from "@/components/ui/list-toolbar";

const replace = vi.fn();

// `useSearchParams` renvoie l'URL simulée du test ; le hook lit en plus
// `window.location.search` au moment où l'anti-rebond expire, on tient donc les
// deux à jour ensemble.
let currentSearch = "";

function setUrl(search: string) {
  currentSearch = search;
  window.history.replaceState({}, "", `/commandes${search}`);
}

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/commandes",
  useSearchParams: () => new URLSearchParams(currentSearch),
}));

const FILTERS = [
  { key: "all", label: "Toutes", count: 34 },
  { key: "in_progress", label: "En cours", count: 12 },
  { key: "overdue", label: "En retard", count: 3 },
];

describe("ListToolbar", () => {
  beforeEach(() => {
    replace.mockClear();
    setUrl("");
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("annonce le nombre total quand rien n'est filtré", () => {
    render(
      <ListToolbar resultCount={34} totalCount={34} noun={["commande", "commandes"]} />
    );
    expect(screen.getByText("34 commandes")).toBeInTheDocument();
  });

  it("annonce « X sur Y » dès qu'un filtre réduit la liste", () => {
    // Sans ce compteur, une liste filtrée vide est indiscernable d'une liste
    // vide tout court : l'utilisateur croit avoir perdu ses données.
    render(
      <ListToolbar resultCount={0} totalCount={34} noun={["commande", "commandes"]} />
    );
    expect(screen.getByText("0 commande sur 34")).toBeInTheDocument();
  });

  it("écrit la recherche dans l'URL après l'anti-rebond, pas à chaque caractère", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <ListToolbar
        searchParam="q"
        searchValue=""
        searchLabel="Rechercher une commande"
        resultCount={34}
        totalCount={34}
        noun={["commande", "commandes"]}
      />
    );

    await user.type(screen.getByLabelText("Rechercher une commande"), "robe");

    // Rien n'est parti tant que la frappe continue : c'est ce qui faisait
    // « ramer » la liste (un rendu serveur complet par caractère).
    expect(replace).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(300);
    await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
    expect(replace).toHaveBeenCalledWith("/commandes?q=robe", { scroll: false });
  });

  it("conserve le filtre déjà posé quand on recherche", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    setUrl("?status=in_progress");

    render(
      <ListToolbar
        searchParam="q"
        searchValue=""
        searchLabel="Rechercher une commande"
        filterParam="status"
        filterValue="in_progress"
        filters={FILTERS}
        resultCount={12}
        totalCount={34}
        noun={["commande", "commandes"]}
      />
    );

    await user.type(screen.getByLabelText("Rechercher une commande"), "robe");
    await vi.advanceTimersByTimeAsync(300);

    // Le bug corrigé : la recherche réécrivait l'URL entière et effaçait le filtre.
    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith("/commandes?status=in_progress&q=robe", {
        scroll: false,
      })
    );
  });

  it("retire le paramètre plutôt que d'écrire `?status=all`", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    setUrl("?status=overdue");

    render(
      <ListToolbar
        filterParam="status"
        filterValue="overdue"
        filters={FILTERS}
        resultCount={3}
        totalCount={34}
        noun={["commande", "commandes"]}
      />
    );

    await user.click(screen.getByRole("button", { name: "Toutes (34)" }));
    expect(replace).toHaveBeenCalledWith("/commandes", { scroll: false });
  });

  it("affiche le compte de chaque filtre dans sa puce", () => {
    render(
      <ListToolbar
        filterParam="status"
        filterValue="all"
        filters={FILTERS}
        resultCount={34}
        totalCount={34}
        noun={["commande", "commandes"]}
      />
    );

    expect(screen.getByRole("button", { name: "En retard (3)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Toutes (34)" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
