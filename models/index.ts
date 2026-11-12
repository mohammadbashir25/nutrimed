import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const localized = {
  en: { type: String, default: "" },
  fa: { type: String, default: "" },
  ps: { type: String, default: "" },
};
const options = { timestamps: true, versionKey: false };
function model<T>(name: string, schema: Schema): Model<T> {
  return (mongoose.models[name] as Model<T>) || mongoose.model<T>(name, schema);
}
const productSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true, trim: true },
    name: localized,
    slug: localized,
    description: localized,
    category: { type: String, default: "" },
    unit: { type: String, default: "pcs" },
    purchasePrice: { type: Number, min: 0, default: 0 },
    sellingPrice: { type: Number, min: 0, default: 0 },
    stock: { type: Number, min: 0, default: 0 },
    reorderLevel: { type: Number, min: 0, default: 0 },
    image: { type: String, default: "" },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },
    displayOrder: { type: Number, default: 0 },
  },
  options,
);
productSchema.index({ "name.en": "text", sku: "text" });
const partySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: String,
    email: String,
    address: String,
    notes: String,
    openingBalance: { type: Number, default: 0 },
    archived: { type: Boolean, default: false },
  },
  options,
);
partySchema.index({ name: "text", phone: "text" });
const lineSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    description: String,
    quantity: { type: Number, min: 0.001, required: true },
    unitPrice: { type: Number, min: 0, required: true },
    costPrice: { type: Number, min: 0, default: 0 },
    total: { type: Number, min: 0, required: true },
  },
  { _id: false },
);
const purchaseSchema = new Schema(
  {
    number: { type: String, unique: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    items: [lineSchema],
    subtotal: Number,
    discount: { type: Number, default: 0 },
    total: Number,
    paid: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["DRAFT", "ORDERED", "RECEIVED", "CANCELLED"],
      default: "DRAFT",
    },
    date: { type: Date, default: Date.now },
    notes: String,
    stockApplied: { type: Boolean, default: false },
  },
  options,
);
const saleSchema = new Schema(
  {
    number: { type: String, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    items: [lineSchema],
    subtotal: Number,
    discount: { type: Number, default: 0 },
    total: Number,
    paid: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["DRAFT", "CONFIRMED", "CANCELLED"],
      default: "DRAFT",
    },
    date: { type: Date, default: Date.now },
    notes: String,
    stockApplied: { type: Boolean, default: false },
  },
  options,
);
const expenseSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "General" },
    amount: { type: Number, min: 0, required: true },
    date: { type: Date, default: Date.now },
    paymentMethod: String,
    reference: String,
    notes: String,
  },
  options,
);
const movementSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    type: {
      type: String,
      enum: ["PURCHASE", "SALE", "ADJUSTMENT", "REVERSAL"],
      required: true,
    },
    quantity: { type: Number, required: true },
    reason: { type: String, required: true },
    referenceId: Schema.Types.ObjectId,
    referenceType: String,
    createdBy: Schema.Types.ObjectId,
  },
  options,
);
const paymentSchema = new Schema(
  {
    direction: { type: String, enum: ["IN", "OUT"], required: true },
    partyType: {
      type: String,
      enum: ["CUSTOMER", "SUPPLIER", "OTHER"],
      required: true,
    },
    partyId: Schema.Types.ObjectId,
    amount: { type: Number, min: 0.01, required: true },
    date: { type: Date, default: Date.now },
    method: String,
    reference: { type: String, unique: true, sparse: true },
    notes: String,
    linkedType: String,
    linkedId: Schema.Types.ObjectId,
  },
  options,
);
const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Administrator" },
  },
  options,
);
const settingSchema = new Schema(
  {
    key: { type: String, unique: true, required: true },
    value: Schema.Types.Mixed,
  },
  options,
);

export const Product = model<InferSchemaType<typeof productSchema>>(
  "Product",
  productSchema,
);
export const Customer = model<InferSchemaType<typeof partySchema>>(
  "Customer",
  partySchema,
);
export const Supplier = model<InferSchemaType<typeof partySchema>>(
  "Supplier",
  partySchema,
);
export const Purchase = model<InferSchemaType<typeof purchaseSchema>>(
  "Purchase",
  purchaseSchema,
);
export const Sale = model<InferSchemaType<typeof saleSchema>>(
  "Sale",
  saleSchema,
);
export const Expense = model<InferSchemaType<typeof expenseSchema>>(
  "Expense",
  expenseSchema,
);
export const StockMovement = model<InferSchemaType<typeof movementSchema>>(
  "StockMovement",
  movementSchema,
);
export const Payment = model<InferSchemaType<typeof paymentSchema>>(
  "Payment",
  paymentSchema,
);
export const Admin = model<InferSchemaType<typeof adminSchema>>(
  "Admin",
  adminSchema,
);
export const Setting = model<InferSchemaType<typeof settingSchema>>(
  "Setting",
  settingSchema,
);
