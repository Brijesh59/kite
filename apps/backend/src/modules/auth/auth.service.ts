import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  BadRequestException,
  UnauthorizedException,
} from "../../common/app-error";
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SendOtpRequest,
  VerifyOtpRequest,
  ROLES,
} from "./auth.types";
import type { User, AuthTokens } from "@kite/types";

interface OtpDetails {
  code: string;
  expiresAt: Date;
}

export class AuthService {
  private prisma = new PrismaClient();

  /**
   * Register a new user with email and password
   */
  async register(
    data: RegisterRequest
  ): Promise<{ user: User; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email.toLowerCase() },
          ...(data.mobile ? [{ mobile: data.mobile }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        "User already exists with this email or mobile"
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user with default USER role
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        mobile: data.mobile,
        password: hashedPassword,
        role: ROLES.USER,
        isActive: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return { user: user as unknown as User, tokens };
  }

  /**
   * Login with email/password or email/mobile + OTP
   */
  async login(data: LoginRequest): Promise<{ user: User; tokens: AuthTokens }> {
    let user: any = null;

    // Find user by email or mobile
    if (data.email) {
      user = await this.prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });
    } else if (data.mobile) {
      user = await this.prisma.user.findUnique({
        where: { mobile: data.mobile },
      });
    }

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Password-based login
    if (data.password) {
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid credentials");
      }
    }
    // OTP-based login
    else if (data.otp) {
      const otp = await this.prisma.otp.findFirst({
        where: {
          userId: user.id,
          code: data.otp,
          type: data.email ? "EMAIL" : "MOBILE",
          used: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (!otp) {
        throw new UnauthorizedException("Invalid or expired OTP");
      }

      // Mark OTP as used
      await this.prisma.otp.update({
        where: { id: otp.id },
        data: { used: true },
      });

      // Mark user as verified
      await this.prisma.user.update({
        where: { id: user.id },
        data: data.email
          ? { isEmailVerified: true }
          : { isMobileVerified: true },
      });
    } else {
      throw new BadRequestException("Password or OTP is required");
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return { user: user as unknown as User, tokens };
  }

  /**
   * Send OTP to email or mobile
   */
  async sendOtp(data: SendOtpRequest): Promise<boolean> {
    let user: any = null;

    // Find user
    if (data.email) {
      user = await this.prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });
    } else if (data.mobile) {
      user = await this.prisma.user.findUnique({
        where: { mobile: data.mobile },
      });
    }

    if (!user) {
      throw new BadRequestException("User not found");
    }

    // Generate OTP
    const { code, expiresAt } = this.generateOtpDetails();

    // Store OTP in DB
    await this.prisma.otp.create({
      data: {
        userId: user.id,
        type: data.email ? "EMAIL" : "MOBILE",
        code,
        expiresAt,
      },
    });

    // TODO: Send OTP via email/SMS service
    console.log(`OTP for ${data.email || data.mobile}: ${code}`);

    return true;
  }

  /**
   * Verify OTP (for registration or login)
   */
  async verifyOtp(
    data: VerifyOtpRequest
  ): Promise<{ user: User; tokens: AuthTokens }> {
    let user: any = null;

    // Find user
    if (data.email) {
      user = await this.prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });
    } else if (data.mobile) {
      user = await this.prisma.user.findUnique({
        where: { mobile: data.mobile },
      });
    }

    if (!user) {
      throw new BadRequestException("User not found");
    }

    // Verify OTP
    const otp = await this.prisma.otp.findFirst({
      where: {
        userId: user.id,
        code: data.otp,
        type: data.email ? "EMAIL" : "MOBILE",
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otp) {
      throw new BadRequestException("Invalid or expired OTP");
    }

    // Mark OTP as used
    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { used: true },
    });

    // Mark user as verified
    await this.prisma.user.update({
      where: { id: user.id },
      data: data.email ? { isEmailVerified: true } : { isMobileVerified: true },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return { user: user as unknown as User, tokens };
  }

  /**
   * Forgot password - send reset token to email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return true;
    }

    // Generate reset token
    const resetToken = this.generateResetToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store reset token
    const savedToken = await this.prisma.authToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        type: "RESET_PASSWORD",
        expiresAt,
      },
    });

    // Send reset email
    const { getNotificationService } = require("../../services/notification.service");
    await getNotificationService().sendPasswordResetEmail(
      { email: user.email, name: user.name },
      savedToken.token
    );

    return true;
  }

  /**
   * Reset password using reset token
   */
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<{ user: User; tokens: AuthTokens }> {
    // Find valid reset token
    const authToken = await this.prisma.authToken.findFirst({
      where: {
        token: data.token,
        type: "RESET_PASSWORD",
        used: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!authToken) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Update user password
    const user = await this.prisma.user.update({
      where: { id: authToken.userId },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await this.prisma.authToken.update({
      where: { id: authToken.id },
      data: { used: true },
    });

    // Generate new tokens
    const tokens = await this.generateTokens(user);

    return { user: user as unknown as User, tokens };
  }

  /**
   * Refresh JWT tokens using refresh token
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    let payload: any;

    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    // Find the refresh token session
    const session = await this.prisma.session.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!session || !session.user.isActive) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    // Delete old session (token rotation)
    await this.prisma.session.delete({ where: { token: refreshToken } });

    // Generate new tokens
    return this.generateTokens(session.user);
  }

  /**
   * Logout - invalidate refresh token
   */
  async logout(refreshToken: string): Promise<boolean> {
    await this.prisma.session.deleteMany({
      where: { token: refreshToken },
    });
    return true;
  }

  /**
   * Get current user by ID
   */
  async getCurrentUser(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
    });
    return user as unknown as User | null;
  }

  /**
   * Generate JWT access and refresh tokens
   */
  private async generateTokens(user: any): Promise<AuthTokens> {
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(
      tokenPayload,
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
      } as jwt.SignOptions
    );

    // Store refreshToken in DB
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { accessToken, refreshToken };
  }

  /**
   * Generate OTP details
   */
  private generateOtpDetails(): OtpDetails {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    return { code, expiresAt };
  }

  /**
   * Generate reset token
   */
  private generateResetToken(): string {
    return jwt.sign(
      { purpose: "password_reset", timestamp: Date.now() },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" } as jwt.SignOptions
    );
  }
}
