import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight, Compass, Handshake, HeartHandshake, ShieldCheck } from "lucide-react";
import PageHero from "@/components/public-site/PageHero";
import { Link } from "@/i18n/navigation";
import SectionReveal from "@/components/shared/SectionReveal";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });
  return { title: t("title"), description: t("intro") };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });
  const principles = [
    { icon: Compass, number: "01", title: t("principleOneTitle"), text: t("principleOneText") },
    { icon: Handshake, number: "02", title: t("principleTwoTitle"), text: t("principleTwoText") },
    { icon: ShieldCheck, number: "03", title: t("principleThreeTitle"), text: t("principleThreeText") },
  ];

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} description={t("intro")} index="01 / ABOUT" />
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 md:px-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-24 lg:px-16">
          <SectionReveal>
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#ff7a0a]">{t("storyLabel")}</span>
            <p className="mt-6 text-3xl font-bold leading-tight tracking-[-0.05em] text-[#062f5e] md:text-4xl">{t("storyTitle")}</p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <p className="text-base leading-8 text-[#66778a]">{t("storyBody")}</p>
            <p className="mt-6 text-base leading-8 text-[#66778a]">{t("storySecond")}</p>
            <div className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#f1f6fa] px-5 py-3 text-xs font-bold tracking-wide text-[#02488f]"><HeartHandshake size={17} />{t("signature")}</div>
          </SectionReveal>
        </div>
      </section>
      <section className="bg-[#f3f6f9] py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
          <SectionReveal><div className="mb-12 max-w-2xl"><span className="text-[10px] font-extrabold tracking-[0.2em] text-[#ff7a0a]">{t("principlesEyebrow")}</span><h2 className="mt-5 text-3xl font-extrabold tracking-[-0.05em] text-[#062f5e] md:text-5xl">{t("principlesTitle")}</h2></div></SectionReveal>
          <div className="grid gap-4 md:grid-cols-3">
            {principles.map(({ icon: Icon, number, title, text }, i) => (
              <SectionReveal key={number} delay={i * 0.08}>
                <article className="h-full rounded-[1.4rem] border border-[#e0e7ee] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(6,47,94,.07)] md:p-8">
                  <div className="flex items-center justify-between"><span className="flex size-12 items-center justify-center rounded-xl bg-[#edf4fa] text-[#02488f]"><Icon size={22} /></span><span className="text-xs font-extrabold text-[#ff7a0a]">{number}</span></div>
                  <h3 className="mt-10 text-xl font-bold text-[#062f5e]">{title}</h3><p className="mt-4 text-sm leading-7 text-[#66778a]">{text}</p>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#062f5e] py-16 text-white md:py-20"><div className="mx-auto flex max-w-[1440px] flex-col gap-7 px-5 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16"><div><span className="text-[10px] font-extrabold tracking-[0.2em] text-[#ff963d]">{t("closingEyebrow")}</span><h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-[-0.04em] md:text-4xl">{t("closingTitle")}</h2></div><Link href="/contact" className="inline-flex items-center gap-3 self-start rounded-full bg-[#ff7a0a] px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-[#e66d08] lg:self-center">{t("closingButton")}<ArrowUpRight size={17} /></Link></div></section>
    </main>
  );
}
