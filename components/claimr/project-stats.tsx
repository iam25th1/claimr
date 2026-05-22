"use client";

import { useJobs } from "@/lib/useJobs";
import { Vault, Briefcase, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function ProjectStats() {
  const { user } = useAuth();
  const address = user?.walletAddress;
  const { jobs, isLoading } = useJobs();

  const myJobs = jobs.filter(
    (j) => j.project.toLowerCase() === address?.toLowerCase()
  );

  const escrowed = myJobs
    .filter((j) => j.status === 0 || j.status === 1 || j.status === 2)
    .reduce((sum, j) => sum + j.amount, 0);

  const activeCount = myJobs.filter(
    (j) => j.status === 0 || j.status === 1 || j.status === 2
  ).length;

  const completedCount = myJobs.filter((j) => j.status === 3).length;

  const stats = [
    {
      label: "Escrowed",
      value: isLoading ? "..." : escrowed.toString(),
      unit: "USDC",
      icon: Vault,
      color: "#2D6EFF",
      bgColor: "rgba(45, 110, 255, 0.1)",
    },
    {
      label: "Active Jobs",
      value: isLoading ? "..." : activeCount.toString(),
      unit: "",
      icon: Briefcase,
      color: "#FF2D7A",
      bgColor: "rgba(255, 45, 122, 0.1)",
    },
    {
      label: "Completed Jobs",
      value: isLoading ? "..." : completedCount.toString(),
      unit: "",
      icon: CheckCircle2,
      color: "#22C55E",
      bgColor: "rgba(34, 197, 94, 0.1)",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card rounded-xl p-5 transition-all hover:border-white/20"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {stat.value}
                <span className="ml-1 text-lg font-medium text-muted-foreground">
                  {stat.unit}
                </span>
              </p>
            </div>
            <div
              className="rounded-lg p-2.5"
              style={{ backgroundColor: stat.bgColor }}
            >
              <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}