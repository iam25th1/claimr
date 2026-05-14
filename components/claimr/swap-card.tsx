"use client"

import { ArrowDown, RefreshCw } from "lucide-react"
import { useState } from "react"

export function SwapCard() {
  const [fromToken, setFromToken] = useState("USDC")
  const [toToken, setToToken] = useState("EURC")
  const [amount, setAmount] = useState("100")

  const rate = 0.918
  const estimatedOutput = (parseFloat(amount || "0") * rate).toFixed(2)

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <RefreshCw className="w-5 h-5 text-[#2D6EFF]" />
        Convert USDC ↔ EURC
      </h2>

      <div className="space-y-4">
        {/* From Field */}
        <div className="bg-[#1a1a1a] rounded-xl p-4">
          <label className="text-xs text-muted-foreground mb-2 block">From</label>
          <div className="flex items-center gap-3">
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-[#2D6EFF]"
            >
              <option value="USDC">USDC</option>
              <option value="EURC">EURC</option>
            </select>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-transparent text-2xl font-semibold text-foreground text-right focus:outline-none"
            />
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center">
          <button className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center hover:bg-[#2a2a2a] transition-colors">
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* To Field */}
        <div className="bg-[#1a1a1a] rounded-xl p-4">
          <label className="text-xs text-muted-foreground mb-2 block">To (estimated)</label>
          <div className="flex items-center gap-3">
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-[#FF2D7A]"
            >
              <option value="EURC">EURC</option>
              <option value="USDC">USDC</option>
            </select>
            <p className="flex-1 text-2xl font-semibold text-muted-foreground text-right">
              ≈ {estimatedOutput} {toToken}
            </p>
          </div>
        </div>

        {/* Rate Info */}
        <p className="text-xs text-muted-foreground text-center">
          Rate: 1 USDC = 0.918 EURC • Powered by Circle StableFX
        </p>

        {/* Swap Button */}
        <button className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#FF2D7A] to-[#2D6EFF] hover:opacity-90 transition-opacity">
          Swap Now
        </button>
      </div>
    </div>
  )
}
