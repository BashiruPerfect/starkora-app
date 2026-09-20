import { Resend } from "resend";

const rawKey = (process.env.RESEND_API_KEY || "").replace(/["']/g, "").trim();
const resend = rawKey ? new Resend(rawKey) : null;

const SENDER_EMAIL = "STARKORA <onboarding@resend.dev>";

export async function sendWelcomeEmail(toEmail: string, name?: string) {
  if (!resend) {
    console.log(`[SIMULATED EMAIL] Welcome email dispatched to ${toEmail}`);
    return;
  }

  try {
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: toEmail,
      subject: "Welcome to STARKORA — Your AI Website is Ready",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #020617; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: 900; color: #818cf8; letter-spacing: 0.05em;">STARKORA</span>
          </div>
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin-bottom: 16px; line-height: 1.3;">Welcome to the Future of Autonomous Web Building</h1>
          <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">Hello ${name || "there"},</p>
          <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
            Thank you for creating your account on STARKORA. Your business website has been generated, structured, and deployed across our global edge infrastructure.
          </p>
          <div style="margin: 32px 0;">
            <a href="https://starkora.website/dashboard" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);">
              Go to Your Dashboard ➔
            </a>
          </div>
          <p style="font-size: 13px; line-height: 1.6; color: #94a3b8;">
            You can customize copy, upload images, switch color palettes, and reply directly to incoming customer leads via WhatsApp at any time.
          </p>
          <hr style="border: 0; border-top: 1px solid #1e293b; margin: 28px 0;" />
          <p style="font-size: 11px; color: #64748b; line-height: 1.5;">
            STARKORA Autonomous Platform • Built for African merchants and global scale.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to deliver welcome email via Resend:", error);
  }
}

export async function sendPasswordResetEmail(toEmail: string, resetToken: string) {
  const resetLink = `https://starkora.website/reset-password?token=${resetToken}`;

  if (!resend) {
    console.log(`[SIMULATED EMAIL] Password reset email for ${toEmail}: ${resetLink}`);
    return;
  }

  try {
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: toEmail,
      subject: "Reset Your STARKORA Password",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #020617; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: 900; color: #818cf8; letter-spacing: 0.05em;">STARKORA</span>
          </div>
          <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin-bottom: 16px;">Password Reset Request</h1>
          <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
            We received a request to reset the password for your STARKORA account. Click the button below to choose a new password. This link will expire in 1 hour.
          </p>
          <div style="margin: 32px 0;">
            <a href="${resetLink}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
              Reset Password ➔
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
            If you did not request this password reset, no action is needed. Your account remains secure.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to deliver password reset email via Resend:", error);
  }
}