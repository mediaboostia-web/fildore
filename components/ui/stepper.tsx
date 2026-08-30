import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface StepperStep {
  key: string;
  label: string;
}

export interface StepperProps {
  steps: StepperStep[];
  /** Index (0-based) de l'étape courante. */
  currentStep: number;
  className?: string;
}

/** Repère de progression pour un parcours en étapes (ex. création de commande). */
export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <ol className={cn("flex w-full items-start", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <li key={step.key} className="flex flex-1 flex-col items-center last:flex-none">
            <div className="flex w-full items-center">
              <span
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                  isCompleted && "border-primary-800 bg-primary-900 text-white",
                  isCurrent && !isCompleted && "border-primary-800 bg-primary-50 text-primary-900",
                  !isCompleted && !isCurrent && "border-border-strong bg-surface text-text-subtle"
                )}
              >
                {isCompleted ? <Check className="size-4" aria-hidden="true" /> : index + 1}
              </span>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={cn("mx-2 h-0.5 flex-1", isCompleted ? "bg-primary-800" : "bg-border")}
                />
              ) : null}
            </div>
            <span
              className={cn(
                "mt-2 max-w-20 text-center text-xs",
                isCurrent ? "font-medium text-text" : "text-text-subtle"
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
