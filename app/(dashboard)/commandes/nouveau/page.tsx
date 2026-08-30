import { redirect } from "next/navigation";

export default function NouveauCommandeRootPage() {
  redirect("/commandes/nouveau/client");
}
