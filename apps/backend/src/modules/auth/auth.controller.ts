import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CatchAsyncClass } from "../../common/catch-async";
import omit from "lodash/omit";
import { getNotificationService } from "../../services/notification.service";

@CatchAsyncClass()
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async register(req: Request, res: Response) {
    const { name, email, mobile, password } = req.body;

    const result = await this.authService.register({
      name,
      email,
      mobile,
      password,
    });

    // Set HTTP-only cookies
    this.setAuthCookies(res, result.tokens);

    // Send welcome email
    getNotificationService().sendWelcomeEmail({
      email: result.user.email,
      name: result.user.name,
    });

    res.status(201).json({
      message: "User registered successfully",
      data: {
        user: omit(result.user, ["password"]), // Omit password from response
        tokens: result.tokens,
      },
    });
  }

  public async login(req: Request, res: Response) {
    const { email, mobile, password, otp, clientType } = req.body;

    const result = await this.authService.login({
      email,
      mobile,
      password,
      otp,
    });

    // If logging in from admin panel, verify user has ADMIN role
    if (clientType === 'admin' && result.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    // Set HTTP-only cookies with client-specific names
    this.setAuthCookies(res, result.tokens, clientType);

    getNotificationService().sendLoginNotification({
      userEmail: result.user.email,
      userMobile: result.user.mobile || undefined,
    });

    res.status(200).json({
      message: "Login successful",
      data: {
        user: omit(result.user, ["password"]),
        tokens: result.tokens,
      },
    });
  }

  public async sendOtp(req: Request, res: Response) {
    const { email, mobile } = req.body;

    await this.authService.sendOtp({ email, mobile });

    res.status(200).json({
      message: "OTP sent successfully",
    });
  }

  public async verifyOtp(req: Request, res: Response) {
    const { email, mobile, otp } = req.body;

    const result = await this.authService.verifyOtp({
      email,
      mobile,
      otp,
    });

    // Set HTTP-only cookies
    this.setAuthCookies(res, result.tokens);

    getNotificationService().sendLoginNotification({
      userEmail: result.user.email,
      userMobile: result.user.mobile || undefined,
    });

    res.status(200).json({
      message: "OTP verified successfully",
      data: {
        user: omit(result.user, ["password"]),
        tokens: result.tokens,
      },
    });
  }

  public async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    await this.authService.forgotPassword({ email });

    res.status(200).json({
      message: "Password reset email sent",
    });
  }

  public async resetPassword(req: Request, res: Response) {
    const { token, password } = req.body;

    const result = await this.authService.resetPassword({
      token,
      password,
    });

    // Set HTTP-only cookies
    this.setAuthCookies(res, result.tokens);

    res.status(200).json({
      message: "Password reset successful",
      data: {
        user: omit(result.user, ["password"]),
        tokens: result.tokens,
      },
    });
  }

  public async refreshToken(req: Request, res: Response) {
    // Check for refresh token in cookies (both admin and web), then in body
    const refreshToken = req.cookies?.admin_refreshToken || req.cookies?.refreshToken || req.body.refreshToken;
    const clientType = req.cookies?.admin_refreshToken ? 'admin' : 'web';

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    const tokens = await this.authService.refreshTokens(refreshToken);

    // Set new HTTP-only cookies with the same client type
    this.setAuthCookies(res, tokens, clientType);

    res.status(200).json({
      message: "Tokens refreshed successfully",
      data: {
        tokens,
      },
    });
  }

  public async logout(req: Request, res: Response) {
    // Check for refresh token in cookies (both admin and web), then in body
    const refreshToken = req.cookies?.admin_refreshToken || req.cookies?.refreshToken || req.body.refreshToken;
    const clientType = req.cookies?.admin_refreshToken ? 'admin' : 'web';

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    // Clear HTTP-only cookies with the correct client type
    this.clearAuthCookies(res, clientType);

    res.status(200).json({
      message: "Logout successful",
    });
  }

  public async getCurrentUser(req: Request, res: Response) {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const user = await this.authService.getCurrentUser(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Get profile status
    const { ProfileService } = require("../profile/profile.service");
    const profileService = new ProfileService();
    const profileCompleted = await profileService.isProfileCompleted(userId);

    res.status(200).json({
      data: {
        user: omit(user, ["password"]),
        profile: {
          completed: profileCompleted,
        },
      },
    });
  }

  /**
   * Set HTTP-only cookies for authentication
   */
  private setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken?: string },
    clientType?: 'web' | 'admin'
  ) {
    const isProduction = process.env.NODE_ENV === "production";
    const prefix = clientType === 'admin' ? 'admin_' : '';


    res.cookie(`${prefix}accessToken`, tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      // maxAge: Infinity, // Set to Infinity for long-lived access tokens
    });

    if (tokens.refreshToken) {
      res.cookie(`${prefix}refreshToken`, tokens.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        // maxAge: Infinity,
      });
    }
  }

  /**
   * Parse JWT expiry string to milliseconds
   */
  private parseJwtExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 15 * 60 * 1000; // Default to 15 minutes

    const [, amount, unit] = match;
    const num = parseInt(amount, 10);

    switch (unit) {
      case "s":
        return num * 1000;
      case "m":
        return num * 60 * 1000;
      case "h":
        return num * 60 * 60 * 1000;
      case "d":
        return num * 24 * 60 * 60 * 1000;
      default:
        return 15 * 60 * 1000;
    }
  }

  /**
   * Clear HTTP-only cookies
   */
  private clearAuthCookies(res: Response, clientType?: 'web' | 'admin') {
    const prefix = clientType === 'admin' ? 'admin_' : '';
    res.clearCookie(`${prefix}accessToken`);
    res.clearCookie(`${prefix}refreshToken`);

    // Also clear the non-prefixed cookies for backward compatibility
    if (!clientType) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.clearCookie("admin_accessToken");
      res.clearCookie("admin_refreshToken");
    }
  }
}
