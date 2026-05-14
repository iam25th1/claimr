"use client";

import { Clock, CheckCircle2, Shield } from "lucide-react";

export function JobDetailsCard() {
  const criteria = [
    "Minimum 3 tweets",
    "50,000 impressions total",
    "Must mention @ArcSwap and $ARC",
    "Posts within 7 days",
  ];

  return (
    <div className="glass-card rounded-2xl p-6">
      {/* Project Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#2D6EFF] to-[#2D6EFF]/60 flex items-center justify-center text-white font-bold text-lg">
          AS
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">ArcSwap Protocol</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#2D6EFF]/10 px-2 py-0.5 text-xs font-medium text-[#2D6EFF]">
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </span>
          </div>
          <p className="text-sm text-muted-foreground">DeFi Protocol on Arc</p>
        </div>
      </div>

      {/* Job Title */}
      <h2 className="text-xl font-bold text-foreground mb-4">
        Tweet about our Arc DEX launch
      </h2>

      {/* Pay and Deadline */}
      <div className="flex items-center gap-6 mb-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Pay</p>
          <p className="text-2xl font-bold text-[#22C55E]">200 USDC</p>
        </div>
        <div className="h-10 w-px bg-border" />
        <div>
          <p className="text-sm text-muted-foreground mb-1">Deadline</p>
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">5 days left</span>
          </div>
        </div>
      </div>

      {/* Criteria Section */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">Criteria to Meet</h4>
        <ul className="space-y-2.5">
          {criteria.map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded border border-border/80 bg-muted/30 flex items-center justify-center">
                <div className="h-2 w-2 rounded-sm bg-transparent" />
              </div>
              <span className="text-sm text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Escrow Status */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Escrow Status</h4>
        <div className="rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-[#22C55E]" />
            <span className="font-medium text-[#22C55E]">200 USDC Secured in Escrow</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Funds locked on Arc blockchain. Released automatically when criteria are met.
          </p>
        </div>
      </div>
    </div>
  );
}
