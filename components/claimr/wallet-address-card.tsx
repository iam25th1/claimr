"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { FundWalletModal } from "./fund-wallet-modal";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { USDC_ADDRESS, USDC_ABI } from "@/lib/contracts";

// Prominent address card that lives at the top of the wallet page.
// Solves the funding-confusion problem: users now see exactly which
// address belongs to their Claimr account, can copy it in one click,
// and have a clear path to fund it without leaving the page.

export function WalletAddressCard() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [fundOpen, setFundOpen] = useState(false);

  const address = user?.walletAddress;

  // USDC balance live from chain. Reads even before auth resolves so the
  // value lands as soon as the address is known.
  const { data: usdcRaw } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });
  const usdcBalance = usdcRaw
    ? Number(formatUnits(usdcRaw as bigint, 6)).toFixed(2)
    : "0.00";

  if (!address) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <>
      <div className="glass-card rounded-xl p-6 border border-white/10">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1 min-w-0 max-w-xl">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Your Claimr wallet
            </p>
            <p className="font-mono text-sm text-foreground break-all mb-3">
              {address}
            </p>
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 w-fit">
              <span className="text-xs text-muted-foreground">USDC balance</span>
              <span className="font-mono text-sm font-semibold text-foreground">
                {usdcBalance}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This is the wallet your Claimr account controls on Arc Testnet. Only send funds to
              this exact address. Funds sent elsewhere can't be recovered.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
              aria-label="Copy wallet address"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
            <a
              href={`https://testnet.arcscan.app/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Arcscan
            </a>
            <button
              onClick={() => setFundOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF2D7A] text-sm font-medium text-white hover:bg-[#FF2D7A]/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Fund wallet
            </button>
          </div>
        </div>
      </div>
      <FundWalletModal open={fundOpen} onClose={() => setFundOpen(false)} />
    </>
  );
}
