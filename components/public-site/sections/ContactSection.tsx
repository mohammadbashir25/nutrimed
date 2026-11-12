import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import SectionReveal from "../../shared/SectionReveal";
import type { AppLocale } from "../types";

type ContactContent = {
  eyebrow: string; title: string; description: string; button: string;
  emailLabel: string; phoneLabel: string; addressLabel: string; detailsMessage: string;
};

export default function ContactSection({ content, locale }: { content: ContactContent; locale: AppLocale }) {
  const details = [
    { label: content.emailLabel, Icon: Mail },
    { label: content.phoneLabel, Icon: Phone },
    { label: content.addressLabel, Icon: MapPin },
  ];

  return (
    <section lang={locale} className="relative overflow-hidden bg-[#062f5e] py-24 text-white md:py-32">
      <div className="pointer-events-none absolute -end-32 -top-40 size-[500px] rounded-full border border-white/[0.08]" />
      <div className="pointer-events-none absolute -end-12 -top-20 size-[300px] rounded-full border border-white/[0.08]" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <SectionReveal>
          <div className="max-w-[850px]">
            <div className="mb-8 flex items-center gap-3 text-[10px] font-extrabold tracking-[0.2em] text-[#ff963d]"><span className="h-px w-9 bg-[#ff963d]" />{content.eyebrow}</div>
            <h2 className="text-4xl font-extrabold leading-[1.1] tracking-[-0.06em] md:text-6xl">{content.title}</h2>
            <p className="mt-7 max-w-[620px] text-base leading-8 text-white/65">{content.description}</p>
            <Link href="/contact" className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#ff7a0a] px-7 py-4 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:bg-[#e66d08]">
              {content.button}<ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </SectionReveal>
        <div className="mt-20 grid gap-7 border-t border-white/15 pt-9 sm:grid-cols-3">
          {details.map(({ label, Icon }) => (
            <div key={label} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#ff963d]"><Icon size={18} /></span>
              <div><span className="text-xs font-bold text-white">{label}</span><p className="mt-2 text-xs leading-6 text-white/45">{content.detailsMessage}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
