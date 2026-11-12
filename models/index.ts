
import mongoose, { Schema } from "mongoose";

// Shared localized fields
const localized = {
  en: { type: String, default: "" },
  fa: { type: String, default: "" },
  ps: { type: String, default: "" },
};

// Shared schema options
const options = {
  timestamps: true,
  versionKey: false,
} as const;

// ============================================
// PRODUCT
// ============================================

const productSchema = new Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
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
  options
);

productSchema.index({ "name.en": "text", sku: "text" });

// ============================================
// CUSTOMER / SUPPLIER
// ============================================

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
  options
);

partySchema.index({ name: "text", phone: "text" });

// ============================================
// PURCHASE AND SALE LINE ITEMS
// ============================================

const lineSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    description: String,
    quantity: {
      type: Number,
      min: 0.001,
      required: true,
    },
    unitPrice: {
      type: Number,
      min: 0,
      required: true,
    },
    costPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  { _id: false }
);

// ============================================
// PURCHASE
// ============================================

const purchaseSchema = new Schema(
  {
    number: { type: String, unique: true },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
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
  options
);

// ============================================
// SALE
// ============================================

const saleSchema = new Schema(
  {
    number: { type: String, unique: true },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
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
  options
);

// ============================================
// EXPENSE
// ============================================

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
  options
);

// ============================================
// STOCK MOVEMENT
// ============================================

const movementSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
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
  options
);

// ============================================
// PAYMENT
// ============================================

const paymentSchema = new Schema(
  {
    direction: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },
    partyType: {
      type: String,
      enum: ["CUSTOMER", "SUPPLIER", "OTHER"],
      required: true,
    },
    partyId: Schema.Types.ObjectId,
    amount: {
      type: Number,
      min: 0.01,
      required: true,
    },
    date: { type: Date, default: Date.now },
    method: String,
    reference: {
      type: String,
      unique: true,
      sparse: true,
    },
    notes: String,
    linkedType: String,
    linkedId: Schema.Types.ObjectId,
  },
  options
);

// ============================================
// ADMIN
// ============================================

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "Administrator",
    },
  },
  options
);

// ============================================
// SETTINGS
// ============================================

const settingSchema = new Schema(
  {
    key: {
      type: String,
      unique: true,
      required: true,
    },
    value: Schema.Types.Mixed,
  },
  options
);

// ============================================
// MONGOOSE MODELS
// Reuse existing models during Next.js hot reload.
// ============================================

export const Product =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);

export const Customer =
  mongoose.models.Customer ||
  mongoose.model("Customer", partySchema);

export const Supplier =
  mongoose.models.Supplier ||
  mongoose.model("Supplier", partySchema);

export const Purchase =
  mongoose.models.Purchase ||
  mongoose.model("Purchase", purchaseSchema);

export const Sale =
  mongoose.models.Sale ||
  mongoose.model("Sale", saleSchema);

export const Expense =
  mongoose.models.Expense ||
  mongoose.model("Expense", expenseSchema);

export const StockMovement =
  mongoose.models.StockMovement ||
  mongoose.model("StockMovement", movementSchema);

export const Payment =
  mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);

export const Admin =
  mongoose.models.Admin ||
  mongoose.model("Admin", adminSchema);

export const Setting =
  mongoose.models.Setting ||
  mongoose.model("Setting", settingSchema);
