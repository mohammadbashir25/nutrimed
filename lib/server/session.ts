import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "nutrimed_admin_session";
function getSecret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be configured with at least 32 characters.");
  return new TextEncoder().encode(value);
}
export async function createAdminSession(adminId: string) {
  const token = await new SignJWT({ role: "ADMIN" }).setProtectedHeader({ alg: "HS256" }).setSubject(adminId).setIssuedAt().setExpirationTime("8h").sign(getSecret());
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
}
export async function getAdminSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "ADMIN" || !payload.sub) return null;
    return { id: payload.sub };
  } catch { return null; }
}
export async function requireAdmin(locale = "en") {
  const session = await getAdminSession();
  if (!session) redirect(`/${locale}/admin/login`);
  return session;
}
export async function destroyAdminSession() { (await cookies()).delete(COOKIE); }
