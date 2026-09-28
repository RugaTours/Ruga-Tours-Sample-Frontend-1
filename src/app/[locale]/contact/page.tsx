"use client";

import { useState } from "react";
import { Clock, Mail, MailCheck, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/form";

export default function ContactPage() {
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const email = (f.elements.namedItem("email") as HTMLInputElement).value;
    if (!/.+@.+\..+/.test(email)) { setErr("Enter a valid email address."); return; }
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Talk to a human</h1>
      <p className="mt-1 text-sm text-slate-500">No ticket bots — your message lands with our family team in Kandy.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-card-lg border border-line bg-white p-7 shadow-soft">
          {!sent ? (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Your name</Label><Input name="name" required placeholder="Jane Doe" /></div>
                <div><Label>Email</Label><Input name="email" type="email" required placeholder="you@example.com" /></div>
              </div>
              <div><Label>How can we help?</Label><Textarea name="msg" rows={5} required placeholder="Tell us about your trip idea, or ask us anything…" /></div>
              <FieldError msg={err} />
              <Button variant="primary" type="submit">Send message</Button>
              <p className="text-[11.5px] text-slate-400">Prototype note: this form doesn’t send a real email.</p>
            </form>
          ) : (
            <div className="py-8 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-palm-light/20"><MailCheck className="h-7 w-7 text-palm-deep" /></span>
              <h2 className="mt-4 font-display text-xl font-extrabold">Message received!</h2>
              <p className="mt-1 text-sm text-slate-500">We usually reply within a day — often much faster.</p>
            </div>
          )}
        </div>
        <aside className="h-fit space-y-3">
          {[
            { icon: MapPin, t: "Find us", d: "Ruga Tours, 15 George E de Silva Mawatha, Kandy 20000, Sri Lanka" },
            { icon: Mail, t: "Email", d: "hello@rugatours.lk — replies within 24h" },
            { icon: MessageCircle, t: "WhatsApp / iMessage", d: "+94 77 555 0101 — tap the chat bubble (bottom right)" },
            { icon: Phone, t: "Call", d: "+94 81 555 0101" },
            { icon: Clock, t: "Hours", d: "Every day, 8:00 – 22:00 Sri Lanka time (GMT+5:30)" },
          ].map((c) => (
            <div key={c.t} className="flex gap-3.5 rounded-card border border-line bg-white p-4 shadow-soft">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-card bg-ruga-navy/5"><c.icon className="h-4.5 w-4.5 h-5 w-5 text-ruga-navy" /></span>
              <div><p className="text-[13px] font-bold">{c.t}</p><p className="mt-0.5 text-[12.5px] text-slate-600">{c.d}</p></div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
