import { NextResponse } from "next/server";
import { getSession } from "@/server/services/auth.service";
import { financingPlanService } from "@/server/services/financingPlan.service";
import { updateFinancingPlanSchema } from "@/validations/financingPlan.validation";
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await getSession(request)))
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = updateFinancingPlanSchema.safeParse(await request.json());
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
