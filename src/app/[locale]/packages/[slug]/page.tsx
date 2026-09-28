"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle, ArrowLeft, CalendarDays, Check, MapPin, Pencil, Route, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Fade } from "@/components/shared/fade";
import { SriLankaMap } from "@/components/map/sri-lanka";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { EXPERIENCES, PACKAGES, TOURIST } from "@/lib/mock";
import { dISO, daysBetween, fmt, usdTo } from "@/lib/utils";
import { useAuth, useHydrated } from "@/stores/auth";
import { useData } from "@/stores/data";
import { useWizard } from "@/stores/wizard";
import type { Currency } from "@/lib/types";

export default function PackageDetailPage() {
  const { locale, slug } = useParams<{ locale: string; slug: string }>();
  const router = useRouter();
  const pkg = PACKAGES.find((p) => p.slug === slug);
  const { role } = useAuth();
  const hydrated = useHydrated();
  const { addPlan, notify } = useData();
  const seq = useData((s) => s.seq.plan);
  const { prefillFromPackage, reset } = useWizard();

  const [asisOpen, setAsisOpen] = useState(false);
  const [customWarn, setCustomWarn] = useState(false);
  const [arrival, setArrival] = useState(dISO(45));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [err, setErr] = useState("");

  if (!pkg) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-slate-500">Package not found.</p>
        <Link href={`/${locale}/packages`}><Button variant="outline" className="mt-4">Back to Packages</Button></Link>
      </div>
    );
  }

  const ccy: Currency = hydrated && role === "tourist" ? TOURIST.currency : "USD";
  const expName = (id: string) => EXPERIENCES.find((e) => e.id === id)?.name ?? id;
  const stops = pkg.itinerary.map((d) => ({ city: `Day ${d.day} — ${d.place}`, x: d.x, y: d.y }));
  const endAuto = (() => { const d = new Date(arrival + "T00:00:00"); d.setDate(d.getDate() + pkg.days - 1); return d.toISOString().slice(0, 10); })();
  const pax = adults + children + infants;
  const estTotal = usdTo(pkg.pricePP, ccy) * pax;

  const submitAsIs = () => {
    if (!arrival || arrival <= "2026-09-23") { setErr("Pick a future arrival date."); return; }
    if (adults < 1) { setErr("At least one adult is required."); return; }
    if (role !== "tourist") {
      toast.error("Please sign in as a Tourist first (use the role switcher in the header).");
      return;
    }
    setErr("");
    const ref = `RGT-2026-${seq}`;
    addPlan({
      id: "p" + Date.now(), ref, owner: true, type: "package_asis", packageId: pkg.id, pkgName: pkg.name,
      tourist: TOURIST.name, country: TOURIST.country, currency: TOURIST.currency, start: arrival, end: endAuto,
      pax: { adults, children, infants }, star: 4, experiences: [], places: [], mustVisit: "",
      budgetPPMin: Math.round(usdTo(pkg.pricePP, TOURIST.currency)), budgetPPMax: Math.round(usdTo(pkg.pricePP, TOURIST.currency)),
      contact: { methods: TOURIST.contactMethods, phone: TOURIST.phone }, notes: "",
      status: "submitted", claimedBy: null, total: null, deposit: null, depositDue: null, finalDue: null,
      amountsLocked: false, finalMethod: null, createdAt: "2026-09-23",
      versions: [`Package booked as-is (${pkg.days} Days · ${pkg.nights} Nights)`],
    });
    notify("staff", "New package booking", `${ref} (${pkg.name}, as-is) — ${TOURIST.name}, ${pax} pax, arrival ${arrival}. Contact & declare deposit.`);
    setAsisOpen(false);
    toast.success(`${ref} booked — no Review Fee on as-is packages. Our team will contact you to confirm and declare your Tour Booking Deposit.`);
    router.push(`/${locale}/account/plans`);
  };

  const confirmCustomize = () => {
    if (role !== "tourist") {
      toast.error("Please sign in as a Tourist first (use the role switcher in the header).");
      return;
    }
    reset(); prefillFromPackage(pkg);
    setCustomWarn(false);
    toast.info(`“${pkg.name}” forked into the Tailor-Make planner — adjust anything, then submit for human review.`);
    router.push(`/${locale}/tailor-make`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link href={`/${locale}/packages`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> All Packages
      </Link>

      {/* ---------- header + route map ---------- */}
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
        <Fade>
          <Badge className="bg-palm-light/25 text-palm-deep capitalize">{pkg.collection.replace("_", " ")}</Badge>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-5xl">{pkg.name}</h1>
          <p className="mt-2 inline-flex items-center gap-2 rounded-chip bg-ruga-navy px-4 py-1.5 font-display text-sm font-bold text-white">
            <CalendarDays className="h-4 w-4" /> {pkg.days} Days · {pkg.nights} Nights
          </p>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-slate-600">{pkg.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button variant="palm" size="lg" onClick={() => setAsisOpen(true)}>
              Book as-is · <span className="tnum">{fmt(usdTo(pkg.pricePP, ccy), ccy)}/person</span>
            </Button>
            <Button variant="outline" size="lg" onClick={() => setCustomWarn(true)}>
              <Pencil className="h-4 w-4" /> Customize this trip
            </Button>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-palm-deep">
              <Check className="h-4 w-4" /> No Review Fee on as-is bookings
            </span>
          </div>
        </Fade>

        <Fade delay={0.1}>
          <aside className="h-fit rounded-card border border-line bg-white p-5 shadow-soft lg:sticky lg:top-24">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold">
              <Route className="h-4 w-4 text-palm-deep" /> Your route, day by day
            </h3>
            <SriLankaMap stops={stops} route className="mx-auto mt-2 max-w-[230px]" />
          </aside>
        </Fade>
      </div>

      {/* ---------- day-by-day scroll journey ---------- */}
      <div className="mt-16">
        <Fade><h2 className="font-display text-2xl font-extrabold tracking-tight">The journey, one day at a time</h2></Fade>
        <div className="relative mt-8">
          <div className="absolute bottom-0 left-[19px] top-0 w-0.5 bg-line md:left-1/2" />
          {pkg.itinerary.map((d, i) => (
            <Fade key={d.day} delay={0.04}>
              <div className={`relative mb-10 flex flex-col gap-4 md:w-1/2 ${i % 2 === 0 ? "md:pr-12" : "md:ml-auto md:pl-12"}`}>
                <div className={`absolute top-5 hidden h-4 w-4 rounded-full border-4 border-palm-deep bg-white md:block ${i % 2 === 0 ? "-right-2" : "-left-2"}`} />
                <div className="overflow-hidden rounded-card border border-line bg-white shadow-soft transition hover:shadow-lift">
                  <div className={`flex h-24 items-center justify-between bg-gradient-to-r px-5 ${i % 2 === 0 ? "from-ruga-navy to-ruga-royal" : "from-palm-deep to-ruga-sky"}`}>
                    <span className="font-display text-3xl font-extrabold text-white/90">Day {d.day}</span>
                    <span className="flex items-center gap-1.5 rounded-chip bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      <MapPin className="h-3 w-3" /> {d.place}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-[16px] font-bold">{d.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{d.description}</p>
                    {d.experiences.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {d.experiences.map((e) => (
                          <span key={e} className="rounded-chip bg-palm-light/20 px-2.5 py-1 text-[11px] font-semibold text-palm-deep">
                            <Sparkles className="mr-1 inline h-3 w-3" />{expName(e)}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="mt-3 rounded-[10px] bg-ruga-sky/10 px-3 py-2 text-[11.5px] font-semibold text-ruga-navy">
                      ★ Specialty: {d.specialty}
                    </p>
                  </div>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>

      {/* ---------- Book as-is modal ---------- */}
      <Modal open={asisOpen} onClose={() => setAsisOpen(false)} title={`Book “${pkg.name}” as-is`} sub={`${pkg.days} Days · ${pkg.nights} Nights · fixed itinerary · no Review Fee`}>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label>Arrival date</Label>
            <Input type="date" value={arrival} min={dISO(1)} onChange={(e) => setArrival(e.target.value)} />
            <p className="mt-1 text-[11.5px] text-slate-500">Departure auto-calculated: <b>{endAuto}</b> ({daysBetween(arrival, endAuto)} nights)</p>
          </div>
          {([["Adults", adults, setAdults], ["Children (2–12)", children, setChildren], ["Infants (<2)", infants, setInfants]] as const).map(([l, v, set]) => (
            <div key={l}>
              <Label>{l}</Label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon" onClick={() => set(Math.max(l === "Adults" ? 1 : 0, v - 1))}>−</Button>
                <span className="tnum w-8 text-center font-bold">{v}</span>
                <Button type="button" variant="outline" size="icon" onClick={() => set(v + 1)}>+</Button>
              </div>
            </div>
          ))}
        </div>
        <FieldError msg={err} />
        <div className="mt-4 rounded-card bg-paper p-4 text-[13px]">
          <div className="flex justify-between"><span>Indicative total ({pax} × {fmt(usdTo(pkg.pricePP, ccy), ccy)})</span><b className="tnum">{fmt(estTotal, ccy)}</b></div>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-500">
            After submission our team contacts you to confirm details, then declares your <b>Tour Booking Deposit</b> in the system — you pay it right here online.
          </p>
        </div>
        {hydrated && role !== "tourist" && (
          <p className="mt-3 flex items-start gap-2 rounded-card bg-amber-50 p-3 text-xs text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> You’re browsing as {role === "guest" ? "a guest" : "Super Admin"} — switch to the <b>Tourist</b> role (header) to book.
          </p>
        )}
        <Button variant="palm" size="lg" className="mt-4 w-full" onClick={submitAsIs}>
          Confirm booking — free to submit
        </Button>
      </Modal>

      {/* ---------- Customize warning modal ---------- */}
      <Modal open={customWarn} onClose={() => setCustomWarn(false)} title="Customize this package?" sub="This creates your own tailor-made version">
        <div className="flex gap-3 rounded-card border border-amber-200 bg-amber-50 p-4 text-[13px] leading-relaxed text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <b>Heads-up:</b> customizing forks <b>“{pkg.name}”</b> into a personalized plan. The package price no longer applies —
            <b> your final budget may change</b> and is agreed with a human planner. A <b>Review Fee</b> applies to customized plans (currently waived during launch).
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setCustomWarn(false)}>Cancel</Button>
          <Button variant="primary" onClick={confirmCustomize}><Pencil className="h-4 w-4" /> Start customizing</Button>
        </div>
      </Modal>
    </div>
  );
}
