import { Resend } from "resend";

const rawKey = (process.env.RESEND_API_KEY || "").replace(/["']/g, "").trim();
const resend = rawKey ? new Resend(rawKey) : null;

const SENDER_EMAIL = "Bashiru Perfect <bashiru@starkora.website>";
const NOTIFICATION_SENDER = "STARKORA Notifications <system@starkora.website>";
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_EMAIL || "bashiru@starkora.website";

export async function sendWelcomeEmail(toEmail: string, name?: string) {
  if (!resend) {
    console.log(`[SIMULATED EMAIL] Founder welcome email dispatched to ${toEmail}`);
    return;
  }

  const firstName = name ? name.split(" ")[0] : "there";
  const plainText = `
Hello ${firstName},

My name is Bashiru Perfect — I'm the Founder and CEO of STARKORA.

I started STARKORA because I want small and large-scale businesses and organizations to be able to create their professional websites themselves without breaking the bank and without stress, ASAP.

Whether you are running ads, selling products, or offering professional services, STARKORA was built to give you high-converting web pages with reliable customer inquiry channels from day one.

You can manage and customize your website anytime here:
https://starkora.website/dashboard

If you ever have any questions, feedback, or need help setting up your site, just reply directly to this email. It goes straight to my personal inbox.

Best regards,
Bashiru Perfect
Founder & CEO, STARKORA
  `.trim();

  try {
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: toEmail,
      replyTo: "bashiru@starkora.website",
      subject: "Welcome to STARKORA",
      text: plainText,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 20px; color: #1e293b; line-height: 1.6;">
          <p style="font-size: 15px; margin-bottom: 18px;">Hello ${firstName},</p>

          <p style="font-size: 15px; margin-bottom: 18px;">
            My name is <strong>Bashiru Perfect</strong> — I'm the Founder and CEO of STARKORA.
          </p>

          <p style="font-size: 15px; margin-bottom: 18px;">
            I started STARKORA because I want small and large-scale businesses and organizations to be able to create their professional websites themselves without breaking the bank and without stress, ASAP.
          </p>

          <p style="font-size: 15px; margin-bottom: 18px;">
            Whether you are running ads, selling products, or offering professional services, STARKORA was built to give you high-converting web pages with reliable customer inquiry channels from day one.
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

export async function sendAdminNewUserAlert(
  newUserEmail: string,
  newUserName?: string,
  newUserPhone?: string
) {
  if (!resend) return;

  const plainText = `New user signed up on STARKORA:\nName: ${newUserName || "Not provided"}\nEmail: ${newUserEmail}\nPhone: ${newUserPhone || "Not provided"}\nTime: ${new Date().toUTCString()}`;

  try {
    await resend.emails.send({
      from: NOTIFICATION_SENDER,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `🚀 New User Signed Up: ${newUserName || newUserEmail}`,
      text: plainText,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; max-width: 520px; color: #0f172a; line-height: 1.5;">
          <h2 style="color: #4f46e5; margin: 0 0 16px;">New Registration on STARKORA</h2>
          <p style="font-size: 14px; color: #334155; margin-bottom: 16px;">A new merchant has created an account on the platform:</p>
          <ul style="background: #f8fafc; padding: 16px 24px; border-radius: 12px; border: 1px solid #e2e8f0; list-style: none; margin: 0 0 20px;">
            <li style="margin-bottom: 8px; font-size: 14px;"><strong>Name:</strong> ${newUserName || "Not provided"}</li>
            <li style="margin-bottom: 8px; font-size: 14px;"><strong>Email:</strong> ${newUserEmail}</li>
            <li style="margin-bottom: 8px; font-size: 14px;"><strong>Phone:</strong> ${newUserPhone || "Not provided"}</li>
            <li style="font-size: 12px; color: #64748b;"><strong>Time:</strong> ${new Date().toUTCString()}</li>
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

export async function sendNewLeadAlertToOwner({
  ownerEmail,
  siteName,
  leadName,
  leadEmail,
  leadPhone,
  message,
}: {
  ownerEmail: string;
  siteName: string;
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
  message: string;
}) {
  if (!resend) return;

  const plainText = `
New Customer Inquiry on ${siteName}!

Customer Name: ${leadName}
Customer Email: ${leadEmail || "Not provided"}
Customer Phone: ${leadPhone || "Not provided"}

Message:
"${message}"

To respond to this customer, simply click 'Reply' to this email!
  `.trim();

  try {
    await resend.emails.send({
      from: NOTIFICATION_SENDER,
      to: ownerEmail,
      // Sets reply-to directly to the customer's email address
      replyTo: leadEmail || ownerEmail,
      subject: `📬 New Customer Message from ${leadName} on ${siteName}`,
      text: plainText,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px 24px; background-color: #020617; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
          <span style="font-size: 11px; font-weight: 800; color: #818cf8; letter-spacing: 0.05em; text-transform: uppercase;">Customer Inquiry</span>
          <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 8px 0 16px;">You received a new message on ${siteName}</h1>
          
          <div style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 18px; margin: 18px 0;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #94a3b8;">From: <strong style="color: #f8fafc;">${leadName}</strong></p>
            ${leadEmail ? `<p style="margin: 0 0 8px; font-size: 13px; color: #94a3b8;">Email: <strong style="color: #f8fafc;">${leadEmail}</strong></p>` : ""}
            ${leadPhone ? `<p style="margin: 0 0 8px; font-size: 13px; color: #94a3b8;">Phone: <strong style="color: #f8fafc;">${leadPhone}</strong></p>` : ""}
            <p style="margin: 12px 0 4px; font-size: 12px; text-transform: uppercase; font-weight: 700; color: #64748b;">Message Content:</p>
            <p style="margin: 0; font-size: 14px; color: #cbd5e1; line-height: 1.5; font-style: italic;">"${message}"</p>
          </div>

          <div style="margin: 24px 0 16px;">
            ${
              leadEmail
                ? `<a href="mailto:${leadEmail}?subject=Re: Your inquiry on${encodeURIComponent(siteName)}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                    ✉️ Click Here to Reply to ${leadName} ➔
                   </a>`
                : `<p style="font-size: 13px; color: #94a3b8;">Hit &quot;Reply&quot; in your email program to respond.</p>`
            }
          </div>

          <p style="font-size: 12px; color: #64748b; margin-top: 24px; border-top: 1px solid #1e293b; pt-4;">
            View all inquiries anytime in your <a href="https://starkora.website/dashboard" style="color: #818cf8; text-decoration: underline;">STARKORA Dashboard</a>.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to deliver lead alert email:", error);
  }
}

export async function sendPasswordResetEmail(toEmail: string, resetToken: string) {
  const resetLink = `https://starkora.website/reset-password?token=${resetToken}`;

  if (!resend) {
    console.log(`[SIMULATED EMAIL] Password reset email for ${toEmail}: ${resetLink}`);
    return;
  }

  const plainText = `
Reset Your STARKORA Password

We received a request to reset your password. Click or paste the link below to set a new password:
${resetLink}

This link expires in 1 hour. If you did not request this, please ignore this email.
  `.trim();

  try {
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: toEmail,
      subject: "Reset Your STARKORA Password",
      text: plainText,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background-color: #020617; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
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