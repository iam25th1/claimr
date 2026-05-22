"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useJobs } from "@/lib/useJobs";
import { StatePill } from "@/components/primitives/state-pill";
import { motion, AnimatePresence } from "motion/react";
import { motionDurations, motionEase } from "@/lib/motion";
import { Search, ChevronRight } from "lucide-react";

const STATUS_FILTERS: { key: "all" | "open" | "claimed" | "submitted" | "verified" | "rejected" | "cancelled"; label: string; statusIndex?: number }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open", statusIndex: 0 },
  { key: "claimed", label: "Claimed", statusIndex: 1 },
  { key: "submitted", label: "Under review", statusIndex: 2 },
  { key: "verified", label: "Paid", statusIndex: 3 },
  { key: "rejected", label: "Rejected", statusIndex: 4 },
  { key: "cancelled", label: "Cancelled", statusIndex: 5 },
];

export default function AdminJobsPage() {
  const { jobs, isLoading } = useJobs();
  const [filter, setFilter] = useState<typeof STATUS_FILTERS[number]["key"]>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let out = jobs;

    if (filter !== "all") {
      const f = STATUS_FILTERS.find((s) => s.key === filter);
      if (f?.statusIndex !== undefined) {
        out = out.filter((j) => j.status === f.statusIndex);
      }
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.criteria.toLowerCase().includes(q) ||
          j.project.toLowerCase().includes(q) ||
          j.creator.toLowerCase().includes(q) ||
          String(j.id) === q
      );
    }

    return [...out].sort((a, b) => b.id - a.id);
  }, [jobs, filter, query]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">All jobs</h1>
        <p className="mt-2 text-muted-foreground">
          Every job across every project on the contract
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, criteria, address, or job id"
          className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#FF2D7A]/50 focus:ring-2 focus:ring-[#FF2D7A]/20 transition-all"
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              filter === f.key
                ? "bg-[#FF2D7A] text-white"
                : "bg-white/5 text-muted-foreground hover:bg-white/10"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-12 text-center backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">
            No jobs match this filter.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground border-b border-white/5">
            <span className="col-span-1">ID</span>
            <span className="col-span-5">Job</span>
            <span className="col-span-2">Project</span>
            <span className="col-span-1 text-right">USDC</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-1" />
          </div>

          <AnimatePresence initial={false}>
            {filtered.map((job) => (
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
                  className="grid md:grid-cols-12 gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center"
                >
                  <span className="md:col-span-1 text-xs text-muted-foreground font-mono">
                    #{job.id}
                  </span>
                  <div className="md:col-span-5 min-w-0">
                    <p className="font-medium text-foreground truncate">{job.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">
                      {job.criteria}
                    </p>
                  </div>
                  <span className="md:col-span-2 text-xs font-mono text-muted-foreground">
                    {short(job.project)}
                  </span>
                  <span className="md:col-span-1 text-sm text-foreground md:text-right">
                    {job.amount}
                  </span>
                  <span className="md:col-span-2">
                    <StatePill state={job.status} size="sm" />
                  </span>
                  <span className="md:col-span-1 text-muted-foreground md:text-right">
                    <ChevronRight className="h-4 w-4 inline" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function short(addr: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
