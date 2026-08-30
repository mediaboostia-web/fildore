import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Les icônes (favicon, icône Apple) et les images sociales sont fournies par
 * les fichiers conventionnels de `app/` — `icon.svg`, `apple-icon.png`,
 * `opengraph-image.png`, `twitter-image.png` — générés par
 * `node scripts/brand/build-brand-assets.js`. Next.js les référence tout seul.
 */
export const metadata: Metadata = {
  title: {
    default: "Fildor — la gestion d'atelier de couture",
    template: "%s · Fildor",
  },
  description: "Le copilote opérationnel des ateliers de couture africains.",
  applicationName: "Fildor",
  manifest: "/brand/favicon/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Fildor",
    title: "Fildor — la gestion d'atelier de couture",
    description: "Ne perdez plus une commande, une mesure, une date de livraison ou un paiement.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fildor — la gestion d'atelier de couture",
    description: "Ne perdez plus une commande, une mesure, une date de livraison ou un paiement.",
  },
};

export const viewport = {
  themeColor: "#173B36",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-text">
        {children}
      </body>
    </html>
  );
}
