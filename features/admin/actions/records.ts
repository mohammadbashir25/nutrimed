"use server";
import mongoose from "mongoose";
import { put, del as deleteBlob } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";
import { Product, Customer, Supplier, Expense, Setting, Sale, Purchase, Payment, StockMovement } from "@/models";

const text = z.string().trim().min(1).max(180);
const money = z.coerce.number().finite().min(0);
const id = z.string().regex(/^[a-f\d]{24}$/i);
const refresh = (...paths: string[]) => paths.forEach(path => { for (const locale of ["en", "fa", "ps"]) revalidatePath(`/${locale}${path}`); });

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const parsed = z.object({ sku: text, name: text, nameFa: z.string().trim().max(180).optional(), namePs: z.string().trim().max(180).optional(), description: z.string().max(3000).optional(), descriptionFa: z.string().max(3000).optional(), descriptionPs: z.string().max(3000).optional(), category: text, unit: text, purchasePrice: money, sellingPrice: money, stock: money, reorderLevel: money, status: z.enum(["DRAFT", "PUBLISHED"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Please check the product fields.");
  await connectDB();
  if (await Product.exists({ sku: parsed.data.sku })) throw new Error("A product with this SKU already exists.");
  const imageFile = formData.get("image");
  let image = "";
  if (imageFile instanceof File && imageFile.size > 0) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(imageFile.type)) throw new Error("Upload a JPG, PNG, WEBP, or AVIF image.");
    if (imageFile.size > 4 * 1024 * 1024) throw new Error("Product images must be 4 MB or smaller.");
    const extension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as Record<string, string>)[imageFile.type];
    const blob = await put(`products/${randomUUID()}.${extension}`, imageFile, {
      access: "public",
      addRandomSuffix: false,
      contentType: imageFile.type,
    });
    image = blob.url;
  }
  const slug = `${parsed.data.sku.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") || "product"}-${randomUUID().slice(0, 8)}`;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const [product] = await Product.create([{ ...parsed.data, name: { en: parsed.data.name, fa: parsed.data.nameFa || "", ps: parsed.data.namePs || "" }, slug: { en: slug, fa: slug, ps: slug }, description: { en: parsed.data.description || "", fa: parsed.data.descriptionFa || "", ps: parsed.data.descriptionPs || "" }, image }], { session });
      if (product.stock > 0) await StockMovement.create([{ product: product._id, type: "ADJUSTMENT", quantity: product.stock, reason: "Opening stock recorded when product was created." }], { session });
    });
  } catch (error) {
    if (image) await deleteBlob(image).catch(() => undefined);
    throw error;
  } finally {
    await session.endSession();
  }
  refresh("/admin/products", "/products", "/");
}
export async function archiveProductAction(formData: FormData) {
  await requireAdmin(); const parsed = id.safeParse(formData.get("productId")); if (!parsed.success) throw new Error("Invalid product.");
  await connectDB(); const product = await Product.findById(parsed.data); if (!product) throw new Error("Product not found.");
  if (product.stock > 0) throw new Error("A product with stock on hand cannot be archived. Reconcile or sell the remaining stock first.");
  product.status = "ARCHIVED"; await product.save(); refresh("/admin/products", "/products", "/");
}
export async function createPartyAction(formData: FormData) {
  await requireAdmin();
  const kind = formData.get("kind") === "supplier" ? "supplier" : "customer";
  const parsed = z.object({ name: text, phone: z.string().trim().max(40).optional(), email: z.union([z.email(), z.literal("")]).optional(), address: z.string().trim().max(300).optional(), notes: z.string().max(1000).optional() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Please provide a valid name and contact details.");
  await connectDB(); await (kind === "supplier" ? Supplier : Customer).create(parsed.data);
  refresh(`/admin/${kind === "supplier" ? "suppliers" : "customers"}`);
}
export async function archivePartyAction(formData: FormData) {
  await requireAdmin(); const kind = formData.get("kind") === "supplier" ? "supplier" : "customer"; const parsed = id.safeParse(formData.get("partyId"));
  if (!parsed.success) throw new Error("Invalid account."); await connectDB();
  const Model = kind === "supplier" ? Supplier : Customer; const party = await Model.findById(parsed.data);
  if (!party) throw new Error("Account not found."); party.archived = true; await party.save(); refresh(`/admin/${kind === "supplier" ? "suppliers" : "customers"}`);
}
export async function createExpenseAction(formData: FormData) {
  await requireAdmin();
  const parsed = z.object({ title: text, category: text, amount: z.coerce.number().finite().positive(), date: z.coerce.date(), paymentMethod: z.string().max(80).optional(), notes: z.string().max(1000).optional() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Please provide a valid expense.");
  await connectDB(); await Expense.create(parsed.data); refresh("/admin/expenses", "/admin/finance", "/admin/reports");
}
export async function saveSettingAction(formData: FormData) {
  await requireAdmin(); const key = String(formData.get("key") || "").trim(); const value = String(formData.get("value") || "").trim();
  if (!/^[a-zA-Z][a-zA-Z0-9_.-]{1,60}$/.test(key) || value.length > 500) throw new Error("Invalid setting key or value.");
  await connectDB(); await Setting.findOneAndUpdate({ key }, { $set: { value } }, { upsert: true, runValidators: true }); refresh("/admin/settings");
}
export async function recordPaymentAction(formData: FormData) {
  await requireAdmin();
  const [linkedType, linkedId] = String(formData.get("linkedRef") || "").split(":");
  const parsed = z.object({ linkedType: z.enum(["Sale", "Purchase"]), linkedId: id, amount: z.coerce.number().positive(), method: text, reference: z.string().trim().max(100).optional(), date: z.coerce.date(), notes: z.string().max(1000).optional() }).safeParse({ linkedType, linkedId, amount: formData.get("amount"), method: formData.get("method"), reference: formData.get("reference"), date: formData.get("date"), notes: formData.get("notes") });
  if (!parsed.success) throw new Error("Please provide valid payment details.");
  await connectDB(); const session = await mongoose.startSession();
  try { await session.withTransaction(async () => {
    if (parsed.data.linkedType === "Sale") {
      const record = await Sale.findById(parsed.data.linkedId).session(session);
      if (!record || record.status !== "CONFIRMED") throw new Error("The linked sale is not payable.");
      if (record.paid + parsed.data.amount > record.total) throw new Error("Payment exceeds the remaining balance.");
      await Payment.create([{ direction: "IN", partyType: "CUSTOMER", partyId: record.customer, amount: parsed.data.amount, method: parsed.data.method, reference: parsed.data.reference || undefined, date: parsed.data.date, notes: parsed.data.notes, linkedType: "Sale", linkedId: record._id }], { session });
      record.paid += parsed.data.amount; await record.save({ session });
    } else {
      const record = await Purchase.findById(parsed.data.linkedId).session(session);
      if (!record || record.status !== "RECEIVED") throw new Error("The linked purchase is not payable.");
      if (record.paid + parsed.data.amount > record.total) throw new Error("Payment exceeds the remaining balance.");
      await Payment.create([{ direction: "OUT", partyType: "SUPPLIER", partyId: record.supplier, amount: parsed.data.amount, method: parsed.data.method, reference: parsed.data.reference || undefined, date: parsed.data.date, notes: parsed.data.notes, linkedType: "Purchase", linkedId: record._id }], { session });
      record.paid += parsed.data.amount; await record.save({ session });
    }
  }); } finally { await session.endSession(); }
  refresh("/admin/finance", "/admin/sales", "/admin/purchases", "/admin/customers", "/admin/suppliers");
}
export async function adjustStockAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = z.object({ productId: id, adjustment: z.coerce.number().int(), reason: z.string().trim().min(5).max(300) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success || parsed.data.adjustment === 0) throw new Error("Enter a non-zero adjustment and a clear reason.");
  await connectDB(); const session = await mongoose.startSession();
  try { await session.withTransaction(async () => {
    const product = await Product.findById(parsed.data.productId).session(session);
    if (!product || product.stock + parsed.data.adjustment < 0) throw new Error("Product not found or adjustment would make stock negative.");
    product.stock += parsed.data.adjustment; await product.save({ session });
    await StockMovement.create([{ product: product._id, type: "ADJUSTMENT", quantity: parsed.data.adjustment, reason: parsed.data.reason, createdBy: admin.id }], { session });
  }); } finally { await session.endSession(); }
  refresh("/admin/inventory", "/admin");
}
