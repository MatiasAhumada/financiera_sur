import { NextResponse } from "next/server";
import { productService } from "@/server/services/product.service";
export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) { const { slug } = await context.params; const product = await productService.findBySlug(slug); return product ? NextResponse.json(product) : NextResponse.json({ error: "Producto no encontrado" }, { status: 404 }); }
