import { ServerClient } from "postmark";

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

export interface SMSNotification {
  to: string;
  message: string;
}

export interface LoginNotificationData {
  userEmail: string;
  userMobile?: string;
}

export class NotificationService {
  private postmarkClient: ServerClient | null = null;

  constructor() {
    // Initialize Postmark client if credentials are available
    const postmarkToken = process.env.POSTMARK_API_TOKEN;
    if (postmarkToken && postmarkToken !== "your_postmark_server_token") {
      this.postmarkClient = new ServerClient(postmarkToken);
    }
  }

  /**
   * Send email notification via Postmark or console (fallback)
   */
  async sendEmail(notification: EmailNotification): Promise<boolean> {
    try {
      if (this.postmarkClient && process.env.POSTMARK_FROM_EMAIL) {
        // Send via Postmark
        await this.postmarkClient.sendEmail({
          From: process.env.POSTMARK_FROM_EMAIL,
          To: notification.to,
          Subject: notification.subject,
          [notification.isHtml ? "HtmlBody" : "TextBody"]: notification.body,
        });
        console.log(
          `[EMAIL SENT] To: ${notification.to}, Subject: ${notification.subject}`
        );
      } else {
        // Fallback to console logging
        console.log(`[DUMMY EMAIL] To: ${notification.to}`);
        console.log(`[DUMMY EMAIL] Subject: ${notification.subject}`);
        console.log(`[DUMMY EMAIL] Body: ${notification.body}`);
      }
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(user: {
    email: string;
    name: string;
  }): Promise<boolean> {
    const subject = "Welcome!";
    const body = `
      <h1>Welcome ${user.name}!</h1>
      <p>Thank you for registering with our application.</p>
      <p>You can now complete your profile to get started.</p>
      <p>Best regards,<br/>The Team</p>
    `;
    return this.sendEmail({
      to: user.email,
      subject,
      body,
      isHtml: true,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    user: { email: string; name: string },
    resetToken: string
  ): Promise<boolean> {
    const resetUrl = `${process.env.WEB_APP_URL || 'http://localhost:5174'}/auth/reset-password?token=${resetToken}`;
    const subject = "Reset Your Password";
    const body = `
      <h1>Password Reset Request</h1>
      <p>Hi ${user.name},</p>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link expires in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br/>The Kite Team</p>
    `;
    return this.sendEmail({
      to: user.email,
      subject,
      body,
      isHtml: true,
    });
  }

  /**
   * Send SMS notification (dummy implementation)
   */
  async sendSMS(notification: SMSNotification): Promise<boolean> {
    try {
      console.log(`[DUMMY SMS] To: ${notification.to}`);
      console.log(`[DUMMY SMS] Message: ${notification.message}`);

      // Simulate SMS sending delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      return true;
    } catch (error) {
      console.error("Failed to send SMS:", error);
      return false;
    }
  }

  /**
   * Send login notification
   */
  async sendLoginNotification(data: LoginNotificationData): Promise<void> {
    const emailSubject = `Login Notification`;
    const emailBody = `
      <p>Dear User,</p>
      <p>You have successfully logged in to Kite!</p>
      <p>If this was not you, please contact support immediately.</p>
      <p>Best regards,<br/>The Kite Team</p>
    `;

    await this.sendEmail({
      to: data.userEmail,
      subject: emailSubject,
      body: emailBody,
      isHtml: true,
    });

    if (data.userMobile) {
      const smsMessage = `Login successful! If this wasn't you, contact support.`;
      await this.sendSMS({
        to: data.userMobile,
        message: smsMessage,
      });
    }
  }
}

// Singleton instance
let notificationServiceInstance: NotificationService | null = null;

export const getNotificationService = (): NotificationService => {
  if (!notificationServiceInstance) {
    notificationServiceInstance = new NotificationService();
  }
  return notificationServiceInstance;
};
