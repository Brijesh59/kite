import { Button } from "@kite/ui";
import { useAuthStore } from "@/utils/auth-store";
import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, REGISTERABLE_ROLES } from "@kite/config";
import { AlertCircle } from "lucide-react";

interface Step2RoleProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function Step2Role({ onNext, onPrevious }: Step2RoleProps) {
  const user = useAuthStore((state) => state.user);

  // Get all roles with their metadata
  const roles = Object.values(ROLES).map((role) => ({
    value: role,
    label: ROLE_LABELS[role as keyof typeof ROLE_LABELS],
    description: ROLE_DESCRIPTIONS[role as keyof typeof ROLE_DESCRIPTIONS],
    isSelectable: REGISTERABLE_ROLES.includes(role as any),
  }));

  return (
    <div className="space-y-6 rounded-lg bg-white p-8 shadow">
      <div>
        <h2 className="text-2xl font-bold">Your Current Role</h2>
        <p className="mt-2 text-sm text-gray-600">
          Here's your assigned role and what it means
        </p>
      </div>

      <div className="space-y-4">
        {roles.map((role) => {
          const isCurrentRole = user?.role === role.value;
          const isDisabled = !role.isSelectable;

          return (
            <div
              key={role.value}
              className={`rounded-lg border-2 p-4 ${
                isCurrentRole
                  ? "border-blue-600 bg-blue-50"
                  : isDisabled
                  ? "border-gray-200 bg-gray-50 opacity-60"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{role.label}</h3>
                    {isCurrentRole && (
                      <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                        Your Role
                      </span>
                    )}
                    {isDisabled && (
                      <span className="flex items-center gap-1 rounded-full bg-gray-400 px-2 py-0.5 text-xs text-white">
                        <AlertCircle className="h-3 w-3" />
                        Admin Only
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Your role is set to <strong>{ROLE_LABELS[user?.role as keyof typeof ROLE_LABELS]}</strong>.
          This determines your permissions and access level in the application.
          {user?.role !== ROLES.ADMIN && " Contact an administrator to change your role if needed."}
        </p>
      </div>

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
