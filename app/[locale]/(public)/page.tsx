import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";

import HomePage from "@/components/public-site/HomePage";
import type { AppLocale, HomeContent } from "@/components/public-site/types";
import { routing } from "@/i18n/routing";
import { getPublishedProducts } from "@/features/products/services/product.service";

import en from "../../../messages/en.json";
import fa from "../../../messages/fa.json";
import ps from "../../../messages/ps.json";

const contentByLocale: Record<AppLocale, HomeContent> = {
  en: en as HomeContent,
  fa: fa as HomeContent,
  ps: ps as HomeContent,
};

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const currentLocale = locale as AppLocale;
  const content = contentByLocale[currentLocale];
  const products = await getPublishedProducts(currentLocale);

  return (
    <HomePage locale={currentLocale} content={content} products={products} />
  );
}
