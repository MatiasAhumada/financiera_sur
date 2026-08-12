import { NextResponse } from "next/server";
import { getSession } from "@/server/services/auth.service";
import { financingPlanService } from "@/server/services/financingPlan.service";
import { z } from "zod";
const schema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(2).max(1000),
  active: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});
export async function GET(request: Request) {
  if (!(await getSession(request)))
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(await financingPlanService.findAll());
}
export async function POST(request: Request) {
  if (!(await getSession(request)))
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  return NextResponse.json(await financingPlanService.create(parsed.data), {
    status: 201,
  });
}
