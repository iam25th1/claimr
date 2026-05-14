"use client";

import { useState } from "react";
import { Bot, ArrowRight } from "lucide-react";

export function SubmitWorkCard() {
  const [links, setLinks] = useState(["", "", ""]);

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-bold text-foreground mb-6">Submit Your Tweets</h3>

      {/* Tweet Link Inputs */}
      <div className="space-y-4 mb-6">
        {[1, 2, 3].map((num, index) => (
          <div key={num}>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tweet Link {num}
            </label>
            <input
              type="url"
              value={links[index]}
              onChange={(e) => handleLinkChange(index, e.target.value)}
              placeholder="https://x.com/..."
              className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#FF2D7A]/50 focus:outline-none focus:ring-2 focus:ring-[#FF2D7A]/20 transition-all"
            />
          </div>
        ))}
      </div>

      {/* AI Verification Info */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">AI Verification</h4>
        <div className="rounded-xl bg-[#2D6EFF]/10 border border-[#2D6EFF]/20 p-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#2D6EFF]/20 flex items-center justify-center flex-shrink-0">
              <Bot className="h-5 w-5 text-[#2D6EFF]" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our AI agent will automatically verify your tweets meet all criteria. 
              Verification takes ~30 seconds. Payment releases instantly on approval.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button className="w-full rounded-xl bg-gradient-to-r from-[#FF2D7A] to-[#FF2D7A]/80 px-6 py-4 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#FF2D7A]/25 flex items-center justify-center gap-2">
        Submit for Verification
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="text-xs text-muted-foreground text-center mt-3">
        You can resubmit if criteria aren&apos;t met yet
      </p>
    </div>
  );
}
