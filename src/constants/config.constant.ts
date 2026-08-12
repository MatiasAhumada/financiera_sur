export const CONFIG = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  INQUIRY_RECIPIENT: process.env.INQUIRY_RECIPIENT,
  EMAIL_FROM: process.env.EMAIL_FROM ?? "Financiera del Sur <onboarding@resend.dev>",
  R2_ENDPOINT: process.env.R2_ENDPOINT,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME ?? process.env.R2_BUCKET,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL ?? process.env.R2_PUBLIC_BASE_URL,
} as const;
