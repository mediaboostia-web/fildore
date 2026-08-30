"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface SidebarContextValue {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Charger la préférence depuis le localStorage au montage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fildor_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Ignore les erreurs de stockage
    }
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("fildor_sidebar_collapsed", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    try {
      localStorage.setItem("fildor_sidebar_collapsed", String(collapsed));
    } catch {
      // Ignore
    }
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    return {
      isCollapsed: false,
      toggleCollapsed: () => {},
      setCollapsed: () => {},
    };
  }
  return context;
}
