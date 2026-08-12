import { NextResponse } from "next/server";
import { productService } from "@/server/services/product.service";
export async function GET() { return NextResponse.json(await productService.findPublished()); }
