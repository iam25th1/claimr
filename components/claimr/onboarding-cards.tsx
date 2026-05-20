"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function OnboardingCards() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") === "project" ? "project" : "creator";

  const { ready, authenticated, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If the user is already signed in, bounce straight to the right dashboard.
  useEffect(() => {
    if (ready && authenticated) {
      router.replace(role === "project" ? "/project" : "/dashboard/discover");
    }
  }, [ready, authenticated, role, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);
    try {
      await signUp(trimmed);
      router.replace(role === "project" ? "/project" : "/dashboard/discover");
    } catch (err: any) {
      setError(err?.message ?? "Could not complete signup");
      setSubmitting(false);
    }
  };

  const heading =
    role === "project" ? "Post jobs, pay on verification" : "Claim work, get paid instantly";
  const subheading =
    role === "project"
      ? "Lock USDC in escrow. We release it to creators only when AI verifies their work matches your brief."
      : "Browse open jobs, complete the work, submit your proof. AI verifies, USDC lands in your wallet.";

  return (
    <div className="mx-auto max-w-md px-6 pt-32 pb-24">
      <div className="text-center mb-10">
        <p className="text-sm font-medium text-[#FF2D7A]">
          {role === "project" ? "Project signup" : "Creator signup"}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">{heading}</h1>
        <p className="mt-3 text-[#a1a1aa]">{subheading}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#a1a1aa]" />
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={submitting}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-[#71717a] focus:border-[#FF2D7A]/50 focus:outline-none focus:ring-1 focus:ring-[#FF2D7A]/50 disabled:opacity-60"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !email.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF2D7A] py-3 font-medium text-white transition-all hover:bg-[#FF2D7A]/90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Setting up your wallet...
            </>
          ) : (
            <>
              Continue with email
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs text-[#a1a1aa]">
        <ShieldCheck className="h-4 w-4 shrink-0 text-[#2D6EFF] mt-0.5" />
        <p>
          A Circle wallet is created for you on Arc Testnet. On the next step you set a 6-digit PIN
          and pick recovery questions. You own the keys; Claimr never sees your PIN.
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-[#71717a]">
        Want to sign up as a {role === "project" ? "creator" : "project"} instead?{" "}
        <a
          href={`/onboarding?role=${role === "project" ? "creator" : "project"}`}
          className="text-[#FF2D7A] hover:underline"
        >
          Switch
        </a>
      </p>
    </div>
  );
}
