import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/components/public-site/types";

type FooterProps = {
  locale: AppLocale;
  content: {
    statement: string;
    explore: string;
    copyright: string;
    backToTop: string;
  };
  nav: {
    home: string;
    about: string;
    products: string;
    commitment: string;
    contact: string;
  };
};

export default function Footer({ locale, content, nav }: FooterProps) {
  const links = [
    { label: nav.home, href: "/" as const },
    { label: nav.about, href: "/about" as const },
    { label: nav.products, href: "/products" as const },
    { label: nav.commitment, href: "/commitment" as const },
    { label: nav.contact, href: "/contact" as const },
  ];

  return (
    <footer lang={locale} className="relative overflow-hidden bg-[#041f3d] text-white">
      <div className="pointer-events-none absolute -end-28 -top-40 size-[420px] rounded-full border border-white/[0.07]" />
      <div className="pointer-events-none absolute -end-8 -top-20 size-[270px] rounded-full border border-white/[0.07]" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <div className="grid gap-14 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-20">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex size-10 items-center justify-center bg-white text-xl font-black text-[#02488f]">N</span>
              <span className="text-2xl font-extrabold tracking-[-0.075em]">
                nutrimed<span className="text-[#ff7a0a]">.</span>
              </span>
            </Link>
            <p className="mt-6 max-w-md text-sm leading-8 text-white/60">{content.statement}</p>
         </div>

          <div>
            <h2 className="mb-6 text-[10px] font-extrabold tracking-[0.2em] text-[#ff963d]">{content.explore}</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="group flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white">
                  {link.label}
                  <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-white/10 py-6 text-[10px] font-medium tracking-wide text-white/45 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} NUTRIMED. {content.copyright}</span>
          <a href="#top" className="inline-flex items-center gap-2 transition-colors hover:text-white">
            {content.backToTop}<ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
