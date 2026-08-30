"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        className={cn(
          "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle",
          "focus:border-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-800/20 transition-all",
          "pr-10",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text transition-colors p-1 cursor-pointer"
        tabIndex={-1}
        title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
      >
        {showPassword ? (
          <EyeOff className="size-4 shrink-0" aria-hidden="true" />
        ) : (
          <Eye className="size-4 shrink-0" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
