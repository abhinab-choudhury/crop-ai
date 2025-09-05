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
