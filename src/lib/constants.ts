import type { Currency, PaymentStatus, PaymentType, PlanStatus } from "./types";

export const COUNTRIES: { name: string; ccy: Currency }[] = [
  { name: "United Kingdom", ccy: "GBP" },
  { name: "Germany", ccy: "EUR" },
  { name: "France", ccy: "EUR" },
  { name: "Netherlands", ccy: "EUR" },
  { name: "Italy", ccy: "EUR" },
  { name: "Spain", ccy: "EUR" },
  { name: "Switzerland", ccy: "CHF" },
  { name: "Australia", ccy: "AUD" },
  { name: "United States", ccy: "USD" },
  { name: "Sri Lanka", ccy: "LKR" },
];

export const CURRENCIES: Currency[] = ["USD", "EUR", "GBP", "AUD", "CHF", "LKR"];

export const SETTINGS = {
  reviewFeeUSD: 0, // waived during launch (config in real build)
  minBudgetPPUSD: 100, // per-person minimum (client requirement)
  depositExpiryDays: 14,
  reviewEtaDays: 2,
};

export const PLAN_STATUS: Record<PlanStatus, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-slate-100 text-slate-500" },
  submitted: { label: "In Review Queue", cls: "bg-amber-100 text-amber-700" },
  under_review: { label: "Under Review", cls: "bg-sky-100 text-sky-700" },
  in_discussion: { label: "In Discussion", cls: "bg-indigo-100 text-indigo-700" },
  awaiting_tour_deposit: { label: "Deposit Due", cls: "bg-orange-100 text-orange-700" },
  awaiting_final_balance: { label: "Final Balance Due", cls: "bg-orange-100 text-orange-800" },
  bank_transfer_pending: { label: "Bank Verification", cls: "bg-cyan-100 text-cyan-800" },
  fully_paid: { label: "Fully Booked", cls: "bg-palm-light/40 text-palm-deep" },
  on_hold: { label: "On Hold — No Response", cls: "bg-slate-200 text-slate-600" },
  expired: { label: "Deposit Window Expired", cls: "bg-rose-100 text-rose-700" },
  cancelled: { label: "Cancelled", cls: "bg-rose-100 text-rose-700" },
  completed: { label: "Completed", cls: "bg-slate-100 text-slate-600" },
};

export const FLOW_STEPS: { key: PlanStatus; label: string }[] = [
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Claimed & reviewed" },
  { key: "in_discussion", label: "In discussion" },
  { key: "awaiting_tour_deposit", label: "Deposit" },
  { key: "awaiting_final_balance", label: "Final balance" },
  { key: "fully_paid", label: "Fully booked" },
];

export const PAYMENT_TYPE_LABEL: Record<PaymentType, string> = {
  review_fee: "Review Fee",
  tour_deposit: "Tour Booking Deposit",
  final_balance: "Final Balance",
  refund: "Refund",
};

export const PAYMENT_STATUS: Record<PaymentStatus, { label: string; cls: string }> = {
  succeeded: { label: "Paid", cls: "bg-palm-light/40 text-palm-deep" },
  pending: { label: "Pending", cls: "bg-cyan-100 text-cyan-800" },
  failed: { label: "Failed", cls: "bg-rose-100 text-rose-700" },
  refunded: { label: "Refunded", cls: "bg-slate-200 text-slate-600" },
};

export const BANK = {
  label: "Ruga Tours (Pvt) Ltd — USD Account",
  bank: "Commercial Bank of Ceylon",
  branch: "Colombo 03",
  acc: "800-123-4567-89",
  swift: "CCEYLKLX",
  note: "Use your plan reference (e.g. RGT-2026-1001) as the transfer reference.",
  reviewEmail: "payments@rugatours.com",
};

/** Unified refund bands — same for all three payments (see ruga-tours-refund-policy.md) */
export const REFUND_BANDS = [
  { minDays: 15, deduct: 0, refund: 100, label: "15+ days before start" },
  { minDays: 8, deduct: 15, refund: 85, label: "8–14 days before start" },
  { minDays: 0, deduct: 25, refund: 75, label: "≤7 days before start (incl. departure day)" },
];

export const STAFF = [
  { id: "st1", name: "Nimal Perera", role: "Front Desk" },
  { id: "st2", name: "Sithum Fernando", role: "Front Desk" },
  { id: "st3", name: "Amaya Silva", role: "Admin" },
];
