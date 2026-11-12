import { ArrowUpRight, Compass, Handshake, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import SectionReveal from "../../shared/SectionReveal";
import type { AppLocale } from "../types";

type AboutContent = {
  eyebrow: string; title: string; description: string; link: string;
  imageLabel: string; imageNote: string;
};

export default function AboutSection({ content, locale }: { content: AboutContent; locale: AppLocale }) {
  const values = [
    { icon: Compass, number: "01", title: locale === "en" ? "Purposeful work" : locale === "fa" ? "کار هدفمند" : "موخه‌مند کار" },
    { icon: Handshake, number: "02", title: locale === "en" ? "Built on trust" : locale === "fa" ? "بر پایه اعتماد" : "پر باور ولاړ" },
    { icon: Sparkles, number: "03", title: locale === "en" ? "Care in detail" : locale === "fa" ? "توجه به جزئیات" : "جزئیاتو ته پاملرنه" },
  ];

  return (
    <section className="relative bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 md:px-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-24 lg:px-16">
        <SectionReveal>
          <div className="mb-7 flex items-center gap-3 text-[10px] font-extrabold tracking-[0.2em] text-[#ff7a0a]"><span className="h-px w-9 bg-[#ff7a0a]" />{content.eyebrow}</div>
          <h2 className="max-w-[700px] text-4xl font-extrabold leading-[1.12] tracking-[-0.06em] text-[#062f5e] md:text-5xl">{content.title}</h2>
          <p className="mt-8 max-w-[580px] text-base leading-8 text-[#66778a]">{content.description}</p>
          <Link href="/about" className="group mt-9 inline-flex items-center gap-3 border-b border-[#ff7a0a] pb-2 text-sm font-bold text-[#02488f] transition-colors hover:text-[#ff7a0a]">
            {content.link}<ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </SectionReveal>
        <SectionReveal delay={0.12}>
          <div className="relative grid grid-cols-2 gap-3 md:gap-4">
            <div className="col-span-2 flex min-h-[190px] flex-col justify-between rounded-[1.5rem] bg-[#062f5e] p-7 text-white md:min-h-[220px] md:p-9">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#ff963d]">NUTRIMED / OUR APPROACH</span>
              <p className="max-w-md text-2xl font-bold leading-snug tracking-[-0.04em] md:text-3xl">Better choices begin with thoughtful standards.</p>
            </div>
            {values.map(({ icon: Icon, number, title }) => (
              <div key={number} className="rounded-[1.25rem] border border-[#e4eaf0] bg-[#f8fafc] p-5 md:p-6">
                <div className="flex items-center justify-between"><Icon size={21} className="text-[#02488f]" strokeWidth={1.6} /><span className="text-[10px] font-bold text-[#ff7a0a]">{number}</span></div>
                <p className="mt-9 text-sm font-bold text-[#173b60]">{title}</p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
