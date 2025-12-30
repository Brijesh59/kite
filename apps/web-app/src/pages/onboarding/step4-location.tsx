import { Input } from "@kite/ui";
import { Button } from "@kite/ui";
import { useUpdateProfile } from "@/api/profile/use-profile";
import type { OnboardingFormData } from "./index";

interface Step4LocationProps {
  data: OnboardingFormData;
  updateData: (data: Partial<OnboardingFormData>) => void;
  onPrevious: () => void;
}

export function Step4Location({
  data,
  updateData,
  onPrevious,
}: Step4LocationProps) {
  const updateProfileMutation = useUpdateProfile();

  const handleSubmit = () => {
    // Transform the form data to match the API schema
    updateProfileMutation.mutate({
      bio: data.bio || undefined,
      avatar: data.avatar || undefined,
      metadata: {
        interests: data.interests.length > 0 ? data.interests : undefined,
        location: data.location || undefined,
        address:
          data.address.city || data.address.state || data.address.country
            ? data.address
            : undefined,
      },
    });
  };

  return (
    <div className="space-y-6 rounded-lg bg-white p-8 shadow">
      <div>
        <h2 className="text-2xl font-bold">Where are you located?</h2>
        <p className="mt-2 text-sm text-gray-600">
          Help us personalize your experience (optional)
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Location (City, Country)
        </label>
        <Input
          value={data.location}
          onChange={(e) => updateData({ location: e.target.value })}
          placeholder="San Francisco, USA"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">
          Detailed Address (Optional)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="mb-2 block text-sm font-medium">Street</label>
            <Input
              value={data.address.street}
              onChange={(e) =>
                updateData({
                  address: { ...data.address, street: e.target.value },
                })
              }
              placeholder="123 Main St"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">City</label>
            <Input
              value={data.address.city}
              onChange={(e) =>
                updateData({
                  address: { ...data.address, city: e.target.value },
                })
              }
              placeholder="San Francisco"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">State</label>
            <Input
              value={data.address.state}
              onChange={(e) =>
                updateData({
                  address: { ...data.address, state: e.target.value },
                })
              }
              placeholder="California"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">ZIP Code</label>
            <Input
              value={data.address.zip}
              onChange={(e) =>
                updateData({
                  address: { ...data.address, zip: e.target.value },
                })
              }
              placeholder="94102"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Country</label>
            <Input
              value={data.address.country}
              onChange={(e) =>
                updateData({
                  address: { ...data.address, country: e.target.value },
                })
              }
              placeholder="United States"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={onPrevious} variant="outline" className="flex-1">
          Previous
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1"
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending
            ? "Completing..."
            : "Complete Onboarding"}
        </Button>
      </div>
    </div>
  );
}
