import nodemailer, { type Transporter } from "nodemailer";
import env from "@/lib/env";

// Create the transporter once and reuse it (better performance)
let transporter: Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: 587,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendEmail({
  to,
  subject,
  html,
  from,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  text?: string;
}) {
  try {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: from || `"Crop AI" <${env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw new Error("Email delivery failed");
  }
}

export function EmailTemplate({
  title,
  message,
  buttonText,
  buttonUrl,
  userName,
}: {
  title: string;
  message: string;
  buttonText: string;
  buttonUrl: string;
  userName?: string;
}) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="background-color:#f9fafb; font-family:Arial,sans-serif; margin:0; padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; padding:32px; margin:32px 0;">
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <h1 style="color:#10b981; font-size:24px; margin:0;">
                  ${title}, ${userName || ""}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:24px; color:#374151; font-size:16px; text-align:center;">
                ${message}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <a href="${buttonUrl}" style="background-color:#10b981; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:8px; display:inline-block; font-weight:bold;">
                  ${buttonText}
                </a>
              </td>
            </tr>
            <tr>
              <td style="color:#6b7280; font-size:14px; text-align:center;">
                If the button doesn't work, copy and paste this link into your browser:<br />
                <a href="${buttonUrl}" style="color:#10b981;">${buttonUrl}</a>
              </td>
            </tr>
            <tr>
              <td style="padding-top:24px; color:#9ca3af; font-size:12px; text-align:center;">
                &copy; ${new Date().getFullYear()} Your App Name. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
