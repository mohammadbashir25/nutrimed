import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/server/session";
import { connectDB } from "@/lib/server/db";
import { Admin } from "@/models";
import AdminShell from "@/components/admin/AdminShell";
export default async function DashboardLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!["en", "fa", "ps"].includes(locale)) notFound();
  const session = await requireAdmin(locale);
  await connectDB();
  const admin = await Admin.findById(session.id).select("name").lean();
  if (!admin) notFound();
  return <AdminShell adminName={admin.name || "Administrator"} locale={locale}>{children}</AdminShell>;
}
