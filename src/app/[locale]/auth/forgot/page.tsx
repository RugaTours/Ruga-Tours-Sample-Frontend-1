"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";

export default function ForgotPage() {
  const { locale } = useParams<{ locale: string }>();
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-card-lg border border-line bg-white p-8 text-center shadow-soft">
        {!sent ? (
          <>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">Reset your password</h1>
            <p className="mt-1 text-xs text-slate-500">We’ll email you a secure reset link.</p>
            <form className="mt-5 space-y-3.5 text-left" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div><Label>Email</Label><Input name="email" type="email" required placeholder="you@example.com" /></div>
              <Button variant="primary" className="w-full" type="submit">Send reset link</Button>
            </form>
          </>
        ) : (
          <>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-palm-light/20"><MailCheck className="h-7 w-7 text-palm-deep" /></span>
            <h1 className="mt-4 font-display text-xl font-extrabold">Check your inbox</h1>
            <p className="mt-1 text-xs text-slate-500">If an account exists, a reset link is on its way (mock — no email is really sent).</p>
          </>
        )}
        <p className="mt-5 text-xs"><Link href={`/${locale}/auth/login`} className="font-semibold text-ruga-royal hover:underline">Back to sign in</Link></p>
      </div>
    </div>
  );
}
