import { api } from "@/utils/api";
import type {
  ApiResponse,
  UpdateProfileRequest,
  ProfileResponse,
} from "@kite/types";

export const updateProfileApi = (data: UpdateProfileRequest) =>
  api.post<ApiResponse<{ profile: ProfileResponse }>>("/profile", data);

export const getProfileApi = () =>
  api.get<ApiResponse<{ completed: boolean; profile: ProfileResponse | null }>>(
    "/profile"
  );
