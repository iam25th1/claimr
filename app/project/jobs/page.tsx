"use client";

import { useState } from "react";
import { ProjectSidebar } from "@/components/claimr/project-sidebar";
import { Clock, Users, Eye } from "lucide-react";
import { useJobs } from "@/lib/useJobs";
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
  "Open": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "In Progress": "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  "Pending Review": "bg-orange-500/10 text-orange-400 border-orange-500/30",
  "Completed": "bg-green-500/10 text-green-400 border-green-500/30",
  "Cancelled": "bg-red-500/10 text-red-400 border-red-500/30",
  "Failed": "bg-red-500/10 text-red-400 border-red-500/30",
};

function getDaysLeft(deadline: number) {
  const diff = deadline * 1000 - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getProgress(status: number) {
  if (status === 0) return 0;
  if (status === 1) return 40;
  if (status === 2) return 100;
  if (status === 3) return 100;
  return 0;
}

export default function ActiveJobsPage() {
  const [filter, setFilter] = useState("All");
  const { user } = useAuth();
  const address = user?.walletAddress;
  const { jobs, isLoading } = useJobs();

  const filters = ["All", "Open", "In Progress", "Pending Review", "Completed"];

  const myJobs = jobs.filter(
    (j) => j.project.toLowerCase() === address?.toLowerCase()
  );

  const filteredJobs =
    filter === "All"
      ? myJobs
      : myJobs.filter((j) => STATUS_LABELS[j.status] === filter);

  return (
    <div className="flex min-h-screen bg-background">
      <ProjectSidebar />

      <main className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Active Jobs</h1>
            <p className="mt-2 text-muted-foreground">Track all jobs you've posted</p>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  filter === f
                    ? "bg-[#2D6EFF] text-white"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-12 text-center">
              <p className="text-muted-foreground">Loading jobs from chain...</p>
            </div>
          )}

          {!isLoading && (
            <div className="space-y-3">
              {filteredJobs.map((job) => {
                const statusLabel = STATUS_LABELS[job.status] ?? "Unknown";
                const daysLeft = getDaysLeft(job.deadline);
                const progress = getProgress(job.status);

                return (
                  <div
                    key={job.id}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-white/20"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{job.title}</h3>
                          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[statusLabel] ?? ""}`}>
                            {statusLabel}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-semibold text-green-400">{job.amount} USDC</span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {job.creator === "0x0000000000000000000000000000000000000000"
                              ? "Unclaimed"
                              : "1 creator"}
                          </span>
                          {daysLeft > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {daysLeft} days left
                            </span>
                          )}
                          {daysLeft === 0 && job.status === 0 && (
                            <span className="text-red-400">Expired</span>
                          )}
                        </div>

                        {progress > 0 && (
                          <div className="mt-3 max-w-md">
                            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                              <span>Progress</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  progress === 100 ? "bg-green-400" : "bg-[#2D6EFF]"
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <button className="flex items-center gap-2 rounded-lg border border-[#2D6EFF]/30 bg-[#2D6EFF]/10 px-4 py-2 text-sm font-medium text-[#2D6EFF] transition-all hover:bg-[#2D6EFF]/20">
                        <Eye className="h-4 w-4" />
                        View Submissions
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredJobs.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-12 text-center">
                  <p className="text-muted-foreground">
                    {address
                      ? "No jobs found. Post your first job to get started."
                      : "Connect your wallet to see your jobs."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}