import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getPublishedProductBySlug } from "@/features/products/services/product.service";
import type { AppLocale } from "@/components/public-site/types";
import SectionReveal from "@/components/shared/SectionReveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getPublishedProductBySlug(slug, locale as AppLocale);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.shortDescription };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await getPublishedProductBySlug(slug, locale as AppLocale);
  if (!product) notFound();

  const t = await getTranslations({ locale, namespace: "pages.productDetail" });

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 lg:px-16">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-[#66778a] transition-colors hover:text-[#02488f]"><ArrowLeft size={16} />{t("back")}</Link>
        <div className="grid gap-12 py-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-20 lg:py-24">
          <SectionReveal className="grid aspect-square place-items-center overflow-hidden rounded-[2rem] bg-[#f1f5f8] p-8">
            {product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-contain" /> : <span className="text-sm font-semibold text-[#8190a0]">{t("imagePending")}</span>}
          </SectionReveal>
          <SectionReveal delay={0.08}>
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#ff7a0a]">{product.category}</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.06em] text-[#062f5e] md:text-6xl">{product.name}</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#66778a]">{product.shortDescription}</p>
            <div className="mt-10 flex items-center gap-3 rounded-2xl border border-[#e1e7ee] bg-[#fbfcfd] p-5 text-sm leading-7 text-[#52657a]"><CheckCircle2 className="shrink-0 text-[#16845b]" size={20} />{t("publishedNote")}</div>
            <Link href="/contact" className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#02488f] px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-[#062f5e]">{t("inquire")}<ArrowUpRight size={17} /></Link>
          </SectionReveal>
        </div>
      </div>
    </main>
  );
}
