export function formatAFN(value: number, locale = "en") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "AFN",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number, locale = "en") {
  return new Intl.NumberFormat(locale).format(value);
}
