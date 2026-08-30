import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-surface-muted px-4 py-10">
      <div className="w-full max-w-sm">
        <p className="mb-6 text-center text-xl font-semibold text-primary-900">Fildor</p>
        {children}
      </div>
    </div>
  );
}
