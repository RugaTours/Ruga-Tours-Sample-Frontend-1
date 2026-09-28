"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Fade } from "@/components/shared/fade";
import { Button } from "@/components/ui/button";
import { Hint, Input, Label, Select } from "@/components/ui/form";
import { COUNTRIES, CURRENCIES } from "@/lib/constants";
import { TOURIST } from "@/lib/mock";

export default function ProfilePage() {
  const [country, setCountry] = useState(TOURIST.country);
  const derived = COUNTRIES.find((c) => c.name === country)?.ccy ?? "USD";
  const [ccy, setCcy] = useState<string>(TOURIST.currency);
  const [lang, setLang] = useState(TOURIST.lang);

  return (
    <div className="max-w-2xl">
      <Fade>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Profile</h1>
        <p className="mt-0.5 text-xs text-slate-500">Your details, contact preferences and display currency.</p>
        <section className="mt-5 rounded-card border border-line bg-white p-6 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Full name</Label><Input defaultValue={TOURIST.name} /></div>
            <div><Label>Email</Label><Input defaultValue={TOURIST.email} /></div>
            <div>
              <Label>Country</Label>
              <Select value={country} onChange={(e) => { setCountry(e.target.value); setCcy(COUNTRIES.find((c) => c.name === e.target.value)?.ccy ?? "USD"); }}>
                {COUNTRIES.map((c) => <option key={c.name}>{c.name}</option>)}
              </Select>
            </div>
            <div>
              <Label>Display currency</Label>
              <Select value={ccy} onChange={(e) => setCcy(e.target.value)}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</Select>
              <Hint>Auto-derived from country — override anytime.</Hint>
            </div>
            <div>
              <Label>Preferred language</Label>
              <Select value={lang} onChange={(e) => setLang(e.target.value)}><option>English</option><option>German</option><option>French</option></Select>
            </div>
            <div><Label>Phone (for WhatsApp / iMessage)</Label><Input defaultValue={TOURIST.phone} /></div>
          </div>
          <div className="mt-5 rounded-card border border-line p-3.5">
            <label className="flex cursor-pointer items-center gap-2.5 text-[12.5px] font-medium">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-ruga-navy" />
              I consent to Ruga Tours featuring screenshots of my trip in the gallery (you can withdraw anytime)
            </label>
            <Hint>Gallery use only ever happens with this ticked and recorded against your account.</Hint>
          </div>
          <Button variant="primary" className="mt-5" onClick={() => toast.success("Profile saved (mock).")}>
            <Save className="h-4 w-4" /> Save changes
          </Button>
        </section>
      </Fade>
    </div>
  );
}
