import { Clock, Diamond, Video, MessageSquare } from "lucide-react"

const featuredJobs = [
  {
    id: 1,
    project: "NeonDEX Protocol",
    avatar: "N",
    title: "Create YouTube review of governance token",
    pay: 500,
    criteria: "1 video",
    metric: "10K views",
    days: 14,
    tags: ["KOL", "Video"],
    icon: Video,
  },
  {
    id: 2,
    project: "ChainBridge",
    avatar: "C",
    title: "Write 5-part Twitter thread series",
    pay: 350,
    criteria: "5 threads",
    metric: "25K impressions",
    days: 10,
    tags: ["Writing", "X Posts"],
    icon: MessageSquare,
  },
]

export function FeaturedJobs() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Featured</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {featuredJobs.map((job) => (
          <div
            key={job.id}
            className="group relative overflow-hidden rounded-xl p-[1px] backdrop-blur-sm transition-all"
            style={{
              background: "linear-gradient(135deg, #FF2D7A, #2D6EFF)",
            }}
          >
            <div className="relative h-full rounded-xl bg-[#0a0a0a] p-5">
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-100/20 to-white/20 px-2 py-1 text-xs font-medium text-amber-100">
                <Diamond className="h-3 w-3 fill-amber-100/50" />
                Featured
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF2D7A]/20 to-[#2D6EFF]/20 text-lg font-bold text-white">
                  {job.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{job.project}</p>
                  <h3 className="mt-1 font-semibold text-foreground">{job.title}</h3>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <job.icon className="h-4 w-4" />
                      {job.criteria}
                    </span>
                    <span>{job.metric}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.days} days
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
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-green-400">{job.pay} USDC</span>
                      <button className="rounded-lg bg-[#FF2D7A] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#FF2D7A]/90">
                        Claim Job
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
