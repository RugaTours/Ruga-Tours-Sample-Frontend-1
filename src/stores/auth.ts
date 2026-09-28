"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import type { Role } from "@/lib/types";
import { TOURIST } from "@/lib/mock";
import { STAFF } from "@/lib/constants";

interface AuthState {
  role: Role;
  touristName: string;
  currentStaff: string;
  setRole: (r: Role) => void;
  setStaff: (name: string) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      role: "guest",
      touristName: TOURIST.name,
      currentStaff: STAFF[0].name,
      setRole: (role) => set({ role }),
      setStaff: (currentStaff) => set({ currentStaff }),
    }),
    { name: "ruga-auth" }
  )
);

/** Guard components against SSR/CSR hydration mismatch when reading persisted stores. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
