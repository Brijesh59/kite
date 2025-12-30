import { Input } from "@kite/ui";
import { Textarea } from "@kite/ui";
import { Button } from "@kite/ui";
import type { OnboardingFormData } from "./index";

interface Step1ProfileProps {
  data: OnboardingFormData;
  updateData: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
}

export function Step1Profile({ data, updateData, onNext }: Step1ProfileProps) {
  return (
    <div className="space-y-6 rounded-lg bg-white p-8 shadow">
      <div>
        <h2 className="text-2xl font-bold">Tell us about yourself</h2>
        <p className="mt-2 text-sm text-gray-600">
          Share a bit about who you are
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Bio (Optional)</label>
        <Textarea
          value={data.bio}
          onChange={(e) => updateData({ bio: e.target.value })}
          placeholder="Tell us about yourself..."
          maxLength={500}
          rows={4}
        />
        <p className="mt-1 text-sm text-gray-500">{data.bio.length}/500</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Avatar URL (Optional)
        </label>
        <Input
          value={data.avatar}
          onChange={(e) => updateData({ avatar: e.target.value })}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <Button onClick={onNext} className="w-full">
        Next
      </Button>
    </div>
  );
}
