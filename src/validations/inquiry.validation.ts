import { z } from "zod";
import type { UpdateInquiryInput } from "@/interfaces/inquiry.interface";

export const createInquirySchema = z.object({
  name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(160), phone: z.string().trim().min(6).max(40), message: z.string().trim().max(2000).optional(), productId: z.string().cuid().optional(), website: z.string().optional(),
});
export const updateInquirySchema: z.ZodType<UpdateInquiryInput> = z.object({ status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "LOST"]).optional(), isRead: z.boolean().optional() });
export const markAllInquirySchema = z.object({ markAllAsRead: z.literal(true) });
