import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Currency } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FX: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  AUD: 1.52,
  CHF: 0.88,
  LKR: 298.4,
};

export const CURRENCY_LOCALE: Record<Currency, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  AUD: "en-AU",
  CHF: "de-CH",
  LKR: "en-LK",
};

export function fmt(amount: number, ccy: Currency): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE[ccy] ?? "en-US", {
    style: "currency",
    currency: ccy,
    maximumFractionDigits: ccy === "LKR" ? 0 : 2,
  }).format(amount);
}

export const usdTo = (amountUSD: number, ccy: Currency) =>
  Math.round(amountUSD * FX[ccy] * 100) / 100;
export const toUSD = (amount: number, ccy: Currency) => amount / FX[ccy];
export const toLKR = (amount: number, ccy: Currency) =>
  Math.round(toUSD(amount, ccy) * FX.LKR);

export function dF(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso + (iso.length === 10 ? "T00:00:00" : "")).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const daysBetween = (a: string, b: string) =>
  Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);

export const TODAY = "2026-09-23";
export function dISO(offset: number): string {
  const d = new Date(TODAY + "T00:00:00");
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export const SLOGAN = "Arrive as a guest. Leave as a Island family.";
