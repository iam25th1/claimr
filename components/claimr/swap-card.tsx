"use client";

import { useState } from "react";
import { parseUnits, formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { ArrowDownUp, AlertCircle, Info } from "lucide-react";
import {
  USDC_ADDRESS,
  EURC_ADDRESS,
  USDC_ABI,
  STARLIGHT_POOL_ADDRESS,
} from "@/lib/contracts";
import { useAuth } from "@/lib/auth";
import { useCircleWrite } from "@/lib/useCircleWrite";

const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000" as const;

export function SwapCard() {
  const { authenticated, user } = useAuth();
  const address = (user?.walletAddress ?? ZERO_ADDRESS) as `0x${string}`;

  const [fromToken, setFromToken] = useState<"USDC" | "EURC">("USDC");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<
    "idle" | "approving" | "swapping" | "done"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [received, setReceived] = useState<number | null>(null);

  const toToken = fromToken === "USDC" ? "EURC" : "USDC";
  const tokenInAddress = fromToken === "USDC" ? USDC_ADDRESS : EURC_ADDRESS;
  const tokenOutAddress = fromToken === "USDC" ? EURC_ADDRESS : USDC_ADDRESS;

  // Read both balances so we can compute the actual received amount after
  // the swap by diffing the destination balance before vs after.
  const { data: tokenOutRaw, refetch: refetchOut } = useReadContract({
    address: tokenOutAddress,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [address],
    query: { enabled: address !== ZERO_ADDRESS },
  });

  const { execute } = useCircleWrite();

  const handleSwap = async () => {
    if (!authenticated || !amount || Number(amount) <= 0) return;
    setErrorMsg(null);
    setReceived(null);

    const amountWei = parseUnits(amount, 6);
    const balanceBefore = tokenOutRaw ? (tokenOutRaw as bigint) : BigInt(0);

    try {
      setStep("approving");
      await execute({
        contractAddress: tokenInAddress,
        abiFunctionSignature: "approve(address,uint256)",
        abiParameters: [STARLIGHT_POOL_ADDRESS, amountWei.toString()],
      });

      setStep("swapping");
      await execute({
        contractAddress: STARLIGHT_POOL_ADDRESS,
        abiFunctionSignature: "swap(address,uint256)",
        abiParameters: [tokenInAddress, amountWei.toString()],
      });

      // Re-read the destination balance to see what actually landed.
      // Brief delay so the indexer can catch up.
      await new Promise((r) => setTimeout(r, 1500));
      const fresh = await refetchOut();
      const balanceAfter = (fresh.data as bigint | undefined) ?? balanceBefore;
      const delta = Number(formatUnits(balanceAfter - balanceBefore, 6));
      setReceived(delta);

      setStep("done");
      setAmount("");
      setTimeout(() => {
        setStep("idle");
        setReceived(null);
      }, 8000);
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Swap failed");
      setStep("idle");
    }
  };

  const buttonLabel = () => {
    if (step === "approving") return "Approving...";
    if (step === "swapping") return "Swapping...";
    if (step === "done") return "Swap complete ✓";
    return `Swap ${fromToken} → ${toToken}`;
  };

  const isLoading = step === "approving" || step === "swapping";

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
            disabled={isLoading}
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
            disabled={isLoading}
            className="bg-transparent text-right text-2xl font-bold text-foreground outline-none w-full disabled:opacity-60"
          />
        </div>
      </div>

      {/* Switch */}
      <div className="flex justify-center my-2">
        <button
          onClick={() => setFromToken(toToken)}
          disabled={isLoading}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-60"
        >
          <ArrowDownUp className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* To */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-3">
        <p className="text-xs text-muted-foreground mb-2">To</p>
        <div className="flex items-center justify-between gap-4">
          <span className="bg-white/10 text-foreground rounded-lg px-3 py-2 text-sm font-medium border border-white/10">
            {toToken}
          </span>
          <span className="text-right text-sm text-muted-foreground">
            Rate set by liquidity pool
          </span>
        </div>
      </div>

      {/* Pool rate disclaimer */}
      <div className="mb-6 flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          Exchange rate is determined at swap time by the Arc testnet liquidity
          pool, not by Claimr. Testnet rates can vary significantly from a 1:1
          peg, especially for larger amounts.
        </p>
      </div>

      {/* Actual received feedback */}
      {step === "done" && received !== null && (
        <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
          You received{" "}
          <span className="font-mono font-semibold">
            {received.toFixed(2)} {toToken}
          </span>
          .
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <button
        onClick={handleSwap}
        disabled={isLoading || !amount || step === "done" || !authenticated}
        className="w-full rounded-xl bg-gradient-to-r from-[#FF2D7A] to-[#2D6EFF] py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {buttonLabel()}
      </button>

      {step === "approving" && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Step 1 of 2 — Approve {fromToken} spend with your PIN
        </p>
      )}
      {step === "swapping" && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Step 2 of 2 — Confirm swap with your PIN
        </p>
      )}
    </div>
  );
}
