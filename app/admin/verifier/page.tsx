"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useJobs } from "@/lib/useJobs";
import { StatePill } from "@/components/primitives/state-pill";
import { motion, AnimatePresence } from "motion/react";
import { motionDurations, motionEase } from "@/lib/motion";
import {
  Bot,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Cpu,
  HardDrive,
} from "lucide-react";

interface VerificationEntry {
  jobId: number;
  verified: boolean;
  reasoning: string;
  txHash?: string;
  timestamp: number;
}

export default function AdminVerifierPage() {
  const { jobs } = useJobs();
  const [entries, setEntries] = useState<VerificationEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchEntries = async () => {
      try {
        const res = await fetch("/api/admin/activity", { cache: "no-store" });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setEntries(data.entries || []);
        }
      } catch {
        // best effort
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };
    fetchEntries();
    const i = setInterval(fetchEntries, 5000);
    return () => {
      cancelled = true;
      clearInterval(i);
    };
  }, []);

  const queue = jobs.filter((j) => j.status === 2);
  const recentDecisions = entries.slice(0, 10);
  const approvedCount = entries.filter((e) => e.verified).length;
  const rejectedCount = entries.filter((e) => !e.verified).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI verifier</h1>
        <p className="mt-2 text-muted-foreground">
          Live queue, recent decisions, configuration
        </p>
      </div>

      {/* Config panel */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
          Configuration
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <ConfigRow icon={Cpu} label="Model" value="Claude (per /api/verify)" />
          <ConfigRow icon={HardDrive} label="Reasoning store" value="In-memory Map · resets on cold start" />
          <ConfigRow icon={Bot} label="Surface" value="Server route at /api/verify" />
          <ConfigRow icon={Bot} label="Editable at runtime" value="No (Phase B)" />
        </div>
      </section>

      {/* Counters */}
      <section className="grid gap-4 md:grid-cols-3">
        <CounterCard
          label="In queue"
          value={queue.length}
          tone="yellow"
        />
        <CounterCard
          label="Approved (logged)"
          value={approvedCount}
          tone="green"
        />
        <CounterCard
          label="Rejected (logged)"
          value={rejectedCount}
          tone="pink"
        />
      </section>

      {/* Queue */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Currently reviewing
        </h2>
        {queue.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">Queue is empty.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {queue.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: motionDurations.base,
                    ease: motionEase.out,
                  }}
                >
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 backdrop-blur-sm hover:border-yellow-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          #{job.id} {job.title}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                          creator {short(job.creator)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm text-foreground">
                        {job.amount} USDC
                      </span>
                      <StatePill state={job.status} size="sm" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Recent decisions */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Recent decisions
        </h2>
        {!loaded ? (
          <div className="space-y-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse"
              />
            ))}
          </div>
        ) : recentDecisions.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">
              No verifier decisions logged yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentDecisions.map((entry) => (
              <Link
                key={`${entry.jobId}-${entry.timestamp}`}
                href={`/admin/jobs/${entry.jobId}`}
                className={`block rounded-xl border p-4 backdrop-blur-sm transition-colors ${
                  entry.verified
                    ? "border-green-400/20 bg-green-400/[0.03] hover:border-green-400/40"
                    : "border-[#FF2D7A]/20 bg-[#FF2D7A]/[0.03] hover:border-[#FF2D7A]/40"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {entry.verified ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-[#FF2D7A]" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      entry.verified ? "text-green-400" : "text-[#FF2D7A]"
                    }`}
                  >
                    {entry.verified ? "Approved" : "Rejected"} · #{entry.jobId}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">
                  {entry.reasoning}
                </p>
                {entry.txHash && (
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] text-[#2D6EFF]">
                    {short(entry.txHash)}
                    <ExternalLink className="h-2.5 w-2.5" />
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ConfigRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  );
}

function CounterCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "yellow" | "green" | "pink";
}) {
  const toneClasses = {
    yellow: "border-yellow-500/20 bg-yellow-500/5 text-yellow-400",
    green: "border-green-500/20 bg-green-500/5 text-green-400",
    pink: "border-[#FF2D7A]/20 bg-[#FF2D7A]/5 text-[#FF2D7A]",
  }[tone];

  return (
    <div className={`rounded-xl border p-5 backdrop-blur-sm ${toneClasses}`}>
      <p className="text-xs uppercase tracking-wider">{label}</p>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function short(s: string): string {
  if (!s) return "";
  return s.length > 12 ? `${s.slice(0, 6)}...${s.slice(-4)}` : s;
}
