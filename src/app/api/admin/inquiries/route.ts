import { NextResponse } from "next/server";
import { inquiryService } from "@/server/services/inquiry.service";
import { getSession } from "@/server/services/auth.service";
import { markAllInquirySchema } from "@/validations/inquiry.validation";
export async function GET(request: Request) {
  if (!(await getSession(request))) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(await inquiryService.list());
}
export async function PATCH(request: Request) {
  if (!(await getSession(request))) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body: unknown = await request.json();
  if (markAllInquirySchema.safeParse(body).success) { await inquiryService.markAllAsRead(); return NextResponse.json({ ok: true }); }
  return NextResponse.json({ error: "El recurso requiere un identificador" }, { status: 400 });
}
