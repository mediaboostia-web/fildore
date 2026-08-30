import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Table, type DataTableColumn } from "@/components/ui/table";
import { MobileCardList } from "@/components/ui/mobile-card-list";

interface Row {
  id: string;
  reference: string;
  status: string;
  total: number;
}

const rows: Row[] = [
  { id: "1", reference: "FIL-CTN-000001", status: "Confirmée", total: 35000 },
  { id: "2", reference: "FIL-CTN-000002", status: "Livrée", total: 42000 },
];

// Une seule config de colonnes, alimentant les deux rendus — jamais deux
// mappings dupliqués (PROJECT_RULES.md, principe d'architecture Table/MobileCardList).
const columns: DataTableColumn<Row>[] = [
  { key: "reference", label: "Référence", emphasis: true, render: (row) => row.reference },
  { key: "status", label: "Statut", render: (row) => row.status },
  { key: "total", label: "Total", render: (row) => `${row.total} FCFA` },
];

describe("Table et MobileCardList partagent la même config de colonnes", () => {
  it("Table affiche le libellé de chaque colonne et le contenu de chaque ligne", () => {
    render(<Table columns={columns} data={rows} getRowKey={(row) => row.id} />);

    for (const column of columns) {
      expect(screen.getByText(column.label)).toBeInTheDocument();
    }
    expect(screen.getByText("FIL-CTN-000001")).toBeInTheDocument();
    expect(screen.getByText("42000 FCFA")).toBeInTheDocument();
  });

  it("MobileCardList affiche le même contenu que Table, sans redéfinir les colonnes", () => {
    render(<MobileCardList columns={columns} data={rows} getRowKey={(row) => row.id} />);

    // La colonne `emphasis` sert de titre de carte.
    expect(screen.getByText("FIL-CTN-000001")).toBeInTheDocument();
    expect(screen.getByText("FIL-CTN-000002")).toBeInTheDocument();
    // Les autres colonnes s'affichent en paires libellé / valeur.
    expect(screen.getAllByText("Statut")).toHaveLength(rows.length);
    expect(screen.getByText("Confirmée")).toBeInTheDocument();
    expect(screen.getByText("42000 FCFA")).toBeInTheDocument();
  });

  it("affiche un message vide identique quand il n'y a aucune donnée", () => {
    const { unmount } = render(<Table columns={columns} data={[]} getRowKey={(row) => row.id} />);
    expect(screen.getByText("Aucune donnée à afficher.")).toBeInTheDocument();
    unmount();

    render(<MobileCardList columns={columns} data={[]} getRowKey={(row) => row.id} />);
    expect(screen.getByText("Aucune donnée à afficher.")).toBeInTheDocument();
  });
});
