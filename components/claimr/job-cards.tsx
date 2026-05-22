"use client";

import { useJobs } from "@/lib/useJobs";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const STATUS_LABELS: Record<number, string> = {
  0: "Open",
  1: "In Progress",
  2: "Pending Review",
  3: "Completed",
  4: "Cancelled",
  5: "Failed",
};

const statusColors: Record<string, string> = {
  "Open": "text-blue-400",
  "In Progress": "text-yellow-400",
  "Pending Review": "text-orange-400",
  "Completed": "text-green-400",
  "Cancelled": "text-red-400",
  "Failed": "text-red-400",
};

function getInitials(address: string) {
  return address.slice(2, 4).toUpperCase();
}

export function ProjectJobCards() {
  const { user } = useAuth();
  const address = user?.walletAddress;
  const { jobs, isLoading } = useJobs();
  const router = useRouter();

  const myJobs = jobs
    .filter((j) => j.project.toLowerCase() === address?.toLowerCase())
    .slice(0, 3); // show latest 3 on overview

  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-muted-foreground">Loading jobs from chain...</p>
      </div>
    );
  }

  if (myJobs.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-muted-foreground">No jobs posted yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Active Jobs</h2>
        <button
          onClick={() => router.push("/project/jobs")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {myJobs.map((job) => {
          const statusLabel = STATUS_LABELS[job.status] ?? "Unknown";
          const initials = getInitials(job.project);

          return (
            <div
              key={job.id}
              className="glass-card rounded-xl p-5 transition-all hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#2D6EFF]/30 to-[#FF2D7A]/30 flex items-center justify-center text-sm font-bold text-foreground">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${statusColors[statusLabel]}`}>
                    {statusLabel}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#22C55E]">
                    {job.amount} <span className="text-sm font-medium">USDC</span>
                  </p>
                </div>
              </div>

              <h3 className="mt-4 text-base font-medium text-foreground leading-snug">
                {job.title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">{job.criteria}</p>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {job.creator === "0x0000000000000000000000000000000000000000"
                    ? "Unclaimed"
                    : `Creator: ${job.creator.slice(0, 6)}...${job.creator.slice(-4)}`}
                </p>
                <button
                  onClick={() => router.push("/project/jobs")}
                  className="rounded-lg bg-[#2D6EFF]/10 border border-[#2D6EFF]/30 px-3 py-1.5 text-sm font-medium text-[#2D6EFF] transition-all hover:bg-[#2D6EFF]/20"
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}