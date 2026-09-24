import { Resend } from "resend";

const rawKey = (process.env.RESEND_API_KEY || "").replace(/["']/g, "").trim();
const resend = rawKey ? new Resend(rawKey) : null;

const SENDER_EMAIL = "Bashiru Perfect <bashiru@starkora.website>";
const NOTIFICATION_SENDER = "STARKORA System <system@starkora.website>";
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_EMAIL || "bashiru@starkora.website";

export async function sendWelcomeEmail(toEmail: string, name?: string) {
  if (!resend) {
    console.log(`[SIMULATED EMAIL] Founder welcome email dispatched to ${toEmail}`);
    return;
  }

  const recipientName = name && name.trim() ? name.trim().split(" ")[0] : "Owolabi";

  const plainText = `
Hello ${recipientName},

I am Bashiru Perfect, Founder and CEO of STARKORA.

First, thank you for choosing and using STARKORA. We truly appreciate having you with us.

I created STARKORA with a simple vision: to make it easier for businesses and organizations of every size to establish a professional online presence without the high cost, technical complexity, or long waiting times.

Whether you sell products, run advertisements, provide professional services, or are simply looking to take your business online, STARKORA gives you the tools to create a professional website designed to help you attract visitors and turn them into customers.

And your next step is already waiting for you.

Your STARKORA dashboard is ready. Your dashboard gives you access to everything you need to start building and managing your website.

Open your STARKORA dashboard:
https://starkora.website/dashboard

Take a few minutes to explore what is available and see how quickly you can bring your business online.

If you have any questions, feedback, or need help setting things up, simply reply to this email. Your message will come directly to my personal inbox, and I will be happy to assist.

Once again, thank you for using STARKORA and for being part of what we are building.

Your business deserves a strong presence online.
Let’s build it.

Best regards,

Bashiru Perfect
Founder and CEO
STARKORA
  `.trim();

  try {
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: toEmail,
      replyTo: "bashiru@starkora.website",
      subject: "Welcome to STARKORA — Let's build your online presence",
      text: plainText,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 36px 24px; background-color: #ffffff; color: #1e293b; line-height: 1.65; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 18px; font-weight: 900; color: #4f46e5; letter-spacing: 0.05em;">STARKORA</span>
          </div>

          <p style="font-size: 15px; margin-bottom: 18px; color: #0f172a;">Hello <strong>${recipientName}</strong>,</p>

          <p style="font-size: 15px; margin-bottom: 18px; color: #334155;">
            I am <strong>Bashiru Perfect</strong>, Founder and CEO of <strong>STARKORA</strong>.
          </p>

          <p style="font-size: 15px; margin-bottom: 18px; color: #334155;">
            First, thank you for choosing and using STARKORA. We truly appreciate having you with us.
          </p>

          <p style="font-size: 15px; margin-bottom: 18px; color: #334155;">
            I created STARKORA with a simple vision: to make it easier for businesses and organizations of every size to establish a professional online presence without the high cost, technical complexity, or long waiting times.
          </p>

          <p style="font-size: 15px; margin-bottom: 24px; color: #334155;">
            Whether you sell products, run advertisements, provide professional services, or are simply looking to take your business online, STARKORA gives you the tools to create a professional website designed to help you attract visitors and turn them into customers.
          </p>

          <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 18px 20px; border-radius: 6px; margin: 24px 0;">
            <p style="margin: 0 0 6px; font-size: 15px; font-weight: 700; color: #0f172a;">And your next step is already waiting for you.</p>
            <p style="margin: 0 0 16px; font-size: 14px; color: #475569;">
              Your STARKORA dashboard is ready. It gives you access to everything you need to start building and managing your website.
            </p>
            <a href="https://starkora.website/dashboard" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px; display: inline-block;">
              OPEN YOUR STARKORA DASHBOARD ➔
            </a>
          </div>

          <p style="font-size: 15px; margin-bottom: 18px; color: #334155;">
            Take a few minutes to explore what is available and see how quickly you can bring your business online.
          </p>

          <p style="font-size: 15px; margin-bottom: 18px; color: #334155;">
            If you have any questions, feedback, or need help setting things up, simply reply to this email. Your message will come directly to my personal inbox, and I will be happy to assist.
          </p>

          <p style="font-size: 15px; margin-bottom: 20px; color: #334155;">
            Once again, <em>thank you for using STARKORA and for being part of what we are building.</em>
          </p>

          <p style="font-size: 15px; margin-bottom: 4px; color: #0f172a;">Your business deserves a strong presence online.</p>
          <p style="font-size: 15px; font-weight: 700; color: #4f46e5; margin-top: 0;"><em>Let’s build it.</em></p>

          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 14px; margin: 0; color: #0f172a;">Best regards,</p>
            <p style="font-size: 15px; font-weight: 700; margin: 4px 0 0; color: #0f172a;"><em>Bashiru Perfect</em></p>
            <p style="font-size: 13px; color: #64748b; margin: 2px 0 0;">Founder and CEO</p>
            <p style="font-size: 13px; font-weight: 700; color: #4f46e5; margin: 2px 0 0;"><em>STARKORA</em></p>
          </div>
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

  const cleanPhone = (newUserPhone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${newUserName || "there"}, welcome to STARKORA! How is your website setup going?`)}`
    : "";

  const plainText = `New user registered on STARKORA:\nName: ${newUserName || "Not provided"}\nEmail: ${newUserEmail}\nPhone: ${newUserPhone || "Not provided"}\nTime: ${new Date().toUTCString()}`;

  try {
    await resend.emails.send({
      from: NOTIFICATION_SENDER,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `🚀 New User Signed Up: ${newUserName || newUserEmail}`,
      text: plainText,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; max-width: 520px; color: #0f172a; line-height: 1.5;">
          <h2 style="color: #4f46e5; margin: 0 0 16px;">New User on STARKORA</h2>
          <p style="font-size: 14px; color: #334155; margin-bottom: 16px;">A new merchant has created an account on the platform:</p>
          <ul style="background: #f8fafc; padding: 16px 24px; border-radius: 12px; border: 1px solid #e2e8f0; list-style: none; margin: 0 0 20px;">
            <li style="margin-bottom: 8px; font-size: 14px;"><strong>Name:</strong> ${newUserName || "Not provided"}</li>
            <li style="margin-bottom: 8px; font-size: 14px;"><strong>Email:</strong> ${newUserEmail}</li>
            <li style="margin-bottom: 8px; font-size: 14px;"><strong>WhatsApp / Phone:</strong> ${newUserPhone || "Not provided"}</li>
            <li style="font-size: 12px; color: #64748b;"><strong>Time:</strong> ${new Date().toUTCString()}</li>
          </ul>

          ${
            whatsappUrl
              ? `
            <div style="margin: 20px 0;">
              <a href="${whatsappUrl}" style="background-color: #10b981; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                💬 Chat with Merchant on WhatsApp ➔
              </a>
            </div>
          `
              : ""
          }

          <p style="margin-top: 24px; font-size: 12px; color: #64748b;">
            <a href="https://starkora.website/dashboard" style="color: #4f46e5; text-decoration: underline;">
              Open Platform Admin Dashboard
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
                ? `<a href="mailto:${leadEmail}?subject=Re: Your inquiry on ${encodeURIComponent(siteName)}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                    ✉️ Click Here to Reply to ${leadName} ➔
                   </a>`
                : `<p style="font-size: 13px; color: #94a3b8;">Hit "Reply" in your email client to respond directly.</p>`
            }
          </div>

          <p style="font-size: 12px; color: #64748b; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px;">
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