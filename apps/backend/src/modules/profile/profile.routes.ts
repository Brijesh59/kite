import { Router, Express } from "express";
import { ProfileController } from "./profile.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation";
import { profileValidation } from "./profile.validation";

const router = Router();
const controller = new ProfileController();

router.post(
  "/",
  authMiddleware,
  validate(profileValidation.submit),
  controller.submitProfile.bind(controller)
);

router.get("/", authMiddleware, controller.getProfileStatus.bind(controller));

export function setProfileRoutes(app: Express) {
  app.use("/api/profile", router);
}
