import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Check, FlaskConical, HeartHandshake, ShieldCheck, Users } from "lucide-react";
import PageHero from "@/components/public-site/PageHero";
import SectionReveal from "@/components/shared/SectionReveal";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.commitment" });
  return { title: t("title"), description: t("intro") };
}

export default async function CommitmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.commitment" });
  const items = [
    { icon: ShieldCheck, title: t("qualityTitle"), body: t("qualityBody"), number: "01" },
    { icon: Users, title: t("peopleTitle"), body: t("peopleBody"), number: "02" },
    { icon: HeartHandshake, title: t("responsibilityTitle"), body: t("responsibilityBody"), number: "03" },
    { icon: FlaskConical, title: t("careTitle"), body: t("careBody"), number: "04" },
  ];

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} description={t("intro")} index="03 / COMMITMENT" />
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
          <SectionReveal><div className="max-w-3xl"><span className="text-[10px] font-extrabold tracking-[0.2em] text-[#ff7a0a]">{t("standardLabel")}</span><h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-[-0.055em] text-[#062f5e] md:text-5xl">{t("standardTitle")}</h2><p className="mt-6 text-base leading-8 text-[#66778a]">{t("standardBody")}</p></div></SectionReveal>
          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {items.map(({ icon: Icon, title, body, number }, index) => (
              <SectionReveal key={number} delay={index * 0.07}>
                <article className="group flex h-full gap-6 rounded-[1.4rem] border border-[#e1e7ee] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#c6d6e4] hover:shadow-[0_20px_45px_rgba(6,47,94,.06)] md:p-9">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#edf4fa] text-[#02488f] transition-colors group-hover:bg-[#02488f] group-hover:text-white"><Icon size={24} strokeWidth={1.6} /></span>
                  <div><div className="text-[10px] font-extrabold tracking-[0.2em] text-[#ff7a0a]">{number} / PRINCIPLE</div><h3 className="mt-3 text-xl font-bold text-[#062f5e]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#66778a]">{body}</p></div>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#062f5e] py-20 text-white"><div className="mx-auto grid max-w-[1440px] gap-10 px-5 md:px-10 lg:grid-cols-[1fr_auto] lg:items-center lg:px-16"><div><span className="text-[10px] font-extrabold tracking-[0.2em] text-[#ff963d]">{t("promiseLabel")}</span><h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-[-0.05em] md:text-4xl">{t("promiseTitle")}</h2></div><div className="flex items-center gap-3 rounded-2xl border border-white/15 px-5 py-4 text-sm font-semibold text-white/75"><Check className="text-[#ff963d]" size={20} />{t("promiseTag")}</div></div></section>
    </main>
  );
}
