"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

export function LandingNavbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#fonctionnalites", label: "Fonctionnalités" },
    { href: "#comment-ca-marche", label: "Comment ça marche" },
    { href: "#whatsapp", label: "Communication WhatsApp" },
    { href: "#tarifs", label: "Tarifs" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-surface/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/Logo fildor.png"
            alt="Logo Fildor"
            width={36}
            height={36}
            className="size-9 rounded-xl object-contain shadow-xs transition-transform group-hover:scale-105"
            priority
          />
          <span className="text-xl font-bold tracking-tight text-primary-950">Fildor</span>
        </Link>

        {/* Liens Desktop */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-text-muted">
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

        {/* Actions Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/tableau-de-bord"
              className="inline-flex items-center justify-center rounded-full bg-primary-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-800 transition-colors"
            >
              Mon Atelier &rarr;
            </Link>
          ) : (
            <>
              <Link
                href="/connexion"
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="inline-flex items-center gap-2 rounded-full bg-primary-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-800 active:bg-primary-950 transition-all"
              >
                <span>Essayer gratuitement</span>
                <ArrowRight className="size-4" />
              </Link>
            </>
          )}
        </div>

        {/* Bouton Menu Mobile */}
        <div className="flex md:hidden items-center gap-2">
          {!isLoggedIn && (
            <Link
              href="/connexion"
              className="text-xs font-semibold text-primary-900 px-2 py-1"
            >
              Connexion
            </Link>
          )}
          <button
            type="button"
            aria-label="Ouvrir le menu mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-text hover:bg-surface-muted transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Tiroir Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-text hover:bg-surface-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-border flex flex-col gap-2.5">
              {isLoggedIn ? (
                <Link
                  href="/tableau-de-bord"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-lg bg-primary-900 py-2.5 text-sm font-medium text-white shadow-sm"
                >
                  Accéder à mon tableau de bord
                </Link>
              ) : (
                <>
                  <Link
                    href="/connexion"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-lg border border-border bg-surface py-2.5 text-sm font-medium text-text hover:bg-surface-muted"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/inscription"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-primary-900 py-2.5 text-sm font-medium text-white shadow-sm"
                  >
                    <span>Créer mon atelier gratuitement</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </>
              )}
              <p className="text-center text-[11px] text-text-subtle pt-1">
                Aucune carte bancaire requise · Prêt en 2 min
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
