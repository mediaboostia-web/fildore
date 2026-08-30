"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { SearchInput } from "@/components/ui/search-input";

export function OrderSearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const [, startTransition] = useTransition();

  const handleSearch = (newVal: string) => {
    setValue(newVal);
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = newVal.trim();
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <SearchInput
      value={value}
      onChange={handleSearch}
      placeholder="Rechercher par référence, titre, client..."
      label="Recherche de commande"
    />
  );
}
