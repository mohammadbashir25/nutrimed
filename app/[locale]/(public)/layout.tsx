import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { routing } from "@/i18n/routing";
import type { AppLocale, HomeContent } from "@/components/public-site/types";
import PublicPageTransition from "@/components/public-site/PublicPageTransition";

import en from "../../../messages/en.json";
import fa from "../../../messages/fa.json";
import ps from "../../../messages/ps.json";

const contentByLocale: Record<AppLocale, HomeContent> = {
  en: en as HomeContent,
  fa: fa as HomeContent,
  ps: ps as HomeContent,
};

export default async function PublicLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const currentLocale = locale as AppLocale;
  const content = contentByLocale[currentLocale];

  return (
    <div id="top" className="flex min-h-screen flex-col">
      <Navbar locale={currentLocale} content={content.nav} />
      <div className="flex-1">
        <PublicPageTransition>{children}</PublicPageTransition>
      </div>
      <Footer locale={currentLocale} content={content.footer} nav={content.nav} />
    </div>
  );
}
