"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Globe2, Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import type { AppLocale } from "@/components/public-site/types";

type NavbarProps = {
  locale: AppLocale;
  content: {
    home: string;
    about: string;
    products: string;
    commitment: string;
    contact: string;
    contactButton: string;
  };
};

export default function Navbar({ locale, content }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const languages: { code: AppLocale; label: string }[] = [
    { code: "en", label: "English" },
    { code: "fa", label: "دری" },
    { code: "ps", label: "پښتو" },
  ];

  const links = [
    { label: content.home, href: "/" as const },
    { label: content.about, href: "/about" as const },
    { label: content.products, href: "/products" as const },
    { label: content.commitment, href: "/commitment" as const },
    { label: content.contact, href: "/contact" as const },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8edf2] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 md:px-10 xl:px-16">
        <Link href="/" className="group flex items-center gap-3" aria-label="Nutrimed home">
          <span className="relative flex size-10 items-center justify-center overflow-hidden bg-[#02488f] text-xl font-black text-white transition-transform duration-300 group-hover:-rotate-6">
            N
            <span className="absolute -bottom-1 -end-1 size-4 rounded-full bg-[#ff7a0a]" />
          </span>
          <span className="text-[25px] font-extrabold tracking-[-0.075em] text-[#062f5e]">
            nutrimed<span className="text-[#ff7a0a]">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <motion.div
              key={link.href}
              whileHover={reduceMotion ? undefined : { y: -1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative block py-2 text-[13px] font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-[2px] after:h-[2px] after:origin-left after:scale-x-0 after:bg-[#ff7a0a] after:transition-transform hover:text-[#02488f] hover:after:scale-x-100 ${
                  isActive(link.href) ? "text-[#02488f] after:scale-x-100" : "text-[#607186]"
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setLanguageOpen((value) => !value)}
              className="flex items-center gap-2 rounded-full px-2 py-2 text-xs font-semibold text-[#52657a] transition-colors hover:bg-[#f3f6f9]"
              aria-expanded={languageOpen}
              aria-label="Choose language"
            >
              <Globe2 size={16} />
              {languages.find((item) => item.code === locale)?.label}
              <ChevronDown size={13} className={`transition-transform ${languageOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {languageOpen && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute end-0 top-full mt-3 min-w-36 overflow-hidden rounded-xl border border-[#e1e7ee] bg-white p-1.5 shadow-[0_18px_50px_rgba(6,47,94,0.14)]"
                >
                  {languages.map((language) => (
                    <Link
                      key={language.code}
                      href={pathname}
                      locale={language.code}
                      onClick={() => setLanguageOpen(false)}
                      className={`block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-[#f3f6f9] ${
                        locale === language.code ? "font-bold text-[#02488f]" : "text-[#607186]"
                      }`}
                    >
                      {language.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/contact"
              className="hidden items-center gap-2 rounded-full bg-[#02488f] px-5 py-3 text-xs font-bold text-white shadow-[0_8px_20px_rgba(2,72,143,0.16)] transition-colors hover:bg-[#062f5e] hover:shadow-[0_12px_24px_rgba(2,72,143,0.22)] sm:flex"
            >
              {content.contactButton}
              <ArrowUpRight size={15} />
            </Link>
          </motion.div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex size-10 items-center justify-center rounded-xl border border-[#e1e7ee] text-[#062f5e] lg:hidden"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "close" : "menu"}
                initial={reduceMotion ? false : { opacity: 0, rotate: -8, scale: 0.9 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, rotate: 8, scale: 0.9 }}
                transition={{ duration: reduceMotion ? 0 : 0.16 }}
                className="flex"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.nav
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[#e8edf2] bg-white px-5 shadow-lg lg:hidden"
            aria-label="Mobile navigation"
          >
            <motion.div
              initial={reduceMotion ? false : { y: -8 }}
              animate={{ y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.24, delay: reduceMotion ? 0 : 0.04 }}
              className="pb-5 pt-2"
            >
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between border-b border-[#eef1f4] py-4 text-sm font-semibold ${
                isActive(link.href) ? "text-[#02488f]" : "text-[#52657a]"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-[#ff7a0a]">0{index + 1}</span>
                {link.label}
              </span>
              <ArrowUpRight size={16} />
            </Link>
          ))}
          <div className="flex gap-3 pt-5 sm:hidden">
            {languages.map((language) => (
              <Link
                key={language.code}
                href={pathname}
                locale={language.code}
                onClick={() => setMenuOpen(false)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                  locale === language.code ? "border-[#02488f] bg-[#eef5fb] text-[#02488f]" : "border-[#e1e7ee] text-[#607186]"
                }`}
              >
                {language.label}
              </Link>
            ))}
          </div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
