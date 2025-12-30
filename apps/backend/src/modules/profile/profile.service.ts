import { PrismaClient } from "@prisma/client";
import type {
  UserProfileData,
  UserProfileResponse,
} from "./profile.types";

export class ProfileService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createOrUpdateProfile(
    userId: string,
    data: UserProfileData
  ): Promise<UserProfileResponse> {
    const result = await this.prisma.userProfile.upsert({
      where: { userId },
      update: data as any,
      create: {
        userId,
        ...data as any,
      },
    });

    return result as unknown as UserProfileResponse;
  }

  async getProfile(
    userId: string
  ): Promise<UserProfileResponse | null> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    return profile as unknown as UserProfileResponse | null;
  }

  async isProfileCompleted(userId: string): Promise<boolean> {
    const profile = await this.getProfile(userId);
    return profile !== null;
  }

  async deleteProfile(userId: string): Promise<boolean> {
    try {
      await this.prisma.userProfile.delete({
        where: { userId },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
