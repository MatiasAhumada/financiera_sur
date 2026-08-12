import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/server/services/auth.service";
import { financingPlanService } from "@/server/services/financingPlan.service";
const schema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().min(2).max(1000).optional(),
    active: z.boolean().optional(),
    displayOrder: z.number().int().min(0).optional(),
  })
  .refine((data) => Object.keys(data).length > 0);
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await getSession(request)))
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const { id } = await context.params;
  return NextResponse.json(await financingPlanService.update(id, parsed.data));
}
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await getSession(request)))
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await context.params;
  await financingPlanService.delete(id);
  return new NextResponse(null, { status: 204 });
}
