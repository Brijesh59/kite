export interface ProfileMetadata {
  interests?: string[];
  location?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

export interface UpdateProfileRequest {
  bio?: string;
  avatar?: string;
  metadata?: ProfileMetadata;
}

export interface ProfileResponse {
  id: string;
  userId: string;
  bio?: string | null;
  avatar?: string | null;
  metadata?: ProfileMetadata | null;
  createdAt: string;
  updatedAt: string;
}
