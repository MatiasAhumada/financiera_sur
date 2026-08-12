import { z } from "zod";
import type { FinancingPlanForm } from "@/interfaces/financingPlan.interface";

export const createFinancingPlanSchema: z.ZodType<FinancingPlanForm> = z.object(
  {
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().min(2).max(1000),
    active: z.boolean().default(true),
    displayOrder: z.number().int().min(0).default(0),
  },
);

export const updateFinancingPlanSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().min(2).max(1000).optional(),
    active: z.boolean().optional(),
    displayOrder: z.number().int().min(0).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar",
  });
