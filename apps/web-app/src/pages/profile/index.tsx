import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@kite/ui";
import { Input } from "@kite/ui";
import { Textarea } from "@kite/ui";
import { Checkbox } from "@kite/ui";
import { useAuthStore } from "@/utils/auth-store";
import { INTEREST_OPTIONS } from "@kite/config";
import { useState } from "react";

const profileSchema = z.object({
  bio: z.string().max(500).optional(),
  avatar: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  location: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: "",
      avatar: "",
      location: "",
    },
  });

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const onSubmit = (data: ProfileForm) => {
    console.log("Profile data:", {
      ...data,
      metadata: {
        interests: selectedInterests,
        location: data.location,
      },
    });
    // TODO: Implement profile update API call
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-2 text-gray-600">
          Manage your profile information
        </p>
      </div>

      <div className="rounded-lg border bg-white p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* User Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Personal Information</h2>

            <div>
              <label className="mb-2 block text-sm font-medium">Name</label>
              <Input value={user?.name} disabled />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <Input value={user?.email} disabled />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Role</label>
              <Input value={user?.role} disabled />
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Profile Details</h2>

            <div>
              <label className="mb-2 block text-sm font-medium">Bio</label>
              <Textarea
                {...register("bio")}
                placeholder="Tell us about yourself..."
                maxLength={500}
                rows={4}
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Avatar URL</label>
              <Input
                {...register("avatar")}
                placeholder="https://example.com/avatar.jpg"
              />
              {errors.avatar && (
                <p className="mt-1 text-sm text-red-600">{errors.avatar.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Location</label>
              <Input
                {...register("location")}
                placeholder="San Francisco, USA"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Interests</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {INTEREST_OPTIONS.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={`interest-${interest}`}
                    checked={selectedInterests.includes(interest)}
                    onCheckedChange={() => toggleInterest(interest)}
                  />
                  <label
                    htmlFor={`interest-${interest}`}
                    className="cursor-pointer text-sm font-medium leading-none"
                  >
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
