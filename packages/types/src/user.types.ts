export type UserRole = "ADMIN" | "ORGANISER" | "ARTIST" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string | null;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string | null;
  avatar?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithProfile extends User {
  profile?: UserProfile;
}

// User request/mutation types
export interface CreateUserRequest {
  name: string;
  email: string;
  mobile?: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
