import { Resend } from "resend";

const rawKey = (process.env.RESEND_API_KEY || "").replace(/["']/g, "").trim();
const resend = rawKey ? new Resend(rawKey) : null;

// The sender identity: using your verified starkora.website domain
const SENDER_EMAIL = "Bashiru Perfect <bashiru@starkora.website>";

// Your personal/business email where you want to receive admin alerts
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_EMAIL || "hello@starkora.website";

export async function sendWelcomeEmail(toEmail: string, name?: string) {
  if (!resend) {
    console.log(`[SIMULATED EMAIL] Founder welcome email dispatched to ${toEmail}`);
    return;
  }

  try {
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: toEmail,
      replyTo: "bashiru@starkora.website",
      subject: "Welcome to STARKORA",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 20px; color: #1e293b; line-height: 1.6;">
          <p style="font-size: 15px; margin-bottom: 18px;">Hello${name ? ` ${name}` : ""},</p>

          <p style="font-size: 15px; margin-bottom: 18px;">
            My name is <strong>Bashiru Perfect</strong> — I'm the Founder and CEO of STARKORA.
          </p>

          <p style="font-size: 15px; margin-bottom: 18px;">
            I started STARKORA because I want small and large-scale businesses and organizations to be able to create their professional websites themselves without breaking the bank and without stress, ASAP.
          </p>

          <p style="font-size: 15px; margin-bottom: 18px;">
            Whether you are running Instagram or TikTok ads, selling products, or offering professional services, STARKORA was built to give you high-converting web pages with direct WhatsApp lead capture from day one.
          </p>

          <div style="margin: 28px 0;">
            <a href="https://starkora.website/dashboard" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">
              Open Your Dashboard ➔
            </a>
          </div>

          <p style="font-size: 15px; margin-bottom: 18px;">
            If you ever have any questions, feedback, or need help setting up your site, just reply directly to this email. It goes straight to my personal inbox.
          </p>

          <p style="font-size: 15px; margin-top: 28px; line-height: 1.4;">
            Best regards,<br />
            <strong>Bashiru Perfect</strong><br />
            <span style="color: #64748b; font-size: 13px;">Founder & CEO, STARKORA</span>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to deliver founder welcome email:", error);
  }
}

export async function sendAdminNewUserAlert(newUserEmail: string, newUserName?: string) {
  if (!resend) {
    console.log(`[SIMULATED EMAIL] Admin alert: New user ${newUserEmail}`);
    return;
  }

  try {
    await resend.emails.send({
      from: "STARKORA System <system@starkora.website>",
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `🚀 New User Signed Up: ${newUserName || newUserEmail}`,
      html: `
        <div style="font-family: sans-serif; padding: 24px; max-width: 500px; color: #0f172a; line-height: 1.5;">
          <h2 style="color: #4f46e5; margin-bottom: 16px;">New Registration on STARKORA</h2>
          <p>A new user has just registered an account:</p>
          <ul style="background: #f8fafc; padding: 16px 28px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <li><strong>Name:</strong> ${newUserName || "Not provided"}</li>
            <li><strong>Email:</strong> ${newUserEmail}</li>
            <li><strong>Timestamp:</strong> ${new Date().toUTCString()}</li>
          </ul>
          <p style="margin-top: 20px;">
            <a href="https://starkora.website/dashboard" style="color: #4f46e5; font-weight: bold; text-decoration: underline;">
              View Platform Dashboard ➔
            </a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background-color: #020617; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: 900; color: #818cf8; letter-spacing: 0.05em;">STARKORA</span>
          </div>
          <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin-bottom: 16px;">Password Reset Request</h1>
          <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
            We received a request to reset your password for your STARKORA account. Click the button below to choose a new password. This link will expire in 1 hour.
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