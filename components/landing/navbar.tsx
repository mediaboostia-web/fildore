"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, LogIn } from "lucide-react";
import { FildorLogo } from "@/components/brand/fildor-logo";
import { cn } from "@/lib/utils/cn";

export function LandingNavbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Si on scrolle vers le bas et qu'on a dépassé 80px : masquer
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        // Si on scrolle vers le haut : afficher
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { href: "#comment-ca-marche", label: "Comment ça marche" },
    { href: "#fonctionnalites", label: "Fonctionnalités" },
    { href: "#temoignages", label: "Témoignages" },
    { href: "#tarifs", label: "Tarifs" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 w-full border-b border-border bg-surface transition-transform duration-300 ease-in-out shadow-xs",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <FildorLogo
            variant="lockup"
            height={30}
            priority
            className="transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Liens Desktop */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-text-muted">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Desktop : Bouton Connexion */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/tableau-de-bord"
              className="inline-flex items-center justify-center rounded-full bg-primary-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-800 transition-colors"
            >
              Mon Atelier &rarr;
            </Link>
          ) : (
            <Link
              href="/connexion"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary-900 bg-surface px-5 py-2 text-sm font-bold text-primary-900 shadow-2xs hover:bg-primary-50 active:scale-98 transition-all cursor-pointer"
            >
              <LogIn className="size-4" />
              <span>Connexion</span>
            </Link>
          )}
        </div>

        {/* Bouton Menu Mobile */}
        <div className="flex md:hidden items-center gap-2">
          {!isLoggedIn && (
            <Link
              href="/connexion"
              className="inline-flex items-center gap-1 rounded-full border border-primary-900 px-3 py-1.5 text-xs font-bold text-primary-900 bg-surface"
            >
              <LogIn className="size-3.5" />
              <span>Connexion</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu principal"
            className="rounded-lg p-2 text-text-muted hover:bg-surface-muted hover:text-text cursor-pointer"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Déroulant */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-surface px-4 py-6 md:hidden shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-text hover:text-primary-900 py-1"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-border flex flex-col gap-3">
              {isLoggedIn ? (
                <Link
                  href="/tableau-de-bord"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary-900 py-3 text-sm font-bold text-white shadow-sm"
                >
                  <span>Accéder à mon Atelier</span>
                  <ArrowRight className="size-4" />
                </Link>
              ) : (
                <Link
                  href="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-primary-900 py-3 text-sm font-bold text-primary-900 bg-surface"
                >
                  <LogIn className="size-4" />
                  <span>Connexion</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
