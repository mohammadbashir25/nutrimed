
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Manrope, Noto_Sans_Arabic } from "next/font/google";

import { routing, type AppLocale } from "@/i18n/routing";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

const siteName = "Nutrimed";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const seoContent: Record<
  AppLocale,
  {
    title: string;
    description: string;
    keywords: string[];
    ogLocale: string;
  }
> = {
  en: {
    title: "Nutrimed | Healthcare Products and Solutions",
    description:
      "Discover Nutrimed, its products, company information, and healthcare solutions. Explore our product range and contact our team for inquiries.",
    keywords: [
      "Nutrimed",
      "healthcare products",
      "medical products",
      "health solutions",
      "Nutrimed company",
    ],
    ogLocale: "en_US",
  },
  fa: {
    title: "نوتریمِد | محصولات و راهکارهای صحی",
    description:
      "با شرکت نوتریمِد، محصولات و راهکارهای صحی آن آشنا شوید. مجموعه محصولات ما را بررسی کنید و برای معلومات بیشتر با تیم ما تماس بگیرید.",
    keywords: ["نوتریمِد", "محصولات صحی", "محصولات طبی", "راهکارهای صحی"],
    ogLocale: "fa_AF",
  },
  ps: {
    title: "نوتریمډ | روغتیايي محصولات او حللارې",
    description:
      "له نوتریمډ شرکت، د هغه له محصولاتو او روغتیايي حللارو سره بلد شئ. زموږ محصولات وګورئ او د نورو معلوماتو لپاره له موږ سره اړیکه ونیسئ.",
    keywords: ["نوتریمډ", "روغتیايي محصولات", "طبي محصولات", "روغتیايي حللارې"],
    ogLocale: "ps_AF",
  },
};

const languageAlternates = {
  en: "/en",
  fa: "/fa",
  ps: "/ps",
};

function getSiteUrl() {
  if (!siteUrl) return undefined;

  try {
    return new URL(siteUrl);
  } catch {
    return undefined;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const currentLocale = locale as AppLocale;
  const seo = seoContent[currentLocale];
  const baseUrl = getSiteUrl();
  const canonicalPath = `/${currentLocale}`;

  return {
    metadataBase: baseUrl,

    title: {
      default: seo.title,
      template: `%s | ${siteName}`,
    },

    description: seo.description,
    applicationName: siteName,
    keywords: seo.keywords,
    category: "Healthcare",

    alternates: {
      canonical: canonicalPath,
      languages: {
        en: languageAlternates.en,
        fa: languageAlternates.fa,
        ps: languageAlternates.ps,
        "x-default": languageAlternates.en,
      },
    },

    openGraph: {
      type: "website",
      siteName,
      title: seo.title,
      description: seo.description,
      locale: seo.ogLocale,
      url: canonicalPath,
      alternateLocale: ["en_US", "fa_AF", "ps_AF"].filter(
        (item) => item !== seo.ogLocale,
      ),
    },

    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    referrer: "strict-origin-when-cross-origin",
  };
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as AppLocale;
  const isRtl = currentLocale === "fa" || currentLocale === "ps";

  setRequestLocale(currentLocale);

  const messages = await getMessages();

  return (
    <html
      lang={currentLocale}
      dir={isRtl ? "rtl" : "ltr"}
      className={`${manrope.variable} ${notoArabic.variable}`}
    >
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteName,
              ...(getSiteUrl() ? { url: getSiteUrl()?.origin } : {}),
              description: seoContent[currentLocale].description,
              availableLanguage: ["English", "Dari", "Pashto"],
            }).replace(/</g, "\\u003c"),
          }}
        />

        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
