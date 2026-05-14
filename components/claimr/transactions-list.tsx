"use client"

import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react"

const transactions = [
  {
    id: 1,
    type: "payment",
    title: "Job Payment",
    source: "ArcSwap Protocol",
    amount: "+200 USDC",
    time: "2 days ago",
    color: "#22c55e",
  },
  {
    id: 2,
    type: "swap",
    title: "Swap USDC → EURC",
    source: null,
    amount: "-100 USDC +91.80 EURC",
    time: "3 days ago",
    color: "#2D6EFF",
  },
  {
    id: 3,
    type: "payment",
    title: "Job Payment",
    source: "Neon Protocol",
    amount: "+500 USDC",
    time: "5 days ago",
    color: "#22c55e",
  },
]

export function TransactionsList() {
  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">Recent Transactions</h2>

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${tx.color}20` }}
              >
                {tx.type === "payment" ? (
                  <ArrowDownRight className="w-5 h-5" style={{ color: tx.color }} />
                ) : (
                  <RefreshCw className="w-5 h-5" style={{ color: tx.color }} />
                )}
              </div>
              <div>
                <p className="text-foreground font-medium">
                  {tx.title}
                  {tx.source && (
                    <span className="text-muted-foreground font-normal"> • {tx.source}</span>
                  )}
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
    </div>
  )
}
