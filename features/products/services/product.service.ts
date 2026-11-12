import "server-only";
import type { AppLocale, Product as PublicProduct } from "@/components/public-site/types";
import { connectDB } from "@/lib/server/db";
import { Product } from "@/models";

type ProductRecord = { _id: unknown; sku: string; name: Record<string, string>; slug: Record<string, string>; description: Record<string, string>; category: string; image?: string; unit?: string };
function toPublicProduct(record: ProductRecord, locale: AppLocale): PublicProduct {
  return {
    id: String(record._id),
    slug: record.slug[locale] || record.slug.en || record.sku.toLowerCase(),
    name: record.name[locale] || record.name.en || "",
    category: record.category || "",
    shortDescription: record.description[locale] || record.description.en || "",
    image: record.image || "",
  } as PublicProduct;
}
export async function getPublishedProducts(locale: AppLocale): Promise<PublicProduct[]> {
  try {
    await connectDB();
    const records = await Product.find({ status: "PUBLISHED" }).sort({ displayOrder: 1, createdAt: -1 }).select("sku name slug description category image unit").lean();
    return records.map(record => toPublicProduct(record as unknown as ProductRecord, locale));
  } catch (error) {
    console.error("Public product catalogue is temporarily unavailable:", error);
    return [];
  }
}
export async function getPublishedProductBySlug(slug: string, locale: AppLocale): Promise<PublicProduct | null> {
  try {
    await connectDB();
    const record = await Product.findOne({ status: "PUBLISHED", [`slug.${locale}`]: slug }).select("sku name slug description category image unit").lean();
    return record ? toPublicProduct(record as unknown as ProductRecord, locale) : null;
  } catch (error) {
    console.error("Public product detail is temporarily unavailable:", error);
    return null;
  }
}
