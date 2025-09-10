import * as dotenv from "dotenv";

dotenv.config({ debug: true });

const getEnv = (
  key: string,
  required = true,
  defaultValue?: string,
): string => {
  const value = process.env[key] || defaultValue;
  if (required && !value) {
    console.error(`Environment variable ${key} is required but not defined.`);
    process.exit(1);
  }
  // biome-ignore lint/style/noNonNullAssertion: Reason you need it
  return value!;
};

const env = {
  PORT: getEnv("PORT", false, "8080"),
  NODE_ENV: getEnv("NODE_ENV", false, "development"), // development | production
  DATABASE_NAME: getEnv("DATABASE_NAME"),
  DATABASE_URL: `${getEnv("DATABASE_URL")}/${getEnv("DATABASE_NAME")}`,
  CORS_ORIGIN: getEnv("CORS_ORIGIN"),
  BETTER_AUTH_SECRET: getEnv("BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: getEnv("BETTER_AUTH_URL"),
  GOOGLE_GEMINI_API_KEY: getEnv("GOOGLE_GEMINI_API_KEY"),
  SMTP_HOST: getEnv("SMTP_HOST"),
  SMTP_USER: getEnv("SMTP_USER"),
  SMTP_PASS: getEnv("SMTP_PASS"),
};

export default env;
