"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function PageHero({
  eyebrow,
  title,
  description,
  index,
}: {
  eyebrow: string;
  title: string;
  description: string;
  index: string;
}) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.72;

  return (
    <section className="relative isolate overflow-hidden bg-[#f5f8fb]">
      <div className="pointer-events-none absolute -end-20 -top-36 -z-10 size-[430px] rounded-full border border-[#dbe5ee]" />
      <div className="pointer-events-none absolute -end-2 -top-16 -z-10 size-[280px] rounded-full border border-[#dbe5ee]" />
      <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-20 md:px-10 md:pb-20 md:pt-28 lg:px-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex items-center gap-3 text-[10px] font-extrabold tracking-[0.22em] text-[#e66d08]"
        >
          <span className="h-px w-10 bg-[#ff7a0a]" />{eyebrow}
        </motion.div>
        <div className="grid gap-10 lg:grid-cols-[1fr_260px] lg:items-end">
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[900px] text-[clamp(2.8rem,6vw,5.8rem)] font-extrabold leading-[1.04] tracking-[-0.07em] text-[#062f5e]"
          >
            {title}
          </motion.h1>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration, delay: reduceMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="border-s-2 border-[#ff7a0a] ps-5"
          >
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#ff7a0a]">NUTRIMED / {index}</span>
            <p className="mt-3 text-sm leading-7 text-[#66778a]">{description}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
