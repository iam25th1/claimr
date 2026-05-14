"use client";

const jobs = [
  {
    id: 1,
    projectName: "ArcSwap",
    projectAvatar: "AS",
    title: "Tweet about our Arc DEX launch",
    pay: 200,
    criteria: "3 tweets • 50K impressions • 7 days",
    tags: ["KOL", "X Posts"],
  },
  {
    id: 2,
    projectName: "NeonDAO",
    projectAvatar: "ND",
    title: "Create a YouTube review of our governance token",
    pay: 500,
    criteria: "1 video • 10K views • 14 days",
    tags: ["YouTube", "Review"],
  },
  {
    id: 3,
    projectName: "ChainBridge",
    projectAvatar: "CB",
    title: "Thread explaining cross-chain bridging benefits",
    pay: 150,
    criteria: "1 thread • 25K impressions • 5 days",
    tags: ["KOL", "X Posts"],
  },
];

export function JobCards() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Discover Jobs</h2>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          View all
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="glass-card rounded-xl p-5 transition-all hover:border-white/20"
          >
            {/* Project Header */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#2D6EFF]/30 to-[#FF2D7A]/30 flex items-center justify-center text-sm font-bold text-foreground">
                {job.projectAvatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {job.projectName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#22C55E]">
                  {job.pay} <span className="text-sm font-medium">USDC</span>
                </p>
              </div>
            </div>

            {/* Job Title */}
            <h3 className="mt-4 text-base font-medium text-foreground leading-snug">
              {job.title}
            </h3>

            {/* Criteria */}
            <p className="mt-2 text-sm text-muted-foreground">{job.criteria}</p>

            {/* Tags & Action */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button className="rounded-lg bg-[#FF2D7A] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#FF2D7A]/90 hover:shadow-lg hover:shadow-[#FF2D7A]/25">
                Claim Job
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
