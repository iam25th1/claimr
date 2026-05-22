"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useJobs } from "@/lib/useJobs";
import { StatePill } from "@/components/primitives/state-pill";
import { CLAIMR_ESCROW_ADDRESS } from "@/lib/contracts";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Lock,
  Calendar,
  User,
  Building2,
  FileText,
  Clock,
} from "lucide-react";

interface VerificationEntry {
  jobId: number;
  verified: boolean;
  reasoning: string;
  txHash?: string;
  timestamp: number;
}

export default function AdminJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const jobId = parseInt(id, 10);
  const { jobs, isLoading } = useJobs();
  const [reasoning, setReasoning] = useState<VerificationEntry | null>(null);
  const [reasoningLoaded, setReasoningLoaded] = useState(false);

  const job = jobs.find((j) => j.id === jobId);

  useEffect(() => {
    if (Number.isNaN(jobId)) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/verify/log/${jobId}`, { cache: "no-store" });
        if (res.ok && !cancelled) {
          const data: VerificationEntry = await res.json();
          setReasoning(data);
        }
      } catch {
        // 404 is normal — no reasoning logged yet
      } finally {
        if (!cancelled) setReasoningLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  if (Number.isNaN(jobId)) {
    return <Error msg="Invalid job id" />;
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="h-8 w-32 rounded bg-white/5 animate-pulse" />
        <div className="h-40 rounded-2xl border border-white/10 bg-white/[0.03] animate-pulse" />
        <div className="h-32 rounded-2xl border border-white/10 bg-white/[0.03] animate-pulse" />
      </div>
    );
  }

  if (!job) {
    return <Error msg={`Job #${jobId} not found on the contract`} />;
  }

  const isUnclaimed =
    job.creator === "0x0000000000000000000000000000000000000000";
  const isPrivate = job.isPrivate;
  const deadlineDate = new Date(job.deadline * 1000);
  const daysLeft = Math.ceil(
    (job.deadline * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/admin/jobs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all jobs
      </Link>

      {/* Title + amount */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">#{job.id}</span>
              {isPrivate && (
                <span className="rounded-full bg-[#FF2D7A]/10 px-2 py-0.5 text-[10px] text-[#FF2D7A]">
                  Private
                </span>
              )}
            </div>
            <h1 className="mt-1 text-2xl font-bold text-foreground">{job.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{job.criteria}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-2xl font-bold text-foreground">
              {job.amount}{" "}
              <span className="text-base font-normal text-muted-foreground">USDC</span>
            </p>
            <StatePill state={job.status} />
          </div>
        </div>
      </div>

      {/* Metadata grid */}
      <div className="grid gap-3 md:grid-cols-2">
        <MetaRow
          icon={Building2}
          label="Project"
          value={
            <AddressDisplay address={job.project} />
          }
        />
        <MetaRow
          icon={User}
          label="Creator"
          value={
            isUnclaimed ? (
              <span className="text-muted-foreground">Unclaimed</span>
            ) : (
              <AddressDisplay address={job.creator} />
            )
          }
        />
        <MetaRow
          icon={Calendar}
          label="Deadline"
          value={
            <span>
              {deadlineDate.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              {daysLeft > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({daysLeft} day{daysLeft === 1 ? "" : "s"} left)
                </span>
              )}
              {daysLeft <= 0 && job.status === 0 && (
                <span className="ml-2 text-xs text-red-400">Expired</span>
              )}
            </span>
          }
        />
        <MetaRow
          icon={Lock}
          label="Escrow contract"
          value={
            <a
              href={`https://testnet.arcscan.app/address/${CLAIMR_ESCROW_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#2D6EFF] hover:underline"
            >
              {short(CLAIMR_ESCROW_ADDRESS)}
              <ExternalLink className="h-3 w-3" />
            </a>
          }
        />
      </div>

      {/* Submission */}
      {job.submissionData && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Submission
            </h2>
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap break-all">
            {job.submissionData}
          </p>
          {job.submissionData.startsWith("http") && (
            <a
              href={job.submissionData}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs text-[#2D6EFF] hover:underline"
            >
              Open in new tab
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </section>
      )}

      {/* Verification reasoning */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            AI verifier log
          </h2>
        </div>

        {!reasoningLoaded ? (
          <div className="h-16 rounded-lg bg-white/5 animate-pulse" />
        ) : !reasoning ? (
          <p className="text-sm text-muted-foreground">
            {job.status === 2
              ? "Submitted, awaiting AI verifier."
              : job.status === 0 || job.status === 1
              ? "Not yet submitted for verification."
              : "No reasoning logged. The Lambda may have cold-started since the decision (Phase B will persist this)."}
          </p>
        ) : (
          <div>
            <div className="flex items-center gap-2">
              {reasoning.verified ? (
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-[#FF2D7A]" />
              )}
              <span
                className={`text-sm font-semibold ${
                  reasoning.verified ? "text-green-400" : "text-[#FF2D7A]"
                }`}
              >
                {reasoning.verified ? "Approved" : "Rejected"}
              </span>
              <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {new Date(reasoning.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="mt-3 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {reasoning.reasoning}
            </p>
            {reasoning.txHash && (
              <a
                href={`https://testnet.arcscan.app/tx/${reasoning.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs text-[#2D6EFF] hover:underline"
              >
                View on-chain decision
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="text-sm text-foreground text-right">{value}</div>
    </div>
  );
}

function AddressDisplay({ address }: { address: string }) {
  return (
    <a
      href={`https://testnet.arcscan.app/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-mono text-foreground hover:text-[#2D6EFF] transition-colors"
    >
      {short(address)}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

function short(addr: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function Error({ msg }: { msg: string }) {
  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/admin/jobs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all jobs
      </Link>
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 backdrop-blur-sm">
        <p className="text-sm text-red-400">{msg}</p>
      </div>
    </div>
  );
}
