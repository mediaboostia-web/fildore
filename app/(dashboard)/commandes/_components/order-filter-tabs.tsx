"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterBar, type FilterChip } from "@/components/ui/filter-bar";

export function OrderFilterTabs({ currentFilter = "all" }: { currentFilter?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: FilterChip[] = [
    { key: "all", label: "Toutes", active: currentFilter === "all" },
    { key: "in_progress", label: "En cours", active: currentFilter === "in_progress" },
    { key: "awaiting_deposit", label: "Acompte attendu", active: currentFilter === "awaiting_deposit" },
    { key: "due_soon", label: "À livrer bientôt", active: currentFilter === "due_soon" },
    { key: "overdue", label: "En retard", active: currentFilter === "overdue" },
    { key: "completed", label: "Livrées / Terminées", active: currentFilter === "completed" },
  ];

  const handleToggle = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") {
      params.delete("status");
    } else {
      params.set("status", key);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("status");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <FilterBar
      filters={filters}
      onToggle={handleToggle}
      onReset={currentFilter !== "all" ? handleReset : undefined}
    />
  );
}
