import { connectDB } from "@/lib/server/db";
import { Product } from "@/models";
import { createProductAction, archiveProductAction } from "@/features/admin/actions/records";
import { ModulePage, Panel, Table, PrimaryButton, Field, DangerButton } from "@/components/admin/ModulePage";
import { formatAFN } from "@/lib/format";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.products" });
  await connectDB();
  const products = await Product.find({ status: { $ne: "ARCHIVED" } }).sort({ createdAt: -1 }).lean();
  return (
    <ModulePage title={t("title")} description={t("description")}>
      <Panel title={t("add")} subtitle={t("create")}>
        <form action={createProductAction} encType="multipart/form-data" className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
          <Field label={t("sku")} name="sku" required />
          <Field label={t("nameEn")} name="name" required />
          <Field label={t("nameFa")} name="nameFa" />
          <Field label={t("namePs")} name="namePs" />
          <Field label={t("category")} name="category" required />
          <Field label={t("unit")} name="unit" required placeholder={t("stockHint")} />
          <Field label={t("purchase")} name="purchasePrice" type="number" required />
          <Field label={t("selling")} name="sellingPrice" type="number" required />
          <Field label={t("stock")} name="stock" type="number" />
          <Field label={t("reorder")} name="reorderLevel" type="number" />
          <Field label={t("descEn")} name="description" />
          <Field label={t("descFa")} name="descriptionFa" />
          <Field label={t("descPs")} name="descriptionPs" />
          <label className="text-xs font-bold text-[#52667a]">{t("image")}<input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="mt-1.5 block w-full text-xs file:me-3 file:rounded-lg file:border-0 file:bg-[#eef5fb] file:px-3 file:py-2 file:font-bold file:text-[#02488f]" /></label>
          <label className="text-xs font-bold text-[#52667a]">{t("status")}<select name="status" defaultValue="DRAFT" className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe6ed] px-3"><option value="DRAFT">{t("draft")}</option><option value="PUBLISHED">{t("published")}</option></select></label>
          <div className="flex items-end"><PrimaryButton>{t("submit")}</PrimaryButton></div>
        </form>
      </Panel>
      <Panel title={`${t("catalogue")} · ${products.length}`} subtitle={t("database")}>
        <Table columns={[t("product"), t("sku"), t("category"), t("stock"), t("purchase"), t("selling"), t("status"), t("action")]} rows={products.map((p) => [
          <div className="flex items-center gap-3">{p.image ? <img src={p.image} alt="" className="h-10 w-10 rounded-lg border border-[#e1e7ee] bg-white object-contain p-1" /> : <span className="h-10 w-10 rounded-lg bg-[#f1f5f8]" />}<span>{(p.name as { en?: string; fa?: string; ps?: string })?.[locale] || (p.name as { en?: string })?.en || "—"}</span></div>,
          p.sku, p.category || "—", p.stock, formatAFN(p.purchasePrice || 0), formatAFN(p.sellingPrice || 0),
          p.status === "PUBLISHED" ? t("published") : t("draft"),
          <form action={archiveProductAction} key={String(p._id)}><input type="hidden" name="productId" value={String(p._id)} /><DangerButton>{t("archive")}</DangerButton></form>,
        ])} />
      </Panel>
    </ModulePage>
  );
}
