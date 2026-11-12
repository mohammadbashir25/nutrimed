import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Admin } from "@/models";

export async function POST(request: Request) {
  if (process.env.ALLOW_ADMIN_BOOTSTRAP !== "true") return NextResponse.json({ error: "Bootstrap is disabled." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const parsed = z.object({ email: z.email(), password: z.string().min(12), name: z.string().min(2).max(80) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Provide a valid email, name and password (12+ characters)." }, { status: 400 });
  await connectDB();
  if (await Admin.exists({})) return NextResponse.json({ error: "An administrator already exists." }, { status: 409 });
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await Admin.create({ _id: "000000000000000000000001", email: parsed.data.email, name: parsed.data.name, passwordHash });
  return NextResponse.json({ success: true }, { status: 201 });
}
