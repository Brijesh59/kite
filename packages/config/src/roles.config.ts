export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  USER: "User",
  ADMIN: "Admin",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  USER: "Regular user with standard access to create and manage their own content",
  ADMIN: "Administrator with full access to manage users and all content",
};

// Roles that can be selected during registration
export const REGISTERABLE_ROLES: Role[] = [ROLES.USER];

// Admin-only roles (cannot be self-assigned)
export const PROTECTED_ROLES: Role[] = [ROLES.ADMIN];
