// Re-export types from shared packages
import type { UpdateProfileRequest, ProfileResponse } from "@kite/types";

export type { UpdateProfileRequest, ProfileResponse };

// Type aliases for service layer
export type UserProfileData = UpdateProfileRequest;
export type UserProfileResponse = ProfileResponse;
