"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { LogIn, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/form";
import { useAuth } from "@/stores/auth";

export default function LoginPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const { setRole } = useAuth();
  const [err, setErr] = useState("");

  const doLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const email = (f.elements.namedItem("email") as HTMLInputElement).value;
    if (!/.+@.+\..+/.test(email)) { setErr("Enter a valid email address."); return; }
    setRole("tourist");
    toast.success("Welcome back, Emma! Signed in as Tourist (mock).");
    router.push(`/${locale}/account/plans`);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-card-lg border border-line bg-white p-8 shadow-soft">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-xs text-slate-500">Sign in to see your planned trips, payments, and receipts.</p>
        <Button variant="outline" className="mt-5 w-full" onClick={() => { setRole("tourist"); toast.success("Signed in with Google (mock) as Emma Johnson."); router.push(`/${locale}/account/plans`); }}>
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.6Z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8H1.4v3.1A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.4a12 12 0 0 0 0 10.8l4-3.1Z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3 .8 3.7 1.4l2.8-2.7A12 12 0 0 0 1.4 6.6l4 3.1a7.2 7.2 0 0 1 6.6-4.9Z"/></svg>
          Continue with Google
        </Button>
        <div className="my-4 flex items-center gap-3 text-[11px] font-semibold text-slate-400"><span className="h-px flex-1 bg-line" /> or with email <span className="h-px flex-1 bg-line" /></div>
        <form onSubmit={doLogin} className="space-y-3.5">
          <div><Label>Email</Label><Input name="email" type="email" defaultValue="emma.johnson@gmail.com" /></div>
          <div><Label>Password</Label><Input name="password" type="password" defaultValue="password123" /></div>
          <FieldError msg={err} />
          <Button variant="primary" className="w-full" type="submit"><LogIn className="h-4 w-4" /> Sign in</Button>
        </form>
        <div className="mt-4 flex justify-between text-xs">
          <Link href={`/${locale}/auth/forgot`} className="font-semibold text-ruga-royal hover:underline">Forgot password?</Link>
          <Link href={`/${locale}/auth/register`} className="font-semibold text-ruga-royal hover:underline">Create account</Link>
        </div>
        <p className="mt-5 flex items-center justify-center gap-1.5 rounded-card bg-paper p-2.5 text-center text-[11px] text-slate-500">
          <Mail className="h-3.5 w-3.5" /> Prototype: any credentials work — you’ll be signed in as the demo tourist.
        </p>
      </div>
    </div>
  );
}
