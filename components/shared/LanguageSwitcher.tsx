"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const languages: { code: AppLocale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fa", label: "دری" },
  { code: "ps", label: "پښتو" }
];

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale as AppLocale });
  }

  return (
    <label className="language-control">
      <span className="sr-only">Select language</span>
      <select
        aria-label="Select language"
        value={locale}
        onChange={(event) => handleChange(event.target.value)}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}
