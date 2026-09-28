"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldError, Hint, Input, Label, Select } from "@/components/ui/form";
import { useAuth } from "@/stores/auth";

const COUNTRIES = ["United Kingdom", "Australia", "Germany", "France", "United States", "Canada", "Netherlands", "Switzerland", "India", "Sri Lanka", "Other"];

export default function RegisterPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const { setRole } = useAuth();
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const email = (f.elements.namedItem("email") as HTMLInputElement).value;
    const pass = (f.elements.namedItem("password") as HTMLInputElement).value;
    if (!/.+@.+\..+/.test(email)) { setErr("Enter a valid email address."); return; }
    if (pass.length < 8) { setErr("Password must be at least 8 characters."); return; }
    setRole("tourist");
    toast.success("Account created (mock) — welcome to the family, Emma!");
    router.push(`/${locale}/tailor-make`);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-card-lg border border-line bg-white p-8 shadow-soft">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Join Ruga Tours</h1>
        <p className="mt-1 text-xs text-slate-500">One account for your plans, payments and receipts — no booking fees to register.</p>
        <form onSubmit={submit} className="mt-5 space-y-3.5">
          <div><Label>Full name</Label><Input name="name" defaultValue="Emma Johnson" /></div>
          <div><Label>Email</Label><Input name="email" type="email" defaultValue="emma.johnson@gmail.com" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Country</Label>
              <Select name="country" defaultValue="United Kingdom">{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</Select>
              <Hint>Sets your display currency automatically — you can change it in your profile anytime.</Hint>
            </div>
            <div>
              <Label>Preferred language</Label>
              <Select name="lang" defaultValue="English"><option>English</option><option>German</option><option>French</option></Select>
            </div>
          </div>
          <div><Label>Password</Label><Input name="password" type="password" defaultValue="password123" /></div>
          <FieldError msg={err} />
          <Button variant="primary" className="w-full" type="submit"><UserPlus className="h-4 w-4" /> Create account</Button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-500">
          Already have an account? <Link href={`/${locale}/auth/login`} className="font-semibold text-ruga-royal hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
