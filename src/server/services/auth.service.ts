import { createHash, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { prisma } from "@/lib/prisma";
const scrypt = promisify(nodeScrypt);
function hashToken(value: string) { return createHash("sha256").update(value).digest("hex"); }
export async function verifyPassword(password: string, stored: string) { const [salt, key] = stored.split(":"); if (!salt || !key) return false; const derived = (await scrypt(password, salt, 64)) as Buffer; return timingSafeEqual(derived, Buffer.from(key, "hex")); }
export async function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); const key = (await scrypt(password, salt, 64)) as Buffer; return `${salt}:${key.toString("hex")}`; }
export async function createSession(userId: string) { const token = randomBytes(32).toString("hex"); await prisma.adminSession.create({ data: { userId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) } }); return token; }
export async function getSessionFromToken(token: string) { const session = await prisma.adminSession.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } }); if (!session || session.expiresAt < new Date() || !session.user.active) return null; return session; }
export async function getSession(request: Request) { const token = request.headers.get("cookie")?.match(/ds_session=([^;]+)/)?.[1]; return token ? getSessionFromToken(token) : null; }
