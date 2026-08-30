import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingFeaturesSection } from "@/components/landing/features-section";
import { LandingTestimonialsSection } from "@/components/landing/testimonials-section";
import { LandingPricingSection } from "@/components/landing/pricing-section";
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
      {/* 1. Barre de navigation */}
      <LandingNavbar isLoggedIn={isLoggedIn} />

      <main className="flex-1">
        {/* 2. Hero Section sobre, percutante et sans dégradés fluo */}
        <LandingHero />

        {/* 3. Comment ça marche avec numéros en filigrane (01, 02, 03) */}
        <LandingHowItWorks />

        {/* 4. Fonctionnalités clés (Cartes épurées avec bordures d'accent) */}
        <LandingFeaturesSection />

        {/* 5. Témoignages réels de couturiers et modélistes vérifiés */}
        <LandingTestimonialsSection />

        {/* 6. Tarifs transparents en Franc CFA */}
        <LandingPricingSection />

        {/* 7. Questions fréquentes (FAQ) */}
        <LandingFAQSection />

        {/* 8. Chiffres d'impact, Communauté WhatsApp & Appel à l'action final */}
        <LandingFinalCTA />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
