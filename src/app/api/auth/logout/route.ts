import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/server/services/auth.service";

export async function POST(request: Request) {
  const session = await getSession(request);
  if (session) await prisma.adminSession.delete({ where: { id: session.id } });
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("ds_session");
  return response;
}
