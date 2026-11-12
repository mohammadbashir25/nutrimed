import { connectDB } from "@/lib/server/db";
import { Product, Customer, Supplier, Sale, Purchase, Expense } from "@/models";
import { ModulePage, Panel, Table } from "@/components/admin/ModulePage";
import { formatAFN } from "@/lib/format";
import Link from "next/link";
import { ArrowUpRight, Boxes, CreditCard, Package, ShoppingCart, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function DashboardOverview({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.overview" });
  await connectDB();
  const [products, customers, suppliers, sales, purchases, expenses, inventoryValue, recentSales, lowStock, outOfStock] = await Promise.all([
    Product.countDocuments({ status: { $ne: "ARCHIVED" } }),
    Customer.countDocuments({ archived: false }),
    Supplier.countDocuments({ archived: false }),
    Sale.aggregate([{ $match: { status: "CONFIRMED" } }, { $group: { _id: null, total: { $sum: "$total" }, paid: { $sum: "$paid" }, count: { $sum: 1 } } }]),
    Purchase.aggregate([{ $match: { status: "RECEIVED" } }, { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }]),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    Product.aggregate([{ $match: { status: { $ne: "ARCHIVED" } } }, { $group: { _id: null, value: { $sum: { $multiply: ["$stock", "$purchasePrice"] } } } }]),
    Sale.find().sort({ date: -1 }).limit(6).populate("customer", "name").lean(),
    Product.countDocuments({ status: { $ne: "ARCHIVED" }, $expr: { $lte: ["$stock", "$reorderLevel"] }, stock: { $gt: 0 } }),
    Product.countDocuments({ status: { $ne: "ARCHIVED" }, stock: 0 }),
  ]);
  const salesTotal = sales[0]?.total || 0;
  const stats = [
    { label: t("sales"), value: formatAFN(salesTotal), hint: `${sales[0]?.count || 0} ${t("confirmed")}`, icon: TrendingUp },
    { label: t("products"), value: String(products), hint: t("active"), icon: Package },
    { label: t("customers"), value: String(customers), hint: t("accounts"), icon: Users },
    { label: t("inventory"), value: formatAFN(inventoryValue[0]?.value || 0), hint: t("stockCost"), icon: Boxes },
    { label: t("lowStock"), value: String(lowStock), hint: t("lowStockHint"), icon: AlertTriangle },
    { label: t("outStock"), value: String(outOfStock), hint: t("outStockHint"), icon: Package },
  ];
  return (
    <ModulePage title={t("title")} description={t("description")}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => <div key={s.label} className="rounded-2xl border border-[#e1e7ee] bg-white p-5"><div className="flex items-center justify-between"><span className="text-xs font-bold text-[#7d8c9b]">{s.label}</span><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#eef5fb] text-[#02488f]"><s.icon size={18} /></span></div><div className="mt-4 text-2xl font-black tracking-tight text-[#062f5e]">{s.value}</div><div className="mt-1 text-[11px] text-[#9aa7b5]">{s.hint}</div></div>)}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <Panel title={t("recent")} subtitle={t("latest")}><Table columns={[t("invoice"), t("customer"), t("date"), t("amount"), t("status")]} rows={recentSales.map((s) => [s.number || "—", (s.customer as { name?: string } | null)?.name || "Walk-in", new Date(s.date).toLocaleDateString(locale), formatAFN(s.total || 0), s.status])} /></Panel>
        <Panel title={t("snapshot")} subtitle={t("live")}><div className="divide-y divide-[#edf1f5]">{[{ label: t("purchaseSpend"), value: formatAFN(purchases[0]?.total || 0) }, { label: t("expenses"), value: formatAFN(expenses[0]?.total || 0) }, { label: t("receivables"), value: formatAFN(Math.max(0, salesTotal - (sales[0]?.paid || 0))) }, { label: t("suppliers"), value: String(suppliers) }].map((x) => <div key={x.label} className="flex items-center justify-between px-5 py-4"><span className="text-xs text-[#758496]">{x.label}</span><strong className="text-sm text-[#173653]">{x.value}</strong></div>)}</div></Panel>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[{ href: "/admin/products", label: t("manageProducts"), icon: Package }, { href: "/admin/sales", label: t("recordSale"), icon: ShoppingCart }, { href: "/admin/finance", label: t("reviewFinance"), icon: CreditCard }, { href: "/admin/reports", label: t("viewReports"), icon: ArrowUpRight }].map((x) => <Link key={x.href} href={`/${locale}${x.href}`} className="flex items-center gap-3 rounded-xl border border-[#e1e7ee] bg-white p-4 text-sm font-extrabold text-[#24445f] transition hover:-translate-y-0.5 hover:border-[#b9d5ef]"><x.icon size={18} className="text-[#02488f]" />{x.label}<ArrowUpRight size={14} className="ms-auto text-[#a3afbb]" /></Link>)}</div>
    </ModulePage>
  );
}
