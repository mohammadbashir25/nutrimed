import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProductsSection from "@/components/public-site/sections/ProductsSection";
import { getPublishedProducts } from "@/features/products/services/product.service";
import type { AppLocale } from "@/components/public-site/types";
import PageHero from "@/components/public-site/PageHero";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.products" });
  return { title: t("title"), description: t("intro") };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const currentLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "pages.products" });
  const home = await getTranslations({ locale, namespace: "products" });
  const products = await getPublishedProducts(currentLocale);

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} description={t("intro")} index="02 / PRODUCTS" />
      <ProductsSection
        content={{
          eyebrow: home("eyebrow"),
          title: home("title"),
          description: home("description"),
          emptyTitle: home("emptyTitle"),
          emptyDescription: home("emptyDescription"),
          imageLabel: home("imageLabel"),
          imageNote: home("imageNote"),
          viewProduct: home("viewProduct"),
        }}
        products={products}
      />
      <section className="bg-[#f3f6f9] py-16"><div className="mx-auto max-w-[1440px] px-5 text-center md:px-10 lg:px-16"><p className="text-sm leading-7 text-[#66778a]">{t("catalogNote")}</p></div></section>
    </main>
  );
}
