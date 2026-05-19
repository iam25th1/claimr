"use client"

import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits } from "viem"
import { ArrowDownUp } from "lucide-react"
import { USDC_ADDRESS, EURC_ADDRESS, USDC_ABI, STARLIGHT_POOL_ADDRESS, POOL_ABI } from "@/lib/contracts"

export function SwapCard() {
  const { isConnected } = useAccount()
  const [fromToken, setFromToken] = useState<"USDC" | "EURC">("USDC")
  const [amount, setAmount] = useState("")
  const [step, setStep] = useState<"idle" | "approving" | "swapping" | "done">("idle")

  const toToken = fromToken === "USDC" ? "EURC" : "USDC"
  const tokenInAddress = fromToken === "USDC" ? USDC_ADDRESS : EURC_ADDRESS
  const estimatedOut = amount ? (Number(amount) * 0.918).toFixed(2) : "0.00"

  const { writeContract: approve, data: approveHash, error: approveError } = useWriteContract()
  const { writeContract: swap, data: swapHash, error: swapError } = useWriteContract()

  const { isLoading: isApproving, isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash })
  const { isLoading: isSwapping, isSuccess: swapSuccess } = useWaitForTransactionReceipt({ hash: swapHash })

  // After approve confirms, trigger swap
  useEffect(() => {
    if (approveSuccess && step === "approving") {
      setStep("swapping")
      swap({
        address: STARLIGHT_POOL_ADDRESS,
        abi: POOL_ABI,
        functionName: "swap",
        args: [tokenInAddress, parseUnits(amount || "0", 6)],
      })
    }
  }, [approveSuccess])

  useEffect(() => {
    if (swapSuccess) {
      setStep("done")
      setAmount("")
      setTimeout(() => setStep("idle"), 3000)
    }
  }, [swapSuccess])

  useEffect(() => {
    if (approveError || swapError) setStep("idle")
  }, [approveError, swapError])

  const handleSwap = () => {
    if (!isConnected || !amount || Number(amount) <= 0) return
    setStep("approving")
    approve({
      address: tokenInAddress,
      abi: USDC_ABI,
      functionName: "approve",
      args: [STARLIGHT_POOL_ADDRESS, parseUnits(amount, 6)],
    })
  }

  const getButtonLabel = () => {
    if (step === "approving" && isApproving) return "Approving..."
    if (step === "swapping" && isSwapping) return "Swapping..."
    if (step === "done") return "Swap Complete ✓"
    return `Swap ${fromToken} → ${toToken}`
  }

  const isLoading = step === "approving" || step === "swapping"

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <ArrowDownUp className="w-5 h-5 text-[#2D6EFF]" />
        <h3 className="text-lg font-semibold text-foreground">
          Convert {fromToken} ↔ {toToken}
        </h3>
      </div>

      {/* From */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-3">
        <p className="text-xs text-muted-foreground mb-2">From</p>
        <div className="flex items-center justify-between gap-4">
          <select
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value as "USDC" | "EURC")}
            className="bg-white/10 text-foreground rounded-lg px-3 py-2 text-sm font-medium border border-white/10 outline-none"
          >
            <option value="USDC">USDC</option>
            <option value="EURC">EURC</option>
          </select>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-transparent text-right text-2xl font-bold text-foreground outline-none w-full"
          />
        </div>
      </div>

      {/* Switch button */}
      <div className="flex justify-center my-2">
        <button
          onClick={() => setFromToken(toToken)}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
        >
          <ArrowDownUp className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* To */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-6">
        <p className="text-xs text-muted-foreground mb-2">To (estimated)</p>
        <div className="flex items-center justify-between gap-4">
          <span className="bg-white/10 text-foreground rounded-lg px-3 py-2 text-sm font-medium border border-white/10">
            {toToken}
          </span>
          <span className="text-right text-2xl font-bold text-muted-foreground">
            ≈ {estimatedOut} {toToken}
          </span>
        </div>
      </div>

      <button
        onClick={handleSwap}
        disabled={isLoading || !amount || step === "done"}
        className="w-full rounded-xl bg-gradient-to-r from-[#FF2D7A] to-[#2D6EFF] py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {getButtonLabel()}
      </button>

      {step === "approving" && !isApproving && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Step 1 of 2 — Approve {fromToken} spend in MetaMask
        </p>
      )}
      {step === "swapping" && !isSwapping && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Step 2 of 2 — Confirm swap in MetaMask
        </p>
      )}
    </div>
  )
}