import { NextResponse } from "next/server";
import { z } from "zod";
import { inquiryService } from "@/server/services/inquiry.service";

const schema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().email(), phone: z.string().trim().min(6).max(30), message: z.string().trim().max(1000).optional(), productId: z.string().optional(), website: z.string().optional() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success || parsed.data.website) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const { website: _website, ...data } = parsed.data;
  const inquiry = await inquiryService.create(data);
  return NextResponse.json({ id: inquiry.id, message: "Consulta recibida" }, { status: 201 });
}
