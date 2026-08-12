import { NextResponse } from "next/server";
import { inquiryService } from "@/server/services/inquiry.service";
import { createInquirySchema } from "@/validations/inquiry.validation";

export async function POST(request: Request) {
  const parsed = createInquirySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Datos de consulta inválidos" }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true });
  const { website: _website, ...data } = parsed.data;
  const inquiry = await inquiryService.create(data);
  return NextResponse.json({ id: inquiry.id }, { status: 201 });
}
