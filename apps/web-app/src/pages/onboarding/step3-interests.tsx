import { Button } from "@kite/ui";
import { Checkbox } from "@kite/ui";
import { INTEREST_OPTIONS } from "@kite/config";
import type { OnboardingFormData } from "./index";

interface Step3InterestsProps {
  data: OnboardingFormData;
  updateData: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function Step3Interests({
  data,
  updateData,
  onNext,
  onPrevious,
}: Step3InterestsProps) {
  const toggleInterest = (interest: string) => {
    const interests = data.interests || [];
    const newInterests = interests.includes(interest)
      ? interests.filter((i) => i !== interest)
      : [...interests, interest];
    updateData({ interests: newInterests });
  };

  return (
    <div className="space-y-6 rounded-lg bg-white p-8 shadow">
      <div>
        <h2 className="text-2xl font-bold">What are your interests?</h2>
        <p className="mt-2 text-sm text-gray-600">
          Select topics that interest you (optional)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {INTEREST_OPTIONS.map((interest) => (
          <div key={interest} className="flex items-center space-x-2">
            <Checkbox
              id={interest}
              checked={data.interests?.includes(interest)}
              onCheckedChange={() => toggleInterest(interest)}
            />
            <label
              htmlFor={interest}
              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {interest}
            </label>
          </div>
        ))}
      </div>

      {data.interests.length > 0 && (
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-900">
            You've selected <strong>{data.interests.length}</strong> interest
            {data.interests.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <Button onClick={onPrevious} variant="outline" className="flex-1">
          Previous
        </Button>
        <Button onClick={onNext} className="flex-1">
          Next
        </Button>
      </div>
    </div>
  );
}
