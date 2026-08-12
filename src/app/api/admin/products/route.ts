import { NextResponse } from "next/server";
import { getSession } from "@/server/services/auth.service";
import { productService } from "@/server/services/product.service";
import { productFormSchema } from "@/validations/product.validation";
import { IMAGE_UPLOAD_CONFIG, IMAGE_UPLOAD_MESSAGES } from "@/constants/image-upload.constant";
import { ApiError } from "@/utils/handlers/apiError.handler";
export const runtime = "nodejs";
export async function GET(request: Request) { if (!(await getSession(request))) return NextResponse.json({ error: "No autorizado" }, { status: 401 }); return NextResponse.json(await productService.findAll()); }
export async function POST(request: Request) {
  if (!(await getSession(request))) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const formData = await request.formData();
  const financingPlanIdsValue = formData.get("financingPlanIds");
  let parsedPlans: unknown = [];
  try { parsedPlans = JSON.parse(String(financingPlanIdsValue ?? "[]")); } catch { return NextResponse.json({ error: "Planes de financiación inválidos" }, { status: 400 }); }
  const parsed = productFormSchema.safeParse({ name: formData.get("name"), slug: formData.get("slug"), description: formData.get("description"), published: formData.get("published") === "true", featured: formData.get("featured") === "true", displayOrder: Number(formData.get("displayOrder") ?? 0), financingPlanIds: parsedPlans });
  if (!parsed.success) return NextResponse.json({ error: "Datos de producto inválidos", details: parsed.error.flatten() }, { status: 400 });
  const files = formData.getAll("images").filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (files.length > IMAGE_UPLOAD_CONFIG.MAX_IMAGES_PER_PRODUCT) return NextResponse.json({ error: IMAGE_UPLOAD_MESSAGES.TOO_MANY_IMAGES }, { status: 400 });
  try { return NextResponse.json(await productService.create(parsed.data, files), { status: 201 }); } catch (error) { const message = error instanceof Error ? error.message : IMAGE_UPLOAD_MESSAGES.INVALID_IMAGE; const status = error instanceof ApiError ? error.status : 500; return NextResponse.json({ error: message }, { status }); }
}
