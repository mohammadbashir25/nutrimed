import { ArrowUpRight, Check, ShieldCheck, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import SectionReveal from "../../shared/SectionReveal";
import type { AppLocale } from "../types";

type CommitmentContent = {
  eyebrow: string; title: string; description: string;
  imageLabel: string; imageNote: string;
  points: { title: string; description: string }[];
};

const icons = [ShieldCheck, Users, Check];

export default function CommitmentSection({ content, locale }: { content: CommitmentContent; locale: AppLocale }) {
  return (
    <section className="relative overflow-hidden bg-[#f3f6f9] py-24 md:py-32">
      <div className="pointer-events-none absolute -start-40 top-0 size-[460px] rounded-full border border-[#dbe5ee]" />
      <div className="pointer-events-none absolute -start-20 top-20 size-[300px] rounded-full border border-[#dbe5ee]" />
      <div className="relative mx-auto grid max-w-[1440px] gap-16 px-5 md:px-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start lg:gap-24 lg:px-16">
        <SectionReveal>
          <div className="mb-7 flex items-center gap-3 text-[10px] font-extrabold tracking-[0.2em] text-[#ff7a0a]"><span className="h-px w-9 bg-[#ff7a0a]" />{content.eyebrow}</div>
          <h2 className="max-w-[600px] text-4xl font-extrabold leading-[1.12] tracking-[-0.06em] text-[#062f5e] md:text-5xl">{content.title}</h2>
          <p className="mt-7 max-w-[520px] text-base leading-8 text-[#66778a]">{content.description}</p>
          <Link href="/commitment" className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#062f5e] px-6 py-4 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:bg-[#02488f]">
            {locale === "en" ? "Explore our commitment" : locale === "fa" ? "بیشتر بخوانید" : "نور ولولئ"}<ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </SectionReveal>
        <div className="space-y-4">
          {content.points.map((point, index) => {
            const Icon = icons[index] ?? Check;
            return (
              <SectionReveal key={point.title} delay={index * 0.08}>
                <article className="group grid grid-cols-[52px_1fr_24px] items-start gap-5 rounded-2xl border border-[#e0e7ee] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#b9cde0] hover:shadow-[0_18px_45px_rgba(6,47,94,.07)] md:p-7">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-[#edf4fa] text-[#02488f]"><Icon size={21} strokeWidth={1.6} /></span>
                  <div><span className="text-[9px] font-extrabold tracking-[0.2em] text-[#ff7a0a]">0{index + 1} / PRINCIPLE</span><h3 className="mt-2 text-lg font-bold text-[#062f5e]">{point.title}</h3><p className="mt-2 text-sm leading-7 text-[#66778a]">{point.description}</p></div>
                  <ArrowUpRight size={17} className="mt-1 text-[#a3b1bf] transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#ff7a0a]" />
                </article>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
