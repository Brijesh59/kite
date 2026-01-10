export const WORKSPACE_LIMITS = {
  nameMinLength: 3,
  nameMaxLength: 100,
  descriptionMaxLength: 500,
  maxWorkspacesPerUser: 10,
  minWorkspacesPerUser: 1,
} as const;

export const WORKSPACE_MEMBER_ROLES = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
} as const;
