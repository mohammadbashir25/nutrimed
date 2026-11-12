import { loginAction } from "@/features/admin/actions/auth";
import { getAdminSession } from "@/lib/server/session";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export default async function LoginPage({ searchParams, params }: { searchParams: Promise<{ error?: string }>; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getAdminSession();
  if (session) redirect(`/${locale}/admin`);
  const { error } = await searchParams;
  const t = await getTranslations({ locale, namespace: "admin.login" });
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f4f6f8] px-5 py-12">
      <div className="absolute end-5 top-5 z-10"><LanguageSwitcher /></div>
      <div className="pointer-events-none absolute -end-32 -top-40 h-[520px] w-[520px] rounded-full border border-[#dceaf7]" />
      <div className="pointer-events-none absolute -bottom-48 -start-40 h-[520px] w-[520px] rounded-full bg-[#eaf2fa]" />
      <section className="relative w-full max-w-[420px] rounded-[24px] border border-[#e1e7ee] bg-white p-8 shadow-[0_24px_80px_rgba(6,47,94,.08)]">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#02488f] text-white"><ShieldCheck size={24} /></div>
          <div><div className="text-lg font-black tracking-tight text-[#062f5e]">NUTRIMED</div><div className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#98a5b2]">{t("eyebrow")}</div></div>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#172b42]">{t("title")}</h1>
        <p className="mt-2 text-sm leading-6 text-[#8291a0]">{t("description")}</p>
        {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{t("invalid")}</p>}
        <form action={loginAction} className="mt-7 space-y-4">
          <input type="hidden" name="locale" value={locale} />
          <label className="block text-xs font-extrabold text-[#52667a]">{t("email")}<input name="email" type="email" autoComplete="username" required className="mt-2 h-11 w-full rounded-xl border border-[#dfe6ed] px-3 text-sm outline-none focus:border-[#5595d0]" /></label>
          <label className="block text-xs font-extrabold text-[#52667a]">{t("password")}<input name="password" type="password" autoComplete="current-password" required minLength={8} className="mt-2 h-11 w-full rounded-xl border border-[#dfe6ed] px-3 text-sm outline-none focus:border-[#5595d0]" /></label>
          <button className="mt-2 h-11 w-full rounded-xl bg-[#02488f] text-sm font-extrabold text-white transition hover:bg-[#062f5e]">{t("submit")}</button>
        </form>
        <Link href={`/${locale}`} className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-[#8291a0] hover:text-[#02488f]"><ArrowLeft size={14} />{t("return")}</Link>
        <div className="mt-7 border-t border-[#edf1f5] pt-5 text-center text-[10px] text-[#a1acb7]">{t("footer")} · Nutrimed</div>
      </section>
    </main>
  );
}
