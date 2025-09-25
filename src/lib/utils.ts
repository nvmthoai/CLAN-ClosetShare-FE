import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple currency formatter with graceful fallback
export function formatCurrency(
  value: number | string | undefined | null,
  options: { currency?: string; locale?: string } = {}
) {
  if (value === undefined || value === null || value === "") return "—";
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "—";
  const { currency = "USD", locale = "en-US" } = options;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `$${num}`;
  }
}
