"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/server/db";
import { Admin } from "@/models";
import { createAdminSession, destroyAdminSession } from "@/lib/server/session";

const localeSchema = z.enum(["en", "fa", "ps"]).catch("en");
export async function loginAction(formData: FormData) {
  const locale = localeSchema.parse(formData.get("locale"));
  const parsed = z.object({ email: z.email(), password: z.string().min(8).max(200) }).safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) redirect(`/${locale}/admin/login?error=credentials`);
  await connectDB();
  const admin = await Admin.findOne({ email: parsed.data.email.toLowerCase() }).lean();
  if (!admin || !(await bcrypt.compare(parsed.data.password, admin.passwordHash))) redirect(`/${locale}/admin/login?error=credentials`);
  await createAdminSession(String(admin._id));
  redirect(`/${locale}/admin`);
}
export async function logoutAction(formData: FormData) { const locale = localeSchema.parse(formData.get("locale")); await destroyAdminSession(); redirect(`/${locale}/admin/login`); }
