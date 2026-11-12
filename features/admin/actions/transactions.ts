"use server";
import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";
import { Product, Customer, Supplier, Sale, Purchase, StockMovement } from "@/models";

const schema = z.object({ productId: z.string().regex(/^[a-f\d]{24}$/i), quantity: z.coerce.number().finite().positive(), unitPrice: z.coerce.number().finite().nonnegative(), discount: z.coerce.number().finite().nonnegative().default(0), partyId: z.string().optional(), date: z.coerce.date(), notes: z.string().max(1000).optional() });
const refresh = (...paths: string[]) => paths.forEach(path => { for (const locale of ["en", "fa", "ps"]) revalidatePath(`/${locale}${path}`); });
async function createTransaction(formData: FormData, kind: "sale" | "purchase") {
  const admin = await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Please check the transaction details.");
  if (kind === "purchase" && !/^[a-f\d]{24}$/i.test(parsed.data.partyId || "")) throw new Error("Select a valid supplier.");
  if (kind === "sale" && parsed.data.partyId && !/^[a-f\d]{24}$/i.test(parsed.data.partyId)) throw new Error("Select a valid customer.");
  await connectDB();
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const product = await Product.findById(parsed.data.productId).session(session);
      if (!product || product.status === "ARCHIVED") throw new Error("Selected product is unavailable.");
      if (kind === "purchase") {
        const supplier = await Supplier.findOne({ _id: parsed.data.partyId, archived: false }).session(session);
        if (!supplier) throw new Error("Selected supplier was not found.");
      } else if (parsed.data.partyId) {
        const customer = await Customer.findOne({ _id: parsed.data.partyId, archived: false }).session(session);
        if (!customer) throw new Error("Selected customer was not found.");
      }
      const subtotal = parsed.data.quantity * parsed.data.unitPrice;
      if (parsed.data.discount > subtotal) throw new Error("Discount cannot exceed the line subtotal.");
      const total = subtotal - parsed.data.discount;
      const number = `${kind === "sale" ? "INV" : "PUR"}-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 8).toUpperCase()}`;
      const line = { product: product._id, description: product.name?.en || product.sku, quantity: parsed.data.quantity, unitPrice: parsed.data.unitPrice, costPrice: kind === "sale" ? product.purchasePrice : parsed.data.unitPrice, total };
      if (kind === "sale") {
        if (product.stock < parsed.data.quantity) throw new Error("Insufficient stock for this sale.");
        const [sale] = await Sale.create([{ number, customer: parsed.data.partyId || undefined, items: [line], subtotal, discount: parsed.data.discount, total, paid: 0, status: "CONFIRMED", date: parsed.data.date, notes: parsed.data.notes, stockApplied: true }], { session });
        product.stock -= parsed.data.quantity;
        await product.save({ session });
        await StockMovement.create([{ product: product._id, type: "SALE", quantity: -parsed.data.quantity, reason: `Sale ${number}`, referenceId: sale._id, referenceType: "Sale", createdBy: admin.id }], { session });
      } else {
        const [purchase] = await Purchase.create([{ number, supplier: parsed.data.partyId, items: [line], subtotal, discount: parsed.data.discount, total, paid: 0, status: "RECEIVED", date: parsed.data.date, notes: parsed.data.notes, stockApplied: true }], { session });
        product.stock += parsed.data.quantity;
        await product.save({ session });
        await StockMovement.create([{ product: product._id, type: "PURCHASE", quantity: parsed.data.quantity, reason: `Received purchase ${number}`, referenceId: purchase._id, referenceType: "Purchase", createdBy: admin.id }], { session });
      }
    });
  } finally { await session.endSession(); }
  refresh("/admin", `/admin/${kind === "sale" ? "sales" : "purchases"}`, "/admin/inventory", "/admin/finance", "/admin/reports");
}
export async function createSaleAction(formData: FormData) { await createTransaction(formData, "sale"); }
export async function createPurchaseAction(formData: FormData) { await createTransaction(formData, "purchase"); }

export async function cancelTransactionAction(formData: FormData) {
  const admin = await requireAdmin();
  const type = formData.get("type");
  const id = String(formData.get("transactionId") || "");
  if ((type !== "Sale" && type !== "Purchase") || !/^[a-f\d]{24}$/i.test(id)) throw new Error("Invalid transaction.");
  await connectDB();
  const Model = type === "Sale" ? Sale : Purchase;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const record = await Model.findById(id).session(session);
      if (!record || record.status === "CANCELLED") throw new Error("Transaction not found or already cancelled.");
      if (record.paid > 0) throw new Error("A transaction with recorded payments cannot be cancelled. Reverse or refund its payments first.");
      if (record.stockApplied) {
        for (const line of record.items) {
          const product = await Product.findById(line.product).session(session);
          if (!product) throw new Error("A product in this transaction no longer exists.");
          const delta = type === "Sale" ? line.quantity : -line.quantity;
          if (product.stock + delta < 0) throw new Error("Cancellation would make stock negative. Reconcile inventory first.");
          product.stock += delta;
          await product.save({ session });
          await StockMovement.create([{ product: product._id, type: "REVERSAL", quantity: delta, reason: `Cancellation of ${record.number}`, referenceId: record._id, referenceType: type, createdBy: admin.id }], { session });
        }
      }
      record.status = "CANCELLED";
      record.stockApplied = false;
      await record.save({ session });
    });
  } finally { await session.endSession(); }
  refresh("/admin", `/admin/${type === "Sale" ? "sales" : "purchases"}`, "/admin/inventory", "/admin/finance", "/admin/reports");
}
