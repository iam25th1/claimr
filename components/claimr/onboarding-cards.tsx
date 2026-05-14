"use client";

import { useState } from "react";
import { ArrowRight, Wallet } from "lucide-react";

export function OnboardingCards() {
  const [creatorEmail, setCreatorEmail] = useState("");
  const [creatorPassword, setCreatorPassword] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectEmail, setProjectEmail] = useState("");
  const [projectPassword, setProjectPassword] = useState("");

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#FF2D7A]/20 rounded-full blur-[128px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#2D6EFF]/20 rounded-full blur-[128px] animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px"
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Creator Card */}
          <div className="relative group">
            {/* Pink glow behind card */}
            <div className="absolute -inset-1 bg-[#FF2D7A]/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            
            <div className="relative glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-8">Start Earning on Claimr</h2>
              
              <form className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={creatorEmail}
                    onChange={(e) => setCreatorEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#a1a1aa] focus:outline-none focus:ring-2 focus:ring-[#FF2D7A]/50 focus:border-[#FF2D7A]/50 transition-all"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={creatorPassword}
                    onChange={(e) => setCreatorPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#a1a1aa] focus:outline-none focus:ring-2 focus:ring-[#FF2D7A]/50 focus:border-[#FF2D7A]/50 transition-all"
                  />
                </div>
                
                <button
                  type="submit"
                  className="group/btn w-full px-6 py-3.5 text-base font-medium text-white bg-[#FF2D7A] rounded-xl hover:bg-[#FF2D7A]/90 transition-all shadow-lg shadow-[#FF2D7A]/25 flex items-center justify-center gap-2"
                >
                  Create Creator Account
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-sm text-[#a1a1aa]">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <button className="w-full px-6 py-3.5 text-base font-medium text-white bg-transparent border border-white/20 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>

              <p className="mt-6 text-xs text-[#a1a1aa] leading-relaxed">
                Your embedded wallet is created automatically. Access your private key anytime.
              </p>

              <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm text-[#2D6EFF] hover:text-[#2D6EFF]/80 transition-colors">
                {"I'm a Project instead"}
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Project Card */}
          <div className="relative group">
            {/* Blue glow behind card */}
            <div className="absolute -inset-1 bg-[#2D6EFF]/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            
            <div className="relative glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-8">Post Your First Job</h2>
              
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Company name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#a1a1aa] focus:outline-none focus:ring-2 focus:ring-[#2D6EFF]/50 focus:border-[#2D6EFF]/50 transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={projectEmail}
                    onChange={(e) => setProjectEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#a1a1aa] focus:outline-none focus:ring-2 focus:ring-[#2D6EFF]/50 focus:border-[#2D6EFF]/50 transition-all"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={projectPassword}
                    onChange={(e) => setProjectPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#a1a1aa] focus:outline-none focus:ring-2 focus:ring-[#2D6EFF]/50 focus:border-[#2D6EFF]/50 transition-all"
                  />
                </div>
                
                <button
                  type="submit"
                  className="group/btn w-full px-6 py-3.5 text-base font-medium text-white bg-[#2D6EFF] rounded-xl hover:bg-[#2D6EFF]/90 transition-all shadow-lg shadow-[#2D6EFF]/25 flex items-center justify-center gap-2"
                >
                  Create Project Account
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-sm text-[#a1a1aa]">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <button className="w-full px-6 py-3.5 text-base font-medium text-white bg-transparent border border-white/20 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>

              <p className="mt-6 text-xs text-[#a1a1aa] leading-relaxed">
                Deposit USDC to escrow when you post your first job. Powered by Arc + Circle.
              </p>

              <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm text-[#FF2D7A] hover:text-[#FF2D7A]/80 transition-colors">
                {"I'm a Creator instead"}
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
