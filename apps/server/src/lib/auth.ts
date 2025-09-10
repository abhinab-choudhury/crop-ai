import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client } from "@/database";
import { EmailTemplate, sendEmail } from "@/lib/email";
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
          html: EmailTemplate({
            title: "Reset Password",
            message:
              "Click the button below to reset your password. If you didn't request this, please ignore this email.",
            buttonText: "Reset Password",
            buttonUrl: url,
            userName: user.name || user.email,
          }),
        });
      } catch (err) {
        console.error("Error while sending reset-password email: ", err);
      }
    },
    resetPasswordTokenExpiresIn: 3600,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const successCallback = `${env.BETTER_AUTH_URL}/verify-success`;

      const verifyUrl = `${url}&callbackUrl=${encodeURIComponent(successCallback)}`;

      try {
        await sendEmail({
          to: user.email,
          subject: "Verify your Account",
          html: EmailTemplate({
            title: "Welcome",
            message:
              "Thank you for signing up. Please verify your email to start using your account.",
            buttonText: "Verify Email",
            buttonUrl: verifyUrl,
            userName: user.name || user.email,
          }),
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
