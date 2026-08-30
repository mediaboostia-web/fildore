import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { LandingTrustBanner } from "@/components/landing/trust-banner";
import { LandingFeaturesSection } from "@/components/landing/features-section";
import { LandingTestimonialsSection } from "@/components/landing/testimonials-section";
import { LandingFAQSection } from "@/components/landing/faq-section";
import { LandingFinalCTA } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Fildor — Tout votre atelier de couture au même endroit",
  description:
    "Suivez vos commandes, retrouvez les mesures de vos clients et préparez vos messages WhatsApp sans jamais rien perdre. Pensé pour les couturiers et ateliers africains.",
};

export default async function HomePage() {
  const user = await getCurrentUser();
  const isLoggedIn = Boolean(user);

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col selection:bg-primary-900 selection:text-white">
      {/* Section 1 : Barre de navigation */}
      <LandingNavbar isLoggedIn={isLoggedIn} />

      <main className="flex-1">
        {/* Section 2 : Hero avec animation orbitale, badges flottants et aperçu d'application */}
        <LandingHero />

        {/* Section 3 : Bandeau de réassurance & chiffres d'impact */}
        <LandingTrustBanner />

        {/* Section 4 : Fonctionnalités clés (Grille de cartes épurées avec bordures d'accent) */}
        <LandingFeaturesSection />

        {/* Section 5 : Témoignages réels de couturiers et modélistes vérifiés */}
        <LandingTestimonialsSection />

        {/* Section 6 : Questions fréquemment posées (FAQ avec montage photo) */}
        <LandingFAQSection />

        {/* Section 7 : Appel à l'action final & Communauté */}
        <LandingFinalCTA />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
