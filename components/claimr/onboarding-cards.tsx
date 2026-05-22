"use client";

// Onboarding flow, rebuilt.
//
// Four (sometimes five) steps:
//   1. Role pick           shown only when ?role= is not in the URL
//   2. Email + sign up      calls signUp(), shows a verifying state while
//                          Circle handles OTP + wallet provisioning
//   3. Wallet ready         shows the new address + live USDC balance
//                          plus a "Fund wallet" CTA and continue button
//   4. Profile (optional)   name, X handle, bio, all skippable
//   5. Done                redirects to the right dashboard
//
// Design rules:
//   - Honest UI. Never display a "verified" or "connected" state we
//     haven't actually reached.
//   - Loading + empty + error states explicit on every async surface.
//   - Persistence via the profile store added in flow-fix.

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Briefcase,
  User,
  Copy,
  Check,
  ExternalLink,
  Twitter,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { useAuth } from "@/lib/auth";
import { USDC_ADDRESS, USDC_ABI } from "@/lib/contracts";
import { FundWalletModal } from "@/components/claimr/fund-wallet-modal";
import {
  readProjectProfile,
  readCreatorProfile,
  writeProjectProfile,
  writeCreatorProfile,
  normalizeXHandle,
} from "@/lib/profile-store";

type Role = "creator" | "project";
type Step = "role" | "email" | "verifying" | "wallet" | "profile";

const STEP_ORDER: Step[] = ["role", "email", "verifying", "wallet", "profile"];

export function OnboardingCards() {
  const router = useRouter();
  const params = useSearchParams();
  const { ready, authenticated, user, signUp } = useAuth();

  const urlRole = params.get("role");
  const initialRole: Role | null =
    urlRole === "project" ? "project" : urlRole === "creator" ? "creator" : null;

  const [role, setRole] = useState<Role | null>(initialRole);
  const [step, setStep] = useState<Step>(
    authenticated ? "wallet" : initialRole ? "email" : "role"
  );
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If the auth context catches up after mount and the user is already
  // signed in, fast-forward to the wallet step.
  useEffect(() => {
    if (!ready) return;
    if (authenticated && (step === "role" || step === "email")) {
      setStep("wallet");
    }
  }, [ready, authenticated, step]);

  // Once we have a wallet address and we're past email step, move forward.
  useEffect(() => {
    if (step === "verifying" && authenticated && user?.walletAddress) {
      setStep("wallet");
    }
  }, [step, authenticated, user?.walletAddress]);

  const handleRolePick = (picked: Role) => {
    setRole(picked);
    setStep("email");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    setError(null);
    setStep("verifying");
    try {
      await signUp(email.trim());
      // The verifying -> wallet transition is handled by the useEffect
      // above that watches user.walletAddress. signUp may resolve before
      // the address is populated.
    } catch (err: any) {
      setError(err?.message ?? "Could not complete signup.");
      setStep("email");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (!role) return;
    router.replace(role === "project" ? "/project" : "/dashboard/discover");
  };

  // Compute the visible-step list (drops "role" if URL provided one).
  const visibleSteps = useMemo(
    () => STEP_ORDER.filter((s) => (initialRole ? s !== "role" : true)),
    [initialRole]
  );
  const currentIndex = visibleSteps.indexOf(step);

  return (
    <div className="mx-auto max-w-xl px-6 pt-24 pb-24">
      <ProgressDots total={visibleSteps.length} current={currentIndex} />

      <div className="mt-10">
        {step === "role" && <RoleStep onPick={handleRolePick} />}

        {step === "email" && (
          <EmailStep
            role={role}
            email={email}
            setEmail={setEmail}
            submitting={submitting}
            error={error}
            onSubmit={handleEmailSubmit}
            onBack={initialRole ? undefined : () => setStep("role")}
          />
        )}

        {step === "verifying" && <VerifyingStep email={email} />}

        {step === "wallet" && role && (
          <WalletStep
            role={role}
            walletAddress={user?.walletAddress ?? null}
            onContinue={() => setStep("profile")}
          />
        )}

        {step === "profile" && role && user?.walletAddress && (
          <ProfileStep
            role={role}
            walletAddress={user.walletAddress}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Progress dots
// ----------------------------------------------------------------------

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current
              ? "w-6 bg-[#FF2D7A]"
              : i === current
              ? "w-8 bg-[#FF2D7A]"
              : "w-6 bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------
// Step 1, role pick
// ----------------------------------------------------------------------

function RoleStep({ onPick }: { onPick: (role: Role) => void }) {
  return (
    <div>
      <Heading
        eyebrow="Get started"
        title="How will you use Claimr?"
        subtitle="Pick one. You can switch later."
      />

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <RoleCard
          icon={User}
          title="I'm a creator"
          description="Claim work from open jobs, get paid in USDC."
          accent="#FF2D7A"
          onClick={() => onPick("creator")}
        />
        <RoleCard
          icon={Briefcase}
          title="I'm a project"
          description="Post jobs, lock funds, pay on verification."
          accent="#2D6EFF"
          onClick={() => onPick("project")}
        />
      </div>
    </div>
  );
}

function RoleCard({
  icon: Icon,
  title,
  description,
  accent,
  onClick,
}: {
  icon: any;
  title: string;
  description: string;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/[0.05]"
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ background: `${accent}15`, color: accent }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      <span
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100"
        style={{ color: accent }}
      >
        Continue
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}

// ----------------------------------------------------------------------
// Step 2, email
// ----------------------------------------------------------------------

function EmailStep({
  role,
  email,
  setEmail,
  submitting,
  error,
  onSubmit,
  onBack,
}: {
  role: Role | null;
  email: string;
  setEmail: (v: string) => void;
  submitting: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onBack?: () => void;
}) {
  return (
    <div>
      <Heading
        eyebrow={role === "project" ? "Project signup" : "Creator signup"}
        title={
          role === "project"
            ? "Post jobs and pay on verification"
            : "Claim work and get paid in USDC"
        }
        subtitle="Enter your email. We'll set up your wallet for you."
      />

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#2D6EFF]/20 bg-[#2D6EFF]/5 p-4">
        <ShieldCheck className="h-5 w-5 shrink-0 text-[#2D6EFF] mt-0.5" />
        <div className="text-xs text-foreground/85 leading-relaxed">
          We create a non-custodial Circle wallet for you when you sign up. No
          MetaMask, no seed phrase, no browser extension. You sign transactions
          with a PIN.
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={submitting}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:border-[#FF2D7A]/50 focus:outline-none focus:ring-2 focus:ring-[#FF2D7A]/30 disabled:opacity-60 transition-all"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={submitting || !email.trim()}
            className="flex items-center gap-2 rounded-xl bg-[#FF2D7A] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#FF2D7A]/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

// ----------------------------------------------------------------------
// Step 3, verifying
// ----------------------------------------------------------------------

function VerifyingStep({ email }: { email: string }) {
  // Rotate reassurance copy every couple of seconds so the spinner doesn't
  // feel static.
  const messages = [
    "Sending you a verification code...",
    "Creating your Circle wallet...",
    "Provisioning your address on Arc...",
    "Almost there, finalising...",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setIdx((n) => (n + 1) % messages.length), 2500);
    return () => clearInterval(i);
  }, [messages.length]);

  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FF2D7A]/10 ring-1 ring-[#FF2D7A]/30">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF2D7A]" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-foreground">
        Setting things up
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Check {email || "your inbox"} for the verification code from Circle.
      </p>

      <div className="mt-8 mx-auto max-w-sm rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
        <p className="text-xs text-foreground/80 transition-opacity duration-300">
          {messages[idx]}
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Step 4, wallet ready
// ----------------------------------------------------------------------

function WalletStep({
  role,
  walletAddress,
  onContinue,
}: {
  role: Role;
  walletAddress: string | null;
  onContinue: () => void;
}) {
  const [fundOpen, setFundOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Live USDC balance, refreshes via wagmi
  const { data: usdcRaw } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [walletAddress as `0x${string}`],
    query: {
      enabled: !!walletAddress,
      refetchInterval: 5000, // poll every 5s so funding lands visibly
    },
  });
  const balance = usdcRaw
    ? Number(formatUnits(usdcRaw as bigint, 6)).toFixed(2)
    : "0.00";
  const isFunded = parseFloat(balance) > 0;

  const handleCopy = async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (!walletAddress) {
    return (
      <div className="text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">
          Finalising your wallet...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/30">
          <Sparkles className="h-6 w-6 text-green-400" />
        </div>
      </div>

      <Heading
        align="center"
        title="Wallet ready"
        subtitle={
          role === "project"
            ? "Fund it with USDC so you can lock escrow on your first job."
            : "You'll receive payouts here when your work is verified."
        }
        compact
      />

      {/* Address + balance */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Your address
          </span>
          <a
            href={`https://testnet.arcscan.app/address/${walletAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#2D6EFF] hover:underline"
          >
            View on Arcscan
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="font-mono text-sm text-foreground break-all min-w-0">
            {walletAddress}
          </p>
          <button
            onClick={handleCopy}
            className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-white/10 transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-green-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">USDC balance</span>
          </div>
          <span
            className={`font-mono text-sm font-semibold ${
              isFunded ? "text-green-400" : "text-foreground"
            }`}
          >
            {balance}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => setFundOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#FF2D7A] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#FF2D7A]/90"
        >
          {isFunded ? "Add more USDC" : "Fund your wallet"}
        </button>
        <button
          onClick={onContinue}
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-foreground hover:bg-white/10 transition-colors"
        >
          {isFunded ? "Continue" : "Continue without funding"}
        </button>
        {!isFunded && (
          <p className="text-center text-xs text-muted-foreground">
            {role === "project"
              ? "You can fund later, but you'll need USDC to post jobs."
              : "You don't need funds to claim jobs. Payouts come automatically."}
          </p>
        )}
      </div>

      <FundWalletModal open={fundOpen} onClose={() => setFundOpen(false)} />
    </div>
  );
}

// ----------------------------------------------------------------------
// Step 5, profile
// ----------------------------------------------------------------------

function ProfileStep({
  role,
  walletAddress,
  onFinish,
}: {
  role: Role;
  walletAddress: string;
  onFinish: () => void;
}) {
  // Seed initial values from any existing profile (in case someone
  // re-enters onboarding).
  const [name, setName] = useState(
    () =>
      (role === "project"
        ? readProjectProfile(walletAddress).name
        : readCreatorProfile(walletAddress).displayName) || ""
  );
  const [xHandle, setXHandle] = useState(
    () =>
      (role === "project"
        ? readProjectProfile(walletAddress).xHandle
        : readCreatorProfile(walletAddress).xHandle) || ""
  );
  const [bio, setBio] = useState(
    () =>
      (role === "project"
        ? readProjectProfile(walletAddress).description
        : readCreatorProfile(walletAddress).bio) || ""
  );

  const handleSaveAndContinue = () => {
    const normalizedX = normalizeXHandle(xHandle);
    if (role === "project") {
      writeProjectProfile(walletAddress, {
        name: name.trim(),
        xHandle: normalizedX,
        description: bio.trim(),
      });
    } else {
      writeCreatorProfile(walletAddress, {
        displayName: name.trim(),
        xHandle: normalizedX,
        bio: bio.trim(),
      });
    }
    onFinish();
  };

  return (
    <div>
      <Heading
        eyebrow="Almost done"
        title={role === "project" ? "Tell creators about your project" : "Tell projects about you"}
        subtitle="All fields are optional. You can edit anytime in Settings."
      />

      <div className="mt-6 space-y-4">
        <Field label={role === "project" ? "Project name" : "Display name"}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={role === "project" ? "e.g. ArcSwap Protocol" : "e.g. Alex"}
            maxLength={60}
            className={inputStyle}
          />
        </Field>

        <Field
          label="X (Twitter)"
          icon={<Twitter className="h-3.5 w-3.5 text-muted-foreground" />}
          hint="OAuth connection coming soon. For now, enter your handle manually."
        >
          <input
            type="text"
            value={xHandle}
            onChange={(e) => setXHandle(e.target.value)}
            placeholder="@yourhandle"
            className={inputStyle}
          />
        </Field>

        <Field
          label={role === "project" ? "Short description" : "Bio"}
          hint="Shown to others on the platform."
        >
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder={
              role === "project"
                ? "What does your project do?"
                : "What kind of work do you do?"
            }
            className={`${inputStyle} resize-none`}
          />
        </Field>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={onFinish}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip for now
        </button>
        <button
          onClick={handleSaveAndContinue}
          className="flex items-center gap-2 rounded-xl bg-[#FF2D7A] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#FF2D7A]/90"
        >
          Save and continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Shared bits
// ----------------------------------------------------------------------

const inputStyle =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#FF2D7A]/50 focus:outline-none focus:ring-2 focus:ring-[#FF2D7A]/30 transition-all";

function Heading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  compact?: boolean;
}) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  return (
    <div className={`${alignClass} ${compact ? "mt-4" : ""}`}>
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-wider text-[#FF2D7A]">
          {eyebrow}
        </p>
      )}
      <h1
        className={`${
          eyebrow ? "mt-2" : ""
        } text-2xl font-bold text-foreground`}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  icon,
  hint,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        {icon}
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
