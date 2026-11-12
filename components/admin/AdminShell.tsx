"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Activity, BarChart3, Boxes, ChevronLeft, ChevronRight, ClipboardList, CreditCard, LayoutDashboard, LogOut, Menu, Package, Receipt, Settings, ShoppingBag, Truck, Users, X } from "lucide-react";
import { logoutAction } from "@/features/admin/actions/auth";

const nav = [
  { label: "overview", href: "/admin", icon: LayoutDashboard },
  { label: "products", href: "/admin/products", icon: Package },
  { label: "inventory", href: "/admin/inventory", icon: Boxes },
  { label: "sales", href: "/admin/sales", icon: ShoppingBag },
  { label: "purchases", href: "/admin/purchases", icon: ClipboardList },
  { label: "customers", href: "/admin/customers", icon: Users },
  { label: "suppliers", href: "/admin/suppliers", icon: Truck },
  { label: "expenses", href: "/admin/expenses", icon: Receipt },
  { label: "finance", href: "/admin/finance", icon: CreditCard },
  { label: "reports", href: "/admin/reports", icon: BarChart3 },
  { label: "settings", href: "/admin/settings", icon: Settings },
] as const;
export default function AdminShell({ children, adminName, locale }: { children: React.ReactNode; adminName: string; locale: string }) {
  const pathname = usePathname();
  const t = useTranslations("admin");
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  return <div className="min-h-screen bg-[#f4f6f8] text-[#172b42]">
    {open && <button aria-label="Close navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" />}
    <aside className={`fixed inset-y-0 start-0 z-50 flex flex-col border-e border-[#e1e7ee] bg-white transition-all duration-200 ${open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"} lg:translate-x-0 rtl:lg:translate-x-0 ${collapsed ? "w-[84px]" : "w-[252px]"}`}>
      <div className="flex h-[76px] items-center gap-3 border-b border-[#edf1f5] px-5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#02488f] text-sm font-black text-white">N</div>
        {!collapsed && <div className="min-w-0"><div className="font-extrabold tracking-tight text-[#062f5e]">NUTRIMED</div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8a99a9]">{t("management")}</div></div>}
        <button onClick={() => setOpen(false)} className="ms-auto lg:hidden" aria-label="Close menu"><X size={18}/></button>
      </div>
      <div className="px-4 pb-2 pt-6 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#9aa7b5]">{!collapsed && t("workspace")}</div>
      <nav className="admin-scrollbar flex-1 space-y-1 overflow-y-auto px-3">
        {nav.map(({label,href,icon:Icon}) => { const active = href === "/admin" ? pathname.endsWith("/admin") : pathname.includes(href); return <Link key={href} href={`/${locale}${href}`} title={collapsed ? t(`nav.${label}`) : undefined} onClick={() => setOpen(false)} className={`group flex h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-bold transition-colors ${active ? "bg-[#eef5fb] text-[#02488f]" : "text-[#68798b] hover:bg-[#f7f9fb] hover:text-[#062f5e]"}`}><Icon size={18} strokeWidth={active ? 2.4 : 1.9}/>{!collapsed && <span>{t(`nav.${label}`)}</span>}{active && !collapsed && <span className="ms-auto h-1.5 w-1.5 rounded-full bg-[#ff7a0a]"/>}</Link>})}
      </nav>
      <div className="border-t border-[#edf1f5] p-3">
        <div className={`mb-3 flex items-center gap-3 rounded-xl bg-[#f7f9fb] p-2.5 ${collapsed ? "justify-center" : ""}`}><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#dceaf7] text-xs font-black text-[#02488f]">{adminName.slice(0,1).toUpperCase()}</div>{!collapsed && <div className="min-w-0"><div className="truncate text-xs font-extrabold">{adminName}</div><div className="text-[10px] text-[#8a99a9]">{t("administrator")}</div></div>}</div>
        <form action={logoutAction}><input type="hidden" name="locale" value={locale}/><button className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-xs font-bold text-[#8b5960] hover:bg-red-50"><LogOut size={17}/>{!collapsed && t("signOut")}</button></form>
        <button onClick={() => setCollapsed(!collapsed)} className="mt-1 hidden h-9 w-full items-center justify-center rounded-lg text-[#8a99a9] hover:bg-slate-50 lg:flex" aria-label="Toggle sidebar">{collapsed ? <ChevronRight size={17}/> : <ChevronLeft size={17}/>}</button>
      </div>
    </aside>
    <div className={`min-h-screen transition-[padding] duration-200 ${collapsed ? "lg:ps-[84px]" : "lg:ps-[252px]"}`}>
      <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#e1e7ee] bg-white/95 px-5 backdrop-blur md:px-8">
        <div className="flex items-center gap-3"><button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20}/></button><div><div className="text-sm font-extrabold text-[#062f5e]">{t("businessWorkspace")}</div><div className="hidden text-[11px] text-[#8a99a9] sm:block">{t("operationsFinance")}</div></div></div>
        <div className="flex items-center gap-3"><span className="hidden rounded-full border border-[#e1e7ee] px-3 py-1.5 text-[11px] font-bold text-[#66778a] sm:inline-flex"><Activity size={13} className="me-1.5 text-emerald-600"/>  {t("systemWorkspace")}</span><LanguageSwitcher /><div className="grid h-9 w-9 place-items-center rounded-full bg-[#fff1e5] text-xs font-black text-[#d95f00]">{adminName.slice(0,1).toUpperCase()}</div></div>
      </header>
      <main className="mx-auto w-full max-w-[1600px] p-5 md:p-8">{children}</main>
    </div>
  </div>;
}
