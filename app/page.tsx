import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { LandingPainPointsSection } from "@/components/landing/pain-points-section";
import { LandingWhyFildorSection } from "@/components/landing/why-fildor-section";
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
      {/* 1. Barre de navigation intelligente */}
      <LandingNavbar isLoggedIn={isLoggedIn} />

      <main className="flex-1">
        {/* 2. Hero Section lumineuse, titre 3s et description < 50 chars */}
        <LandingHero />

        {/* 3. Section Douleurs Réelles (Pertes d'argent, temps, confiance) */}
        <LandingPainPointsSection />

        {/* 4. Section Pourquoi Fildor (Situations concrètes d'atelier & solutions) */}
        <LandingWhyFildorSection />

        {/* 5. Comment ça marche (Étapes simples en cascade & chiffres clés) */}
        <LandingHowItWorks />

        {/* 6. Fonctionnalités clés (Cartes atelier avec bordures d'accent) */}
        <LandingFeaturesSection />

        {/* 7. Témoignages réels de couturiers et modélistes vérifiés */}
        <LandingTestimonialsSection />

        {/* 8. Tarifs transparents en Franc CFA */}
        <LandingPricingSection />

        {/* 9. Questions fréquentes (FAQ) */}
        <LandingFAQSection />

        {/* 10. Communauté WhatsApp à fort impact & Appel à l'action */}
        <LandingFinalCTA />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
