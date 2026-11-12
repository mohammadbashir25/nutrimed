"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Activity, ShieldCheck, HeartPulse } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "../types";
import ImagePlaceholder from "../../shared/ImagePlaceholder";

type HeroContent = {
  eyebrow: string; title: string; titleAccent: string; description: string;
  primary: string; secondary: string; imageLabel: string; imageNote: string; vertical: string;
};

export default function HeroSection({ content, locale }: { content: HeroContent; locale: AppLocale }) {
  const reduceMotion = useReducedMotion();
  const rtl = locale !== "en";

  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#fbfcfe]">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(rgba(2,72,143,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(2,72,143,.045)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="pointer-events-none absolute -end-40 top-10 -z-10 size-[520px] rounded-full bg-[#dceaf7]/60 blur-3xl" />
      <div className="mx-auto grid min-h-[660px] max-w-[1440px] items-center gap-12 px-5 py-20 md:px-10 lg:grid-cols-[1fr_0.92fr] lg:gap-16 lg:px-16 lg:py-24">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <div className="mb-8 flex items-center gap-3 text-[10px] font-extrabold tracking-[0.22em] text-[#e66d08]">
            <span className="h-px w-10 bg-[#ff7a0a]" />{content.eyebrow}
          </div>
          <h1 className="max-w-[760px] text-[clamp(3.15rem,6.3vw,6.6rem)] font-extrabold leading-[1.02] tracking-[-0.075em] text-[#062f5e]">
            {content.title}
            <span className="mt-2 block text-[#07569f]">{content.titleAccent}</span>
          </h1>
          <p className="mt-8 max-w-[530px] text-base leading-8 text-[#66778a] md:text-lg">{content.description}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <motion.div whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} transition={{ duration: 0.22 }}>
              <Link href="/products" className="group inline-flex items-center gap-3 rounded-full bg-[#02488f] px-6 py-4 text-sm font-bold text-white shadow-[0_12px_30px_rgba(2,72,143,.18)] transition-colors hover:bg-[#062f5e]">
                {content.primary}<ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
            <motion.div whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} transition={{ duration: 0.22 }}>
              <Link href="/about" className="inline-flex items-center gap-2 rounded-full border border-[#dce4ec] bg-white px-5 py-4 text-sm font-bold text-[#062f5e] transition-colors hover:border-[#ff7a0a] hover:text-[#02488f]">
                {content.secondary}<ArrowDown size={15} />
              </Link>
            </motion.div>
          </div>
          <div className="mt-14 flex items-center gap-3 text-[10px] font-bold tracking-[0.17em] text-[#8190a0]">
            <span className="size-2 rounded-full bg-[#ff7a0a] shadow-[0_0_0_5px_rgba(255,122,10,.12)]" />{content.vertical}
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[610px]"
        >
          <div className="absolute -inset-5 rounded-[2.5rem] border border-[#d7e4f0] rotate-[-4deg]" />
          <div className="relative overflow-hidden rounded-[2rem] bg-[#062f5e] p-7 text-white shadow-[0_35px_80px_rgba(6,47,94,.2)] md:p-10">
            <div className="absolute -end-20 -top-24 size-72 rounded-full border border-white/10" />
            <div className="absolute -end-5 -top-10 size-52 rounded-full border border-white/10" />
            <div className="relative flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.22em] text-[#ffb16d]">NUTRIMED / WELLBEING</span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-[9px] tracking-widest text-white/60">EST. BRAND</span>
            </div>
            <div className="relative mt-16">
              <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-white/10 text-[#ff963d]"><Activity size={30} strokeWidth={1.4} /></div>
              <p className="max-w-sm text-3xl font-bold leading-tight tracking-[-0.045em] md:text-4xl">{content.vertical}</p>
              <div className="mt-12 grid grid-cols-3 gap-3 border-t border-white/15 pt-6">
                {[ShieldCheck, HeartPulse, Activity].map((Icon, index) => (
                  <div key={index} className="flex flex-col gap-3">
                    <Icon size={21} className="text-[#ff963d]" strokeWidth={1.5} />
                    <span className="h-1 w-full rounded-full bg-white/15"><span className="block h-1 w-2/3 rounded-full bg-[#ff963d]" /></span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative mt-14 flex items-center justify-between border-t border-white/10 pt-5 text-[9px] font-semibold tracking-[0.2em] text-white/45">
              <span>CARE IN EVERY DETAIL</span><span>{rtl ? "۰۱ / ۰۳" : "01 / 03"}</span>
            </div>
          </div>
          <div className="absolute -bottom-7 -start-4 hidden rounded-2xl border border-[#e1e7ee] bg-white px-5 py-4 shadow-[0_18px_40px_rgba(6,47,94,.12)] sm:block">
            <span className="block text-[9px] font-bold tracking-[0.18em] text-[#ff7a0a]">OUR PRINCIPLE</span>
            <span className="mt-1 block text-sm font-bold text-[#062f5e]">People first. Always.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
