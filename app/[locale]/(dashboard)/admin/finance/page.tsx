import { connectDB } from "@/lib/server/db";
import { Sale, Purchase, Expense, Payment } from "@/models";
import { recordPaymentAction } from "@/features/admin/actions/records";
import { Field, PrimaryButton, ModulePage, Panel, Table, FormLabel, AdminText } from "@/components/admin/ModulePage";
import { formatAFN } from "@/lib/format";
export const dynamic = "force-dynamic";
export default async function Page() {
  await connectDB();
  const [openSales, openPurchases, sales, purchases, expenses, cogs, payments] = await Promise.all([
    Sale.find({ status: "CONFIRMED", $expr: { $lt: ["$paid", "$total"] } }).sort({ date: -1 }).limit(100).lean(),
    Purchase.find({ status: "RECEIVED", $expr: { $lt: ["$paid", "$total"] } }).sort({ date: -1 }).limit(100).lean(),
    Sale.aggregate([{ $match: { status: "CONFIRMED" } }, { $group: { _id: null, total: { $sum: "$total" }, paid: { $sum: "$paid" } } }]),
    Purchase.aggregate([{ $match: { status: "RECEIVED" } }, { $group: { _id: null, total: { $sum: "$total" }, paid: { $sum: "$paid" } } }]),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    Sale.aggregate([{ $match: { status: "CONFIRMED" } }, { $unwind: "$items" }, { $group: { _id: null, total: { $sum: { $multiply: ["$items.quantity", { $ifNull: ["$items.costPrice", 0] }] } } } }]),
    Payment.find().sort({ date: -1 }).limit(30).lean(),
  ]);
  const revenue = sales[0]?.total || 0;
  const purchaseSpend = purchases[0]?.total || 0;
  const expense = expenses[0]?.total || 0;
  const costOfGoodsSold = cogs[0]?.total || 0;
  const metrics = [
    { label: "Confirmed sales", value: revenue },
    { label: "Cost of goods sold", value: costOfGoodsSold },
    { label: "Operating expenses", value: expense },
    { label: "Operating result", value: revenue - costOfGoodsSold - expense },
  ];
  return <ModulePage title="Finance" description="Track collections, supplier payments, cost of goods sold and operating expenses without treating inventory purchases as an operating expense.">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(item => <div key={item.label} className="rounded-2xl border border-[#e1e7ee] bg-white p-5"><div className="text-xs font-bold text-[#8291a0]"><AdminText>{item.label}</AdminText></div><div className="mt-3 text-xl font-black text-[#062f5e]">{formatAFN(item.value)}</div></div>)}</div>
    <Panel title="Record a payment" subtitle="Partial payments update the linked invoice and payment ledger atomically.">
      <form action={recordPaymentAction} className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
        <FormLabel label="Transaction"><select name="linkedRef" required className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe6ed] px-3"><option value="">Choose an unpaid transaction</option>{openSales.map(item => <option key={String(item._id)} value={`Sale:${String(item._id)}`}>Sale · {item.number} · due {formatAFN(item.total - item.paid)}</option>)}{openPurchases.map(item => <option key={String(item._id)} value={`Purchase:${String(item._id)}`}>Purchase · {item.number} · due {formatAFN(item.total - item.paid)}</option>)}</select></FormLabel>
        <Field label="Amount (AFN)" name="amount" type="number" required />
        <Field label="Payment method" name="method" required />
        <Field label="Reference (optional)" name="reference" />
        <Field label="Date" name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
        <div className="sm:col-span-2 xl:col-span-3"><PrimaryButton>Record payment</PrimaryButton></div>
      </form>
    </Panel>
    <Panel title="Receivables and payables"><div className="grid gap-5 p-5 sm:grid-cols-3"><div><div className="text-xs text-[#8291a0]"><AdminText>Customer receivables</AdminText></div><div className="mt-1 text-2xl font-black text-[#02488f]">{formatAFN(Math.max(0, revenue - (sales[0]?.paid || 0)))}</div></div><div><div className="text-xs text-[#8291a0]"><AdminText>Supplier payables</AdminText></div><div className="mt-1 text-2xl font-black text-[#d95f00]">{formatAFN(Math.max(0, purchaseSpend - (purchases[0]?.paid || 0)))}</div></div><div><div className="text-xs text-[#8291a0]"><AdminText>Inventory purchases (cash commitment)</AdminText></div><div className="mt-1 text-2xl font-black text-[#173653]">{formatAFN(purchaseSpend)}</div></div></div></Panel>
    <Panel title="Payment ledger" subtitle="Payments are kept separate from sales, purchases and expenses."><Table columns={["Date", "Direction", "Party type", "Amount", "Method", "Reference"]} rows={payments.map(item => [new Date(item.date).toLocaleDateString("en-GB"), item.direction, item.partyType, formatAFN(item.amount), item.method || "—", item.reference || "—"])} /></Panel>
  </ModulePage>;
}
