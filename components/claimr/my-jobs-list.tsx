"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useJobs } from "@/lib/useJobs"
import { Clock, CheckCircle, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

const tabs = [
  { id: "active",    label: "Active" },
  { id: "pending",   label: "Pending Review" },
  { id: "completed", label: "Completed" },
]

function getDaysLeft(deadline: number) {
  return Math.max(0, Math.ceil((deadline * 1000 - Date.now()) / (1000 * 60 * 60 * 24)))
}

export function MyJobsList() {
  const [activeTab, setActiveTab] = useState("active")
  const { address } = useAccount()
  const { jobs, isLoading } = useJobs()
  const router = useRouter()

  // Jobs where this wallet is the creator
  const myJobs = jobs.filter(
    (j) => j.creator.toLowerCase() === address?.toLowerCase()
  )

  const filteredJobs = myJobs.filter((job) => {
    if (activeTab === "active")    return job.status === 1 // Claimed
    if (activeTab === "pending")   return job.status === 2 // Submitted
    if (activeTab === "completed") return job.status === 3 // Completed
    return false
  })

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-muted-foreground">Loading your jobs from chain...</p>
      </div>
    )
  }

  return (
    <div>
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

      <div className="flex flex-col gap-4">
        {filteredJobs.map((job) => {
          const daysLeft = getDaysLeft(job.deadline)
          const isCompleted = job.status === 3
          const earned = (job.amount * 0.95).toFixed(2)

          return (
            <div
              key={job.id}
              className={`glass-card rounded-xl p-5 transition-all ${
                isCompleted ? "opacity-70" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold ${
                      isCompleted
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gradient-to-br from-[#FF2D7A]/20 to-[#2D6EFF]/20 text-white"
                    }`}
                  >
                    {job.project.slice(2, 4).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground font-mono">
                      {job.project.slice(0, 6)}...{job.project.slice(-4)}
                    </p>
                    <h3 className="font-semibold text-foreground">{job.title}</h3>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-sm font-medium text-green-400">
                        {job.amount} USDC
                      </span>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-sm text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          Verified & Paid ({earned} USDC)
                        </span>
                      ) : job.status === 2 ? (
                        <span className="text-sm text-yellow-400">Work submitted — awaiting review</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">In progress</span>
                      )}
                    </div>

                    {job.status === 1 && (
                      <div className="mt-3 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#FF2D7A] to-[#2D6EFF]"
                          style={{ width: "40%" }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {isCompleted ? (
                    <span className="text-sm text-muted-foreground">Completed</span>
                  ) : (
                    <>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {daysLeft} days left
                      </span>
                      <button
                        onClick={() => router.push(`/dashboard/my-jobs/${job.id}`)}
                        className="flex items-center gap-1 rounded-lg bg-[#FF2D7A] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#FF2D7A]/90"
                      >
                        {job.status === 2 ? "View" : "Continue"}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {filteredJobs.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-muted-foreground">
              {activeTab === "active"
                ? "No active jobs. Head to Discover to claim one."
                : activeTab === "pending"
                ? "No jobs pending review."
                : "No completed jobs yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}