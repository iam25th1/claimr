import { Clock } from "lucide-react"

const latestJobs = [
  {
    id: 1,
    project: "ArcSwap",
    avatar: "A",
    title: "Tweet about DEX launch",
    pay: 200,
    criteria: "3 tweets • 50K impressions",
    days: 7,
    tags: ["KOL", "X Posts"],
    color: "#FF2D7A",
  },
  {
    id: 2,
    project: "Neon Protocol",
    avatar: "N",
    title: "Thread on bridging",
    pay: 150,
    criteria: "1 thread • 10K impressions",
    days: 5,
    tags: ["Writing", "X Posts"],
    color: "#2D6EFF",
  },
  {
    id: 3,
    project: "CircleFi",
    avatar: "C",
    title: "Ambassador program post",
    pay: 300,
    criteria: "1 post • 15K reach",
    days: 10,
    tags: ["KOL", "Writing"],
    color: "#10B981",
  },
  {
    id: 4,
    project: "ArcDAO",
    avatar: "A",
    title: "Community update tweet",
    pay: 100,
    criteria: "2 tweets • 5K impressions",
    days: 3,
    tags: ["Writing", "X Posts"],
    color: "#8B5CF6",
  },
]

export function LatestJobs() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Latest Jobs</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {latestJobs.map((job) => (
          <div
            key={job.id}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-white/20"
          >
            <div className="flex items-start gap-4">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-base font-bold text-white"
                style={{ backgroundColor: `${job.color}20`, color: job.color }}
              >
                {job.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{job.project}</p>
                  <span className="text-base font-bold text-green-400">{job.pay} USDC</span>
                </div>
                <h3 className="mt-1 font-medium text-foreground">{job.title}</h3>

                <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{job.criteria}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {job.days}d left
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/5 px-2 py-1 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="rounded-lg bg-[#FF2D7A] px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-[#FF2D7A]/90">
                    Claim Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
