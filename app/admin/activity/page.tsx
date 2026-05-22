"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useJobs, type Job } from "@/lib/useJobs";
import { motion, AnimatePresence } from "motion/react";
import { motionDurations, motionEase } from "@/lib/motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Bot,
  ExternalLink,
  Briefcase,
} from "lucide-react";

interface VerificationEntry {
  jobId: number;
  verified: boolean;
  reasoning: string;
  txHash?: string;
  timestamp: number;
}

type FeedItem =
  | { kind: "verifier"; entry: VerificationEntry; job: Job | undefined }
  | { kind: "state"; job: Job };

export default function AdminActivityPage() {
  const { jobs } = useJobs();
  const [verifierEntries, setVerifierEntries] = useState<VerificationEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchEntries = async () => {
      try {
        const res = await fetch("/api/admin/activity", { cache: "no-store" });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setVerifierEntries(data.entries || []);
        }
      } catch {
        // best effort
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };
    fetchEntries();
    const i = setInterval(fetchEntries, 8000);
    return () => {
      cancelled = true;
      clearInterval(i);
    };
  }, []);

  // Build the feed. Verifier decisions have real timestamps. For non-verified
  // jobs we fall back to job.id as a recency proxy.
  const verifierIds = new Set(verifierEntries.map((e) => e.jobId));

  const verifierItems: FeedItem[] = verifierEntries.map((e) => ({
    kind: "verifier",
    entry: e,
    job: jobs.find((j) => j.id === e.jobId),
  }));

  const stateItems: FeedItem[] = jobs
    .filter((j) => !verifierIds.has(j.id))
    .sort((a, b) => b.id - a.id)
    .slice(0, 20)
    .map((j) => ({ kind: "state" as const, job: j }));

  // Merge, sort by recency (verifier timestamps win, then job ids high-first)
  const merged: FeedItem[] = [...verifierItems, ...stateItems].sort((a, b) => {
    const ta =
      a.kind === "verifier" ? a.entry.timestamp : (a.job.id * 1000) | 0;
    const tb =
      b.kind === "verifier" ? b.entry.timestamp : (b.job.id * 1000) | 0;
    return tb - ta;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activity feed</h1>
          <p className="mt-2 text-muted-foreground">
            AI verifier decisions and recent contract state changes.
            Auto-refreshes every 8s.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/5 px-3 py-1.5 text-xs text-green-400">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Live
        </div>
      </div>

      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 backdrop-blur-sm">
        <p className="text-xs text-yellow-400/90">
          Verifier reasoning is stored in-memory and resets on Lambda cold-start.
          Phase B will persist this to Vercel KV.
        </p>
      </div>

      {!loaded ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse"
            />
          ))}
        </div>
      ) : merged.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-12 text-center backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {merged.map((item) => (
              <motion.div
                key={
                  item.kind === "verifier"
                    ? `v-${item.entry.jobId}-${item.entry.timestamp}`
                    : `s-${item.job.id}`
                }
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: motionDurations.base,
                  ease: motionEase.out,
                }}
              >
                {item.kind === "verifier" ? (
                  <VerifierRow item={item} />
                ) : (
                  <StateRow job={item.job} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function VerifierRow({
  item,
}: {
  item: Extract<FeedItem, { kind: "verifier" }>;
}) {
  const { entry, job } = item;
  const IconCmp = entry.verified ? CheckCircle2 : XCircle;
  const tone = entry.verified ? "text-green-400" : "text-[#FF2D7A]";
  const ring = entry.verified
    ? "border-green-400/30 bg-green-400/5"
    : "border-[#FF2D7A]/30 bg-[#FF2D7A]/5";

  return (
    <Link
      href={`/admin/jobs/${entry.jobId}`}
      className={`block rounded-xl border ${ring} p-4 backdrop-blur-sm hover:border-white/30 transition-colors`}
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center pt-0.5">
          <Bot className="h-4 w-4 text-muted-foreground" />
          <div className="mt-2 h-full w-px bg-white/5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <IconCmp className={`h-4 w-4 ${tone}`} />
            <span className={`text-sm font-semibold ${tone}`}>
              {entry.verified ? "Approved" : "Rejected"}
            </span>
            <span className="text-sm text-foreground truncate">
              #{entry.jobId} {job?.title ?? "(job not on chain)"}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="h-3 w-3" />
              {timeAgo(entry.timestamp)}
            </span>
          </div>
          <p className="mt-2 text-xs text-foreground/80 leading-relaxed line-clamp-3">
            {entry.reasoning}
          </p>
          {entry.txHash && (
            <a
              href={`https://testnet.arcscan.app/tx/${entry.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-2 inline-flex items-center gap-1 text-[10px] text-[#2D6EFF] hover:underline"
            >
              {short(entry.txHash)}
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
        </div>
      </div>
    </Link>
  );
}

function StateRow({ job }: { job: Job }) {
  const statusLabel: Record<number, string> = {
    0: "Posted",
    1: "Claimed",
    2: "Submitted",
    3: "Verified + paid",
    4: "Rejected",
    5: "Cancelled",
  };

  return (
    <Link
      href={`/admin/jobs/${job.id}`}
      className="block rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm hover:border-white/20 transition-colors"
    >
      <div className="flex items-start gap-3">
        <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">
              {statusLabel[job.status] ?? "Unknown"}
            </span>
            <span className="text-sm text-foreground truncate">
              #{job.id} {job.title}
            </span>
            <span className="ml-auto text-xs text-foreground shrink-0">
              {job.amount} USDC
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground font-mono">
            project {short(job.project)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function short(s: string): string {
  if (!s) return "";
  return s.length > 12 ? `${s.slice(0, 6)}...${s.slice(-4)}` : s;
}
