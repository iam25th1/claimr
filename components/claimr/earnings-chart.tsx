"use client"

import { useState } from "react"

const monthlyData = [
  { month: "Dec", amount: 120 },
  { month: "Jan", amount: 280 },
  { month: "Feb", amount: 190 },
  { month: "Mar", amount: 450 },
  { month: "Apr", amount: 540 },
  { month: "May", amount: 700 },
]

const maxAmount = Math.max(...monthlyData.map((d) => d.amount))

export function EarningsChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-foreground">Monthly Earnings</h3>

      <div className="mt-6 flex items-end justify-between gap-4" style={{ height: "200px" }}>
        {monthlyData.map((data, index) => {
          const heightPercent = (data.amount / maxAmount) * 100
          const isHovered = hoveredIndex === index

          return (
            <div
              key={data.month}
              className="relative flex flex-1 flex-col items-center"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {isHovered && (
                <div className="absolute -top-8 rounded-lg bg-white/10 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  ${data.amount} USDC
                </div>
              )}

              <div
                className="w-full cursor-pointer rounded-t-lg transition-all duration-300"
                style={{
                  height: `${heightPercent}%`,
                  minHeight: "20px",
                  background: isHovered
                    ? "linear-gradient(180deg, #FF2D7A 0%, #FF2D7A80 100%)"
                    : "linear-gradient(180deg, #FF2D7A80 0%, #FF2D7A40 100%)",
                  boxShadow: isHovered ? "0 0 20px #FF2D7A40" : "none",
                }}
              />

              <span className="mt-3 text-xs text-muted-foreground">{data.month}</span>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-4">
        <span className="text-xs text-muted-foreground">$0</span>
        <span className="text-xs text-muted-foreground">${maxAmount} USDC</span>
      </div>
    </div>
  )
}
