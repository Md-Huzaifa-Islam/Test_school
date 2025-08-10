import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully to:", options.to);
      return true;
    } catch (error) {
      console.error("Email sending error:", error);
      return false;
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;

    const htmlTemplate = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">${process.env.NEXT_PUBLIC_APP_NAME}</h1>
          <p style="color: #64748b; margin: 5px 0 0 0;">Digital Competency Assessment Platform</p>
        </div>
        
        <div style="background: #f8fafc; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0;">Verify Your Email Address</h2>
          <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
            Thank you for registering with ${process.env.NEXT_PUBLIC_APP_NAME}! To complete your registration and start taking assessments, please verify your email address.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin: 20px 0 0 0;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #2563eb; font-size: 14px; word-break: break-all; margin: 5px 0 0 0;">
            ${verificationUrl}
          </p>
        </div>
        
        <div style="text-align: center; color: #64748b; font-size: 12px;">
          <p>This verification link will expire in 24 hours.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
      </div>
    `;

    const textTemplate = `
      Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}!
      
      Please verify your email address by clicking the link below:
      ${verificationUrl}
      
      This verification link will expire in 24 hours.
      
      If you didn't create an account, you can safely ignore this email.
    `;

    return this.sendEmail({
      to: email,
      subject: `Verify your email - ${process.env.NEXT_PUBLIC_APP_NAME}`,
      text: textTemplate,
      html: htmlTemplate,
    });
  }

  async sendOTP(email: string, otp: string): Promise<boolean> {
    const htmlTemplate = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">${process.env.NEXT_PUBLIC_APP_NAME}</h1>
          <p style="color: #64748b; margin: 5px 0 0 0;">Digital Competency Assessment Platform</p>
        </div>
        
        <div style="background: #f8fafc; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0;">Your Verification Code</h2>
          <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
            Use the following verification code to complete your email verification:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #2563eb; color: white; padding: 20px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; display: inline-block;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin: 20px 0 0 0; text-align: center;">
            This code will expire in 10 minutes.
          </p>
        </div>
        
        <div style="text-align: center; color: #64748b; font-size: 12px;">
          <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
      </div>
    `;

    const textTemplate = `
      Your verification code for ${process.env.NEXT_PUBLIC_APP_NAME}:
      
      ${otp}
      
      This code will expire in 10 minutes.
      
      If you didn't request this code, you can safely ignore this email.
    `;

    return this.sendEmail({
      to: email,
      subject: `Your verification code - ${process.env.NEXT_PUBLIC_APP_NAME}`,
      text: textTemplate,
      html: htmlTemplate,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

    const htmlTemplate = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">${process.env.NEXT_PUBLIC_APP_NAME}</h1>
          <p style="color: #64748b; margin: 5px 0 0 0;">Digital Competency Assessment Platform</p>
        </div>
        
        <div style="background: #f8fafc; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0;">Reset Your Password</h2>
          <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
            You requested a password reset for your account. Click the button below to set a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin: 20px 0 0 0;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #2563eb; font-size: 14px; word-break: break-all; margin: 5px 0 0 0;">
            ${resetUrl}
          </p>
        </div>
        
        <div style="text-align: center; color: #64748b; font-size: 12px;">
          <p>This reset link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      </div>
    `;

    const textTemplate = `
      Password Reset Request - ${process.env.NEXT_PUBLIC_APP_NAME}
      
      You requested a password reset for your account. Click the link below to set a new password:
      ${resetUrl}
      
      This reset link will expire in 1 hour.
      
      If you didn't request a password reset, you can safely ignore this email.
    `;

    return this.sendEmail({
      to: email,
      subject: `Reset your password - ${process.env.NEXT_PUBLIC_APP_NAME}`,
      text: textTemplate,
      html: htmlTemplate,
    });
  }
}

export default new EmailService();
