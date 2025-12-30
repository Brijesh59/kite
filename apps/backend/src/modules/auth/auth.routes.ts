import { Router, Express } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation";
import { authValidation } from "./auth.validation";

const router = Router();
const authController = new AuthController();

// Public routes
router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);
router.post("/login", validate(authValidation.login), authController.login);
router.post(
  "/send-otp",
  validate(authValidation.sendOtp),
  authController.sendOtp
);
router.post(
  "/verify-otp",
  validate(authValidation.verifyOtp),
  authController.verifyOtp
);
router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

// Protected routes
router.get("/me", authMiddleware, authController.getCurrentUser);

export function setAuthRoutes(app: Express) {
  app.use("/api/auth", router);
}
