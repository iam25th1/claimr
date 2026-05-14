"use client"

import { CheckCircle } from "lucide-react"

const payments = [
  {
    id: 1,
    project: "ArcSwap Protocol",
    task: "Tweet campaign",
    amount: 200,
    date: "May 12",
    status: "Paid",
  },
  {
    id: 2,
    project: "Neon Protocol",
    task: "YouTube review",
    amount: 500,
    date: "May 7",
    status: "Paid",
  },
  {
    id: 3,
    project: "ChainBridge",
    task: "Thread series",
    amount: 150,
    date: "Apr 28",
    status: "Paid",
  },
  {
    id: 4,
    project: "CircleFi",
    task: "Ambassador post",
    amount: 300,
    date: "Apr 15",
    status: "Paid",
  },
  {
    id: 5,
    project: "ArcDAO",
    task: "Community update",
    amount: 90,
    date: "Apr 2",
    status: "Paid",
  },
]

export function PaymentHistory() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-foreground">Payment History</h3>

      <div className="mt-4 space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] p-4 transition-all hover:border-white/[0.08]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF2D7A]/20 to-[#2D6EFF]/20 text-sm font-bold text-white">
                {payment.project.charAt(0)}
              </div>

              <div>
                <p className="font-medium text-foreground">{payment.project}</p>
                <p className="text-sm text-muted-foreground">{payment.task}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-lg font-bold text-green-400">+{payment.amount} USDC</span>

              <span className="text-sm text-muted-foreground">{payment.date}</span>

              <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                <CheckCircle className="h-3 w-3" />
                {payment.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
