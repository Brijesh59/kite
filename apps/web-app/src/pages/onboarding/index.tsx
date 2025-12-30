import { useState } from "react";
import { Step1Profile } from "./step1-profile";
import { Step2Role } from "./step2-role";
import { Step3Interests } from "./step3-interests";
import { Step4Location } from "./step4-location";
import { useAuthStore } from "@/utils/auth-store";

export interface OnboardingFormData {
  bio: string;
  avatar: string;
  interests: string[];
  location: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export default function OnboardingPage() {
  const user = useAuthStore((state) => state.user);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    bio: "",
    avatar: "",
    interests: [],
    location: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const previousStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const stepTitles = ["Profile", "Role", "Interests", "Location"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress indicator */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <h1 className="mb-4 text-center text-2xl font-bold">
            Welcome, {user?.name}!
          </h1>
          <p className="mb-6 text-center text-sm text-gray-600">
            Complete your profile to get started
          </p>
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      step <= currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  <span className="mt-2 text-xs font-medium text-gray-600">
                    {stepTitles[step - 1]}
                  </span>
                </div>
                {step < 4 && (
                  <div
                    className={`mx-2 h-1 flex-1 ${
                      step < currentStep ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="mx-auto max-w-2xl px-4 py-8">
        {currentStep === 1 && (
          <Step1Profile
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
          />
        )}
        {currentStep === 2 && (
          <Step2Role
            onNext={nextStep}
            onPrevious={previousStep}
          />
        )}
        {currentStep === 3 && (
          <Step3Interests
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        )}
        {currentStep === 4 && (
          <Step4Location
            data={formData}
            updateData={updateFormData}
            onPrevious={previousStep}
          />
        )}
      </div>
    </div>
  );
}
