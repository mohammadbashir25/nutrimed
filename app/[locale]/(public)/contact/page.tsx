import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone, ArrowUpRight, MessageCircle } from "lucide-react";
import PageHero from "@/components/public-site/PageHero";
import SectionReveal from "@/components/shared/SectionReveal";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  return { title: t("title"), description: t("intro") };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  const cards = [
    { icon: Mail, label: t("emailLabel"), value: t("emailValue"), note: t("emailNote") },
    { icon: Phone, label: t("phoneLabel"), value: t("phoneValue"), note: t("phoneNote") },
    { icon: MapPin, label: t("addressLabel"), value: t("addressValue"), note: t("addressNote") },
  ];

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} description={t("intro")} index="04 / CONTACT" />
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
          <SectionReveal><div className="max-w-2xl"><span className="text-[10px] font-extrabold tracking-[0.2em] text-[#ff7a0a]">{t("connectLabel")}</span><h2 className="mt-5 text-3xl font-extrabold tracking-[-0.05em] text-[#062f5e] md:text-5xl">{t("connectTitle")}</h2><p className="mt-6 text-base leading-8 text-[#66778a]">{t("connectBody")}</p></div></SectionReveal>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {cards.map(({ icon: Icon, label, value, note }, index) => (
              <SectionReveal key={label} delay={index * 0.08}>
                <article className="h-full rounded-[1.4rem] border border-[#e1e7ee] bg-[#fbfcfd] p-7 md:p-8">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-[#edf4fa] text-[#02488f]"><Icon size={21} /></span>
                  <h3 className="mt-8 text-xs font-extrabold tracking-[0.15em] text-[#ff7a0a]">{label}</h3>
                  <p className="mt-3 text-lg font-bold text-[#062f5e]">{value}</p>
                  <p className="mt-3 text-sm leading-7 text-[#66778a]">{note}</p>
                </article>
              </SectionReveal>
            ))}
          </div>
          <div className="mt-10 rounded-[1.5rem] bg-[#062f5e] p-8 text-white md:flex md:items-center md:justify-between md:p-10">
            <div className="flex gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#ff963d]"><MessageCircle size={22} /></span><div><h3 className="text-xl font-bold">{t("inquiryTitle")}</h3><p className="mt-2 max-w-xl text-sm leading-7 text-white/60">{t("inquiryBody")}</p></div></div>
            <div className="mt-7 inline-flex items-center gap-2 text-xs font-bold tracking-wide text-[#ffb16d] md:mt-0">{t("inquiryFootnote")}<ArrowUpRight size={15} /></div>
          </div>
        </div>
      </section>
    </main>
  );
}
