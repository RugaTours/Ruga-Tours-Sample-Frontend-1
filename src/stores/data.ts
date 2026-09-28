"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BankReceipt, BlogPost, Currency, GalleryPhoto, Notification, Payment, Plan } from "@/lib/types";
import { SEED_BLOGS, SEED_GALLERY, SEED_NOTIFICATIONS, SEED_PAYMENTS, SEED_PLANS, SEED_RECEIPTS } from "@/lib/mock";
import { TODAY, dF } from "@/lib/utils";

interface Seq { plan: number; pay: number; br: number; }
interface DataState {
  plans: Plan[];
  payments: Payment[];
  receipts: BankReceipt[];
  notifications: Notification[];
  gallery: GalleryPhoto[];
  blogs: BlogPost[];
  seq: Seq;
  // helpers
  getPlan: (ref: string) => Plan | undefined;
  paysOf: (ref: string) => Payment[];
  receiptsOf: (ref: string) => BankReceipt[];
  // actions
  notify: (forRole: "tourist" | "staff", title: string, body: string) => void;
  addPlan: (p: Plan) => void;
  setPlan: (ref: string, patch: Partial<Plan>) => void;
  claimPlan: (ref: string, staff: string) => boolean;
  toDiscussion: (ref: string) => void;
  declareAmounts: (ref: string, total: number, deposit: number, due: string, by: string) => void;
  payDeposit: (ref: string) => void;
  payFinalOnline: (ref: string) => void;
  chooseFinalBank: (ref: string) => void;
  uploadReceipt: (ref: string, fileName: string, by: string) => void;
  approveReceipt: (id: string, by: string) => void;
  rejectReceipt: (id: string, reason: string, by: string) => void;
  markRead: (role: "tourist" | "staff") => void;
  // gallery & blog admin
  addGalleryPhoto: (p: Omit<GalleryPhoto, "id" | "createdAt">) => void;
  deleteGalleryPhoto: (id: string) => void;
  addBlogPost: (p: Omit<BlogPost, "id" | "createdBy" | "updatedAt">, by: string) => void;
  updateBlogPost: (id: string, patch: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  reset: () => void;
}

const now = () => TODAY + " " + new Date().toTimeString().slice(0, 5);

export const useData = create<DataState>()(
  persist(
    (set, get) => {
      const pushNotif = (forRole: "tourist" | "staff", title: string, body: string) =>
        set((s) => ({
          notifications: [{ id: "n" + Date.now() + Math.random(), forRole, title, body, t: now(), read: false }, ...s.notifications].slice(0, 40),
        }));
      const patchPlan = (ref: string, patch: Partial<Plan>) =>
        set((s) => ({ plans: s.plans.map((p) => (p.ref === ref ? { ...p, ...patch } : p)) }));

      return {
        plans: SEED_PLANS,
        payments: SEED_PAYMENTS,
        receipts: SEED_RECEIPTS,
        notifications: SEED_NOTIFICATIONS,
        gallery: SEED_GALLERY,
        blogs: SEED_BLOGS,
        seq: { plan: 1007, pay: 5004, br: 8 },

        getPlan: (ref) => get().plans.find((p) => p.ref === ref),
        paysOf: (ref) => get().payments.filter((p) => p.planRef === ref),
        receiptsOf: (ref) => get().receipts.filter((r) => r.planRef === ref),

        notify: pushNotif,

        addPlan: (p) => {
          set((s) => ({ plans: [p, ...s.plans], seq: { ...s.seq, plan: s.seq.plan + 1 } }));
        },
        setPlan: patchPlan,

        claimPlan: (ref, staff) => {
          const p = get().getPlan(ref);
          if (!p || p.claimedBy) return false;
          patchPlan(ref, { claimedBy: staff, status: "under_review" });
          pushNotif("tourist", "A planner is reviewing your plan", `${ref}: ${staff} picked up your trip and will reach you shortly.`);
          return true;
        },

        toDiscussion: (ref) => {
          const p = get().getPlan(ref);
          patchPlan(ref, { status: "in_discussion" });
          if (p) pushNotif("tourist", "Your review is complete", `${ref}: fine-tuning continues via ${p.contact.methods.join(" + ")} with your planner.`);
        },

        declareAmounts: (ref, total, deposit, due, by) => {
          const p = get().getPlan(ref);
          if (!p) return;
          patchPlan(ref, {
            total, deposit, depositDue: due, declaredBy: by,
            status: "awaiting_tour_deposit",
            versions: p.versions.length < 2 ? [...p.versions, `Planner final version (agreed via ${p.contact.methods.join(" + ")})`] : p.versions,
          });
          pushNotif("tourist", "Your plan is confirmed — deposit time", `${ref}: total confirmed. Pay the Tour Booking Deposit of ${deposit} ${p.currency} by ${dF(due)} to start bookings.`);
        },

        payDeposit: (ref) => {
          const p = get().getPlan(ref);
          if (!p || !p.deposit) return;
          const payRef = `RCPT-${get().seq.pay}`;
          set((s) => ({
            payments: [...s.payments, { id: "pay" + Date.now(), ref: payRef, planRef: ref, type: "tour_deposit", method: "gateway", amount: p.deposit!, currency: p.currency, status: "succeeded", date: TODAY }],
            seq: { ...s.seq, pay: s.seq.pay + 1 },
          }));
          patchPlan(ref, { status: "awaiting_final_balance", amountsLocked: true });
          pushNotif("tourist", "Deposit received 🎉", `${ref}: Tour Booking Deposit confirmed (${payRef}). Your Final Balance is now payable — online or by bank transfer.`);
          pushNotif("staff", "Tour Booking Deposit paid", `${ref} (${p.tourist}) paid ${p.deposit} ${p.currency} — begin hotel & guide bookings.`);
        },

        payFinalOnline: (ref) => {
          const p = get().getPlan(ref);
          if (!p || !p.total || !p.deposit) return;
          const due = p.total - p.deposit;
          const payRef = `RCPT-${get().seq.pay}`;
          set((s) => ({
            payments: [...s.payments, { id: "pay" + Date.now(), ref: payRef, planRef: ref, type: "final_balance", method: "gateway", amount: due, currency: p.currency, status: "succeeded", date: TODAY }],
            seq: { ...s.seq, pay: s.seq.pay + 1 },
          }));
          patchPlan(ref, { status: "fully_paid", finalMethod: "online" });
          pushNotif("tourist", "You are fully booked! 🇱🇰", `${ref}: Final Balance confirmed (${payRef}). See you in Sri Lanka on ${dF(p.start)}.`);
        },

        chooseFinalBank: (ref) => {
          const p = get().getPlan(ref);
          patchPlan(ref, { finalMethod: "bank" });
          if (p) pushNotif("tourist", "Bank transfer selected", `${ref}: transfer ${(p.total ?? 0) - (p.deposit ?? 0)} ${p.currency}, then upload your receipt here so we can verify it.`);
        },

        uploadReceipt: (ref, fileName, by) => {
          const p = get().getPlan(ref);
          if (!p || !p.total || !p.deposit) return;
          const due = p.total - p.deposit;
          const prior = get().receipts.filter((r) => r.planRef === ref).length;
          const brRef = `BR-2026-${String(get().seq.br).padStart(4, "0")}`;
          const payRef = `RCPT-${get().seq.pay}`;
          const receipt: BankReceipt = {
            id: "br" + Date.now(), ref: brRef, planRef: ref, paymentRef: payRef, fileName,
            uploadedBy: by, status: "pending", version: prior + 1, createdAt: TODAY,
          };
          set((s) => ({
            receipts: [receipt, ...s.receipts],
            payments: [...s.payments, { id: "pay" + Date.now(), ref: payRef, planRef: ref, type: "final_balance", method: "bank_transfer", amount: due, currency: p.currency, status: "pending", date: TODAY, receiptId: receipt.id }],
            seq: { ...s.seq, pay: s.seq.pay + 1, br: s.seq.br + 1 },
          }));
          patchPlan(ref, { status: "bank_transfer_pending", finalMethod: "bank" });
          pushNotif("tourist", "Receipt received", `${ref}: receipt ${brRef} submitted — verification usually takes 1–2 business days.`);
          pushNotif("staff", "Bank receipt awaiting review", `${brRef} for ${ref} — ${due} ${p.currency} Final Balance (v${prior + 1}).`);
        },

        approveReceipt: (id, by) => {
          const r = get().receipts.find((x) => x.id === id);
          if (!r) return;
          set((s) => ({
            receipts: s.receipts.map((x) => (x.id === id ? { ...x, status: "approved" as const } : x)),
            payments: s.payments.map((pay) => (pay.ref === r.paymentRef ? { ...pay, status: "succeeded" as const } : pay)),
          }));
          const p = get().getPlan(r.planRef);
          if (p && !get().paysOf(r.planRef).some((pay) => pay.type === "final_balance" && pay.status === "succeeded")) {
            // handled above; now flip the plan
          }
          if (p) {
            patchPlan(r.planRef, { status: "fully_paid" });
            pushNotif("tourist", "Payment verified — fully booked! 🇱🇰", `${r.planRef}: your bank transfer was verified (${r.paymentRef}). See you on ${dF(p.start)}!`);
          }
        },

        rejectReceipt: (id, reason, by) => {
          const r = get().receipts.find((x) => x.id === id);
          if (!r) return;
          set((s) => ({
            receipts: s.receipts.map((x) => (x.id === id ? { ...x, status: "rejected" as const, rejectReason: reason } : x)),
          }));
          pushNotif("tourist", "Receipt needs attention", `${r.planRef}: your receipt ${r.ref} was rejected — ${reason}. Please re-submit a clearer copy.`);
        },

        markRead: (role) =>
          set((s) => ({ notifications: s.notifications.map((n) => (n.forRole === role ? { ...n, read: true } : n)) })),

        addGalleryPhoto: (p) =>
          set((s) => ({ gallery: [{ ...p, id: "g" + Date.now(), createdAt: TODAY }, ...s.gallery] })),
        deleteGalleryPhoto: (id) =>
          set((s) => ({ gallery: s.gallery.filter((g) => g.id !== id) })),

        addBlogPost: (p, by) =>
          set((s) => ({ blogs: [{ ...p, id: "b" + Date.now(), createdBy: by, updatedAt: TODAY }, ...s.blogs] })),
        updateBlogPost: (id, patch) =>
          set((s) => ({ blogs: s.blogs.map((b) => (b.id === id ? { ...b, ...patch, updatedAt: TODAY } : b)) })),
        deleteBlogPost: (id) =>
          set((s) => ({ blogs: s.blogs.filter((b) => b.id !== id) })),

        reset: () =>
          set({ plans: SEED_PLANS, payments: SEED_PAYMENTS, receipts: SEED_RECEIPTS, notifications: SEED_NOTIFICATIONS, gallery: SEED_GALLERY, blogs: SEED_BLOGS, seq: { plan: 1007, pay: 5004, br: 8 } }),
      };
    },
    { name: "ruga-data" }
  )
);

export const dollars = (n: number, c: Currency) => n; // readability helper (amounts are stored in plan currency)
