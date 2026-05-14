import { Clock, Users } from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Tweet about our Arc DEX launch",
    status: "In Progress",
    statusColor: "#EAB308",
    statusBg: "rgba(234, 179, 8, 0.1)",
    pay: 200,
    applicants: 4,
    daysLeft: 5,
    progress: 65,
  },
  {
    id: 2,
    title: "Thread explaining cross-chain bridging",
    status: "Pending Review",
    statusColor: "#F97316",
    statusBg: "rgba(249, 115, 22, 0.1)",
    pay: 150,
    applicants: 2,
    daysLeft: 2,
    progress: 100,
  },
];

export function ProjectJobCards() {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="glass-card rounded-xl p-5 transition-all hover:border-white/20"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-semibold text-foreground">
                  {job.title}
                </h3>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: job.statusBg,
                    color: job.statusColor,
                  }}
                >
                  {job.status}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="font-semibold text-[#22C55E]">
                  {job.pay} USDC
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {job.applicants} applicants
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {job.daysLeft} days left
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Criteria Progress</span>
                  <span>{job.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${job.progress}%`,
                      backgroundColor:
                        job.progress === 100 ? "#22C55E" : "#2D6EFF",
                    }}
                  />
                </div>
              </div>
            </div>

            <button className="shrink-0 rounded-lg border border-[#2D6EFF] px-4 py-2 text-sm font-medium text-[#2D6EFF] transition-all hover:bg-[#2D6EFF]/10">
              View Submissions
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
