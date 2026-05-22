"use client";

import { useJobs } from "@/lib/useJobs";
import { useRouter } from "next/navigation";
import { Clock, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";

const STATUS_LABELS: Record<number, string> = {
  0: "Open",
  1: "In Progress",
  2: "Pending Review",
  3: "Completed",
  4: "Cancelled",
  5: "Failed",
};

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  "Open":           { color: "#60A5FA", bg: "rgba(96, 165, 250, 0.1)" },
  "In Progress":    { color: "#EAB308", bg: "rgba(234, 179, 8, 0.1)" },
  "Pending Review": { color: "#F97316", bg: "rgba(249, 115, 22, 0.1)" },
  "Completed":      { color: "#22C55E", bg: "rgba(34, 197, 94, 0.1)" },
  "Cancelled":      { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
  "Failed":         { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
};

function getProgress(status: number) {
  if (status === 0) return 0;
  if (status === 1) return 40;
  if (status === 2) return 100;
  if (status === 3) return 100;
  return 0;
}

function getDaysLeft(deadline: number) {
  return Math.max(0, Math.ceil((deadline * 1000 - Date.now()) / (1000 * 60 * 60 * 24)));
}

export function ProjectJobCards() {
  const { user } = useAuth();
  const address = user?.walletAddress;
  const { jobs, isLoading } = useJobs();
  const router = useRouter();

  const myJobs = jobs
    .filter((j) => j.project.toLowerCase() === address?.toLowerCase())
    .filter((j) => j.status !== 3 && j.status !== 4 && j.status !== 5)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-muted-foreground">Loading jobs from chain...</p>
      </div>
    );
  }

  if (myJobs.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-muted-foreground">No active jobs yet. Post your first job to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {myJobs.map((job) => {
        const statusLabel = STATUS_LABELS[job.status] ?? "Unknown";
        const style = STATUS_STYLES[statusLabel] ?? { color: "#fff", bg: "rgba(255,255,255,0.1)" };
        const progress = getProgress(job.status);
        const daysLeft = getDaysLeft(job.deadline);

        return (
          <div
            key={job.id}
            className="glass-card rounded-xl p-5 transition-all hover:border-white/20"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ backgroundColor: style.bg, color: style.color }}
                  >
                    {statusLabel}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-semibold text-[#22C55E]">{job.amount} USDC</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {job.creator === "0x0000000000000000000000000000000000000000"
                      ? "Unclaimed"
                      : "1 creator"}
                  </span>
                  {daysLeft > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {daysLeft} days left
                    </span>
                  )}
                  {daysLeft === 0 && <span className="text-red-400">Expired</span>}
                </div>

                {progress > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Criteria Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: progress === 100 ? "#22C55E" : "#2D6EFF",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => router.push("/project/jobs")}
                className="shrink-0 rounded-lg border border-[#2D6EFF] px-4 py-2 text-sm font-medium text-[#2D6EFF] transition-all hover:bg-[#2D6EFF]/10"
              >
                View Submissions
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}