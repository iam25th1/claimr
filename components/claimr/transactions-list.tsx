"use client"

import { useAccount } from "wagmi"
import { useJobs } from "@/lib/useJobs"
import { ArrowDownRight, RefreshCw } from "lucide-react"

export function TransactionsList() {
  const { address } = useAccount()
  const { jobs, isLoading } = useJobs()

  // Real job payments — completed jobs where this wallet is the creator
  const payments = jobs
    .filter(
      (j) =>
        j.status === 3 &&
        j.creator.toLowerCase() === address?.toLowerCase()
    )
    .map((j) => ({
      id: j.id,
      type: "payment",
      title: "Job Payment",
      source: `${j.project.slice(0, 6)}...${j.project.slice(-4)}`,
      amount: `+${(j.amount * 0.95).toFixed(2)} USDC`,
      time: new Date(j.deadline * 1000).toLocaleDateString("en-US", {
        month: "short", day: "numeric"
      }),
      color: "#22c55e",
    }))

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">Recent Transactions</h2>

      {isLoading && (
        <p className="text-center text-muted-foreground text-sm">Loading...</p>
      )}

      {!isLoading && payments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No transactions yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Completed jobs will appear here.
          </p>
        </div>
      )}

      {!isLoading && payments.length > 0 && (
        <div className="space-y-4">
          {payments.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${tx.color}20` }}
                >
                  <ArrowDownRight className="w-5 h-5" style={{ color: tx.color }} />
                </div>
                <div>
                  <p className="text-foreground font-medium">
                    {tx.title}
                    <span className="text-muted-foreground font-normal font-mono"> • {tx.source}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{tx.time}</p>
                </div>
              </div>
              <p className="font-semibold" style={{ color: tx.color }}>
                {tx.amount}
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground text-center">
        Swap history coming soon
      </p>
    </div>
  )
}