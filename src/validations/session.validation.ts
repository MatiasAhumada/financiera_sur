import { z } from "zod";
import type { CreateSessionInput } from "@/interfaces/session.interface";

export const createSessionSchema: z.ZodType<CreateSessionInput> = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(200),
});
