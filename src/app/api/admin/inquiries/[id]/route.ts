import { NextResponse } from "next/server";
import { getSession } from "@/server/services/auth.service";
import { inquiryService } from "@/server/services/inquiry.service";
import { updateInquirySchema } from "@/validations/inquiry.validation";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getSession(request))) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = updateInquirySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const { id } = await context.params;
  return NextResponse.json(await inquiryService.update(id, parsed.data));
}
