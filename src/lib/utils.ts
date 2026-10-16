/**
 * Utility function to conditionally join classNames
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format a number as currency
 */
export function formatPrice(
  amount: number,
  currency?: string,
  locale: string = "vi-VN"
): string {
  const num = typeof amount === "number" ? amount : Number(amount) || 0;
  if (currency) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(num);
  }
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(num);
}
