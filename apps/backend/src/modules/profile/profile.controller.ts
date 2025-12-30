import { Request, Response } from "express";
import { ProfileService } from "./profile.service";
import { CatchAsyncClass } from "../../common/catch-async";
import type { AuthRequest } from "../../common/types";

@CatchAsyncClass()
export class ProfileController {
  private profileService: ProfileService;

  constructor() {
    this.profileService = new ProfileService();
  }

  async submitProfile(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const data = req.body;

    const profile = await this.profileService.createOrUpdateProfile(
      userId,
      data
    );

    res.status(200).json({
      message: "Profile updated successfully",
      data: { profile },
    });
  }

  async getProfileStatus(req: AuthRequest, res: Response) {
    const userId = req.user!.id;

    const profile = await this.profileService.getProfile(userId);
    const completed = profile !== null;

    res.status(200).json({
      message: "Profile status retrieved",
      data: {
        completed,
        profile,
      },
    });
  }
}
