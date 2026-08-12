import { NextResponse } from "next/server";
import { getSession } from "@/server/services/auth.service";
import { productService } from "@/server/services/product.service";
export async function GET(request: Request) { if (!(await getSession(request))) return NextResponse.json({ error: "No autorizado" }, { status: 401 }); return NextResponse.json(await productService.findAll()); }
