"use client";

import { useJobs } from "@/lib/useJobs";
import { AnimatedNumber } from "@/components/primitives/animated-number";
import { StatePill } from "@/components/primitives/state-pill";
import {
  Briefcase,
  Lock,
  TrendingUp,
  CheckCircle2,
  Users,
  Activity as ActivityIcon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { motionDurations, motionEase } from "@/lib/motion";

export default function AdminOverviewPage() {
  const { jobs, isLoading } = useJobs();

  // Global totals across all projects
  const totalLocked = jobs
    .filter((j) => j.status === 0 || j.status === 1 || j.status === 2)
    .reduce((sum, j) => sum + j.amount, 0);

  const pendingRelease = jobs
    .filter((j) => j.status === 2)
    .reduce((sum, j) => sum + j.amount, 0);

  const totalReleased = jobs
    .filter((j) => j.status === 3)
    .reduce((sum, j) => sum + j.amount, 0);

  const totalJobs = jobs.length;
  const openJobs = jobs.filter((j) => j.status === 0).length;
  const activeJobs = jobs.filter((j) => j.status === 1 || j.status === 2).length;
  const completedJobs = jobs.filter((j) => j.status === 3).length;

  // Distinct wallets that have interacted with the contract
  const distinctWallets = new Set<string>();
  jobs.forEach((j) => {
    distinctWallets.add(j.project.toLowerCase());
    if (j.creator !== "0x0000000000000000000000000000000000000000") {
      distinctWallets.add(j.creator.toLowerCase());
    }
  });

  // Current verifier queue (submitted, awaiting decision)
  const queue = jobs.filter((j) => j.status === 2);

  // Recent jobs across all states
  const recent = [...jobs].sort((a, b) => b.id - a.id).slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Platform Overview</h1>
          <p className="mt-2 text-muted-foreground">
            Live cross-project state from Arc Testnet
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/5 px-3 py-1.5 text-xs text-green-400">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Live on-chain
        </div>
      </div>

      {/* Money stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Lock}
          tone="blue"
          label="Currently Locked"
          value={totalLocked}
          unit="USDC"
        />
        <StatCard
          icon={TrendingUp}
          tone="yellow"
          label="Pending Release"
          value={pendingRelease}
          unit="USDC"
        />
        <StatCard
          icon={CheckCircle2}
          tone="green"
          label="Total Released"
          value={totalReleased}
          unit="USDC"
        />
      </div>

      {/* Count stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <CountCard icon={Briefcase} label="Total Jobs" value={totalJobs} />
        <CountCard icon={ActivityIcon} label="Open" value={openJobs} />
        <CountCard icon={ActivityIcon} label="In Flight" value={activeJobs} />
        <CountCard icon={Users} label="Wallets" value={distinctWallets.size} />
      </div>

      {/* Verifier queue */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Verifier queue
          </h2>
          <Link
            href="/admin/verifier"
            className="text-sm text-[#FF2D7A] hover:underline inline-flex items-center gap-1"
          >
            Verifier surface
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {queue.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">
              Nothing awaiting verification right now.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {queue.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: motionDurations.base, ease: motionEase.out }}
                >
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 backdrop-blur-sm hover:border-yellow-500/50 transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">
                        #{job.id} {job.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        Project {short(job.project)} · Creator {short(job.creator)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">
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

      {/* Recent jobs across platform */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent jobs</h2>
          <Link
            href="/admin/jobs"
            className="text-sm text-[#FF2D7A] hover:underline inline-flex items-center gap-1"
          >
            All jobs
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-14 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse"
              />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">No jobs on the contract yet.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden divide-y divide-white/5">
            {recent.map((job) => (
              <Link
                key={job.id}
                href={`/admin/jobs/${job.id}`}
                className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">
                    #{job.id} {job.title}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {short(job.project)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground">
                    {job.amount} USDC
                  </span>
                  <StatePill state={job.status} size="sm" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  tone,
  label,
  value,
  unit,
}: {
  icon: any;
  tone: "blue" | "yellow" | "green";
  label: string;
  value: number;
  unit: string;
}) {
  const toneClasses = {
    blue: "border-blue-500/20 bg-blue-500/5 text-blue-400",
    yellow: "border-yellow-500/20 bg-yellow-500/5 text-yellow-400",
    green: "border-green-500/20 bg-green-500/5 text-green-400",
  }[tone];

  return (
    <div className={`rounded-2xl border p-6 backdrop-blur-sm ${toneClasses}`}>
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-2 text-3xl font-bold text-foreground">
        <AnimatedNumber value={value} />{" "}
        <span className="text-base font-normal text-muted-foreground">{unit}</span>
      </p>
    </div>
  );
}

function CountCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">
        <AnimatedNumber value={value} />
      </p>
    </div>
  );
}

function short(addr: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
