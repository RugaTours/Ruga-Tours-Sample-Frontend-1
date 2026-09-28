"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Pkg } from "@/lib/types";
import { dISO } from "@/lib/utils";

export interface WizardState {
  step: number;
  start: string;
  end: string;
  adults: number;
  children: number;
  infants: number;
  access: boolean;
  accessNotes: string;
  experiences: string[];
  mustVisit: string;
  star: 0 | 3 | 4 | 5;
  budgetPPMin: string;
  budgetPPMax: string;
  contactMethods: string[];
  phone: string;
  notes: string;
  ack: boolean;
  forkedFrom: string | null;
  set: (patch: Partial<WizardState>) => void;
  toggleExperience: (id: string) => void;
  toggleContact: (m: string) => void;
  reset: () => void;
  prefillFromPackage: (pkg: Pkg) => void;
}

const blank = {
  step: 0,
  start: dISO(40),
  end: dISO(49),
  adults: 2,
  children: 0,
  infants: 0,
  access: false,
  accessNotes: "",
  experiences: [] as string[],
  mustVisit: "",
  star: 0 as 0 | 3 | 4 | 5,
  budgetPPMin: "",
  budgetPPMax: "",
  contactMethods: ["email", "whatsapp"],
  phone: "+44 7700 900123",
  notes: "",
  ack: false,
  forkedFrom: null as string | null,
};

export const useWizard = create<WizardState>()(
  persist(
    (set, get) => ({
      ...blank,
      set: (patch) => set(patch),
      toggleExperience: (id) => {
        const cur = get().experiences;
        set({ experiences: cur.includes(id) ? cur.filter((e) => e !== id) : [...cur, id] });
      },
      toggleContact: (m) => {
        const cur = get().contactMethods;
        set({ contactMethods: cur.includes(m) ? cur.filter((c) => c !== m) : [...cur, m] });
      },
      reset: () => set({ ...blank }),
      prefillFromPackage: (pkg) =>
        set({
          ...blank,
          end: dISO(40 + pkg.days - 1),
          experiences: Array.from(new Set(pkg.itinerary.flatMap((d) => d.experiences))).slice(0, 4),
          star: 4,
          notes: `Customized from the “${pkg.name}” package.`,
          forkedFrom: pkg.id,
        }),
    }),
    { name: "ruga-wizard" }
  )
);
