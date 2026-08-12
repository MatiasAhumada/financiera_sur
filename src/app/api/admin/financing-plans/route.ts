import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/server/services/auth.service";
export async function GET(request: Request) { if (!(await getSession(request))) return NextResponse.json({ error: "No autorizado" }, { status: 401 }); return NextResponse.json(await prisma.financingPlan.findMany({ orderBy: { displayOrder: "asc" } })); }
