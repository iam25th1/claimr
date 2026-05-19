"use client";

import { useState } from "react";
import { ProjectSidebar } from "@/components/claimr/project-sidebar";
import { BadgeCheck, Wallet, Bell, ExternalLink } from "lucide-react";

export default function ProjectSettingsPage() {
  const [companyName, setCompanyName] = useState("ArcSwap Protocol");
  const [email, setEmail] = useState("team@arcswap.io");
  const [website, setWebsite] = useState("https://arcswap.io");
  const [bio, setBio] = useState("DeFi protocol building the future of liquidity on Arc.");

  return (
    <div className="flex min-h-screen bg-background">
      <ProjectSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="mt-2 text-muted-foreground">Manage your project profile and preferences</p>
          </div>

          {/* Company Profile */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h2 className="mb-4 font-semibold text-foreground">Company Profile</h2>
            
            <div className="mb-4 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#2D6EFF] to-[#FF2D7A] p-[2px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-background text-lg font-bold text-foreground">
                  AS
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-[#2D6EFF]/30 bg-[#2D6EFF]/10 px-3 py-1">
                <BadgeCheck className="h-3.5 w-3.5 text-[#2D6EFF]" />
                <span className="text-xs font-medium text-[#2D6EFF]">Verified Project</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2D6EFF]/50 focus:border-[#2D6EFF]/50 transition-all"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2D6EFF]/50 focus:border-[#2D6EFF]/50 transition-all"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2D6EFF]/50 focus:border-[#2D6EFF]/50 transition-all"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2D6EFF]/50 focus:border-[#2D6EFF]/50 transition-all resize-none"
                />
              </div>

              <button className="rounded-lg bg-[#2D6EFF] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2D6EFF]/90">
                Save Changes
              </button>
            </div>
          </div>

          {/* Connected Wallet */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
              <Wallet className="h-5 w-5 text-[#2D6EFF]" />
              Connected Wallet
            </h2>
            
            <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="font-mono text-sm text-foreground">0xa84...64626</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Arc Testnet • Connected via MetaMask</p>
              </div>
              <a
                href="https://testnet.arcscan.app/address/0xa8404ecf7e163821da0363E78E4Fb4d6E1164626"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-[#2D6EFF] hover:text-[#2D6EFF]/80 transition-colors"
              >
                View on Arcscan
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
              <Bell className="h-5 w-5 text-[#FF2D7A]" />
              Notifications
            </h2>
            
            <div className="space-y-3">
              {[
                { label: "New job applicants", desc: "When creators apply to your jobs" },
                { label: "Submissions ready for review", desc: "When AI verifies a creator's work" },
                { label: "Job completion alerts", desc: "When escrow releases successfully" },
                { label: "Weekly performance summary", desc: "Email digest every Monday" },
              ].map((item, i) => (
                <label key={i} className="flex items-center justify-between gap-4 cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 rounded accent-[#2D6EFF]" />
                </label>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}