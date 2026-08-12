export const CONFIG = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  INQUIRY_RECIPIENT: process.env.INQUIRY_RECIPIENT,
  EMAIL_FROM: process.env.EMAIL_FROM ?? "Financiera del Sur <onboarding@resend.dev>",
} as const;
