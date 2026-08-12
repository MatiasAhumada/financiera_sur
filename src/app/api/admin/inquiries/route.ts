import { NextResponse } from "next/server";
import { inquiryService } from "@/server/services/inquiry.service";
import { getSession } from "@/server/services/auth.service";
export async function GET(request: Request) { if (!(await getSession(request))) return NextResponse.json({ error: "No autorizado" }, { status: 401 }); return NextResponse.json(await inquiryService.findAll()); }
