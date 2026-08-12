import { z } from "zod";
import type { ProductForm } from "@/interfaces/product.interface";
export const productFormSchema: z.ZodType<ProductForm> = z.object({
  name: z.string().trim().min(2).max(160), slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().trim().min(2).max(5000), published: z.boolean(), featured: z.boolean(), displayOrder: z.number().int().min(0).max(9999), financingPlanIds: z.array(z.string().cuid()).max(20),
});
