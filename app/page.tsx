import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { LandingTrustBanner } from "@/components/landing/trust-banner";
import { LandingProblemsSection } from "@/components/landing/problems-section";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingFeaturesSection } from "@/components/landing/features-section";
import { LandingDashboardBenefits } from "@/components/landing/dashboard-benefits";
import { LandingTargetAudiences } from "@/components/landing/target-audiences";
import { LandingWhatsAppSection } from "@/components/landing/whatsapp-section";
import { LandingPilotProgram } from "@/components/landing/pilot-program";
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
    <div className="min-h-screen bg-background text-text flex flex-col selection:bg-primary-900 selection:text-white">
      {/* 1. Barre de navigation */}
      <LandingNavbar isLoggedIn={isLoggedIn} />

      <main className="flex-1">
        {/* 2. Hero avec titre compris en 3s & aperçu produit plat et réaliste */}
        <LandingHero />

        {/* 3. Bande de réassurance */}
        <LandingTrustBanner />

        {/* 4. Problèmes résolus */}
        <LandingProblemsSection />

        {/* 5. Comment Fildor fonctionne */}
        <LandingHowItWorks />

        {/* 6. Fonctionnalités principales */}
        <LandingFeaturesSection />

        {/* 7. Vue dashboard & bénéfices */}
        <LandingDashboardBenefits />

        {/* 8. Pour qui est Fildor ? */}
        <LandingTargetAudiences />

        {/* 9. Scénarios WhatsApp interactifs */}
        <LandingWhatsAppSection />

        {/* 10. Engagement Ateliers Pilotes */}
        <LandingPilotProgram />

        {/* 11. Tarifs transparents */}
        <LandingPricingSection />

        {/* 12. FAQ */}
        <LandingFAQSection />

        {/* 13. CTA final */}
        <LandingFinalCTA />
      </main>

      {/* 14. Footer */}
      <LandingFooter />
    </div>
  );
}
