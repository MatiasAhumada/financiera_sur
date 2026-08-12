import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  getSession,
  verifyPassword,
} from "@/server/services/auth.service";
import { createSessionSchema } from "@/validations/session.validation";

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session)
    return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({
    authenticated: true,
    user: {
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    },
    expiresAt: session.expiresAt,
  });
}
export async function POST(request: Request) {
  const parsed = createSessionSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: "Credenciales inválidas" },
      { status: 400 },
    );
  const { email, password } = parsed.data;
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (
    !user ||
    !user.active ||
    !(await verifyPassword(password, user.passwordHash))
  )
    return NextResponse.json(
      { error: "Credenciales inválidas" },
      { status: 401 },
    );
  const token = await createSession(user.id);
  const response = NextResponse.json({
    user: { name: user.name, email: user.email, role: user.role },
  });
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const requestProtocol = new URL(request.url).protocol;
  const secureCookie = forwardedProtocol === "https" || requestProtocol === "https:";
  response.cookies.set("ds_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookie,
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
export async function DELETE(request: Request) {
  const session = await getSession(request);
  if (session) await prisma.adminSession.delete({ where: { id: session.id } });
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("ds_session");
  return response;
}
