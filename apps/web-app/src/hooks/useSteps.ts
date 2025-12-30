import { useState } from "react";

export interface Step {
  id: number;
  title: string;
  description?: string;
}

export function useSteps(initialStep: number = 0) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const previousStep = () => setCurrentStep((prev) => prev - 1);
  const goToStep = (step: number) => setCurrentStep(step);
  const reset = () => setCurrentStep(initialStep);

  return {
    currentStep,
    nextStep,
    previousStep,
    goToStep,
    reset,
  };
}
