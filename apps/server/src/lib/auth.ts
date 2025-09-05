import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client } from "@/database";
import { sendEmail } from "@/lib/email";
import env from "@/lib/env";

export const auth = betterAuth({
	database: mongodbAdapter(client),
	trustedOrigins: [env.CORS_ORIGIN, "crop-ai://"],
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		sendVerificationEmail: true,
		sendResetPassword: async ({ user, url }) => {
			try {
				await sendEmail({
					to: user.email,
					subject: "Reset your password",
					html: `<p>Reset your password <a href="${url}">here</a>.</p>`,
				});
			} catch (err) {
				console.error("Error while sending reset-password email: ", err);
			}
		},
		resetPasswordTokenExpiresIn: 3600,
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			try {
				await sendEmail({
					to: user.email,
					subject: "Verify your Account",
					html: `<p>Click <a href="${url}">here</a> to verify your account.</p>`,
				});
			} catch (err) {
				console.error("Error while sending verification email: ", err);
			}
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 3600,
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: env.NODE_ENV !== "development",
			httpOnly: true,
		},
	},
	plugins: [expo()],
});
