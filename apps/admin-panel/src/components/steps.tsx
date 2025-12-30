import { Check } from "lucide-react";
import type { Step } from "@/hooks/useSteps";

interface StepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Steps({ steps, currentStep, className = "" }: StepsProps) {
  return (
    <div className={`flex items-center justify-center py-6 px-8 ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center space-y-1">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-normal ${
                step.id === currentStep
                  ? "bg-blue-600 text-white"
                  : step.id < currentStep
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
            </div>
            <div className="text-center">
              <div
                className={`text-xs font-medium ${
                  step.id === currentStep
                    ? "text-blue-600"
                    : step.id < currentStep
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {step.title}
              </div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-20 h-0.5 mx-4 ${
                step.id < currentStep ? "bg-green-600" : "bg-gray-300"
              }`}
              style={{ marginTop: "-12px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
