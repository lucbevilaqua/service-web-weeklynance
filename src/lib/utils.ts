import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

declare global {
  interface String {
    formatToCurrency(locale?: string, currency?: string): string;
  }
  interface Number {
    formatToCurrency(locale?: string, currency?: string): string;
  }
}

String.prototype.formatToCurrency = function (
  currency = "EUR",
  locale = "en-IE"
): string {
  const number = parseFloat(this.replace(',', '.'));
  if (isNaN(number)) return this.toString();

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(number);
};

Number.prototype.formatToCurrency = function (
  currency = "EUR",
  locale = "en-IE"
): string {
  const number = parseFloat(this.toString());

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(number);
};
