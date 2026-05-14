"use client"

import { useState } from "react"
import { Clock, CheckCircle, ArrowRight } from "lucide-react"

const jobs = [
  {
    id: 1,
    project: "ArcSwap Protocol",
    avatar: "AS",
    title: "Tweet about our Arc DEX launch",
    pay: 200,
    progress: "1 of 3 tweets submitted",
    progressPercent: 33,
    daysLeft: 5,
    status: "active",
  },
  {
    id: 2,
    project: "CircleFi",
    avatar: "CF",
    title: "Ambassador program post",
    pay: 300,
    progress: "Not started",
    progressPercent: 0,
    daysLeft: 10,
    status: "active",
  },
  {
    id: 3,
    project: "Neon Protocol",
    avatar: "NP",
    title: "Thread explaining cross-chain bridging",
    pay: 150,
    progress: "",
    progressPercent: 100,
    completedAgo: "2 days ago",
    status: "completed",
  },
]

const tabs = [
  { id: "active", label: "Active" },
  { id: "pending", label: "Pending Review" },
  { id: "completed", label: "Completed" },
]

export function MyJobsList() {
  const [activeTab, setActiveTab] = useState("active")

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === "active") return job.status === "active"
    if (activeTab === "completed") return job.status === "completed"
    return job.status === "pending"
  })

  return (
    <div>
      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[#FF2D7A] text-white"
                : "bg-white/5 text-muted-foreground hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Job Cards */}
      <div className="flex flex-col gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className={`glass-card rounded-xl p-5 transition-all ${
              job.status === "completed" ? "opacity-70" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold ${
                    job.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gradient-to-br from-[#FF2D7A]/20 to-[#2D6EFF]/20 text-white"
                  }`}
                >
                  {job.avatar}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{job.project}</p>
                  <h3 className="font-semibold text-foreground">{job.title}</h3>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-sm font-medium text-green-400">
                      {job.pay} USDC
                    </span>
                    {job.status === "completed" ? (
                      <span className="flex items-center gap-1 text-sm text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        Verified & Paid
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {job.progress}
                      </span>
                    )}
                  </div>
                  {job.status === "active" && (
                    <div className="mt-3 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF2D7A] to-[#2D6EFF]"
                        style={{ width: `${job.progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-4">
                {job.status === "completed" ? (
                  <span className="text-sm text-muted-foreground">
                    Completed {job.completedAgo}
                  </span>
                ) : (
                  <>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {job.daysLeft} days left
                    </span>
                    <button className="flex items-center gap-1 rounded-lg bg-[#FF2D7A] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#FF2D7A]/90">
                      {job.progressPercent > 0 ? "Continue" : "Start"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-muted-foreground">No jobs in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
