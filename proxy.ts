import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

/**
 * `proxy.ts` remplace `middleware.ts` depuis Next.js 16 (fichier déprécié).
 * Ne vérifie que la PRÉSENCE du cookie de session (garde rapide, pas de
 * lecture base de données ici) — la validation réelle de l'utilisateur et du
 * rôle se fait dans `requireCurrentUser()`/`requireRole()` côté Server
 * Component et Server Action, car le proxy ne couvre pas les Server Actions.
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  if (!hasSession) {
    const loginUrl = new URL("/connexion", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/tableau-de-bord/:path*",
    "/commandes/:path*",
    "/clients/:path*",
    "/paiements/:path*",
    "/factures/:path*",
    "/modeles/:path*",
    "/messages/:path*",
    "/parametres/:path*",
    "/profil/:path*",
  ],
};
