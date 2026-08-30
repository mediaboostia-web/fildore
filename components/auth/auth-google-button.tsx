"use client";

import { googleAuthAction } from "@/features/auth/actions";
import { GoogleIcon } from "./google-icon";

interface AuthGoogleButtonProps {
  label?: string;
  redirectTo?: string;
}

export function AuthGoogleButton({
  label = "Continuer avec Google",
  redirectTo,
}: AuthGoogleButtonProps) {
  return (
    <form action={googleAuthAction} className="w-full">
      <input type="hidden" name="redirect" value={redirectTo ?? ""} />
      <button
        type="submit"
        className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-border/90 bg-surface px-4 py-3 text-sm font-semibold text-text shadow-xs hover:border-primary-800/60 hover:bg-surface-muted active:scale-[0.98] transition-all duration-150 cursor-pointer"
      >
        <GoogleIcon className="size-5 shrink-0 transition-transform group-hover:scale-110" />
        <span className="font-semibold text-text group-hover:text-primary-950">
          {label}
        </span>
      </button>
    </form>
  );
}
