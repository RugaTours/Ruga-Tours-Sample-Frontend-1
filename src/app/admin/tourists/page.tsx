"use client";

import { useState } from "react";
import { KeyRound, Save } from "lucide-react";
import { toast } from "sonner";
import { Fade } from "@/components/shared/fade";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { COUNTRIES } from "@/lib/constants";
import { useData } from "@/stores/data";

interface TouristRow { name: string; country: string; plans: number; lang: string; }

export default function TouristsPage() {
  const plans = useData((s) => s.plans);
  const tourists: TouristRow[] = Array.from(new Set(plans.map((p) => p.tourist))).map((name) => {
    const ps = plans.filter((p) => p.tourist === name);
    return { name, country: ps[0].country, plans: ps.length, lang: "English" };
  });

  const [edit, setEdit] = useState<TouristRow | null>(null);
  const [country, setCountry] = useState("");

  return (
    <div>
      <Fade>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Tourist Management</h1>
        <p className="mt-0.5 text-xs text-slate-500">Edit country &amp; language, nudge due dates, send password resets — destructive changes (deleting plans, editing submissions) always need recorded tourist consent.</p>
      </Fade>

      <div className="mt-5 overflow-hidden rounded-card border border-line bg-white shadow-soft">
        <table className="w-full min-w-[680px] text-left text-[12.5px]">
          <thead>
            <tr className="bg-paper text-[11px] font-bold uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Tourist</th><th className="px-4 py-3">Country</th><th className="px-4 py-3">Language</th><th className="px-4 py-3">Plans</th><th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {tourists.map((t) => (
              <tr key={t.name} className="hover:bg-ruga-sky/5">
                <td className="px-4 py-3 font-bold">{t.name}</td>
                <td className="px-4 py-3">{t.country}</td>
                <td className="px-4 py-3">{t.lang}</td>
                <td className="tnum px-4 py-3">{t.plans}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setEdit(t); setCountry(t.country); }}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => toast.success(`Password reset link sent to ${t.name} (mock).`)}>
                      <KeyRound className="h-3.5 w-3.5" /> Reset pwd
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={edit !== null} onClose={() => setEdit(null)} title={`Edit ${edit?.name}`} sub="Basic corrections — country & language preferences.">
        <div className="space-y-3">
          <div>
            <Label>Country</Label>
            <Select value={country} onChange={(e) => setCountry(e.target.value)}>
              {COUNTRIES.map((c) => <option key={c.name}>{c.name}</option>)}
            </Select>
          </div>
          <div>
            <Label>Language</Label>
            <Select defaultValue={edit?.lang}><option>English</option><option>German</option><option>French</option></Select>
          </div>
          <div>
            <Label>Adjust a due date (optional)</Label>
            <Input type="date" />
            <p className="mt-1 text-[11px] text-slate-400">Logged against your admin account in the audit trail (real build).</p>
          </div>
        </div>
        <Button variant="primary" className="mt-4 w-full" onClick={() => { toast.success(`Saved changes for ${edit?.name} (mock).`); setEdit(null); }}>
          <Save className="h-4 w-4" /> Save
        </Button>
      </Modal>
    </div>
  );
}
