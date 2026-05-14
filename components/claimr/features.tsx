"use client";

import { Bot, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Verified",
    description: "Submissions are verified automatically by our AI, ensuring quality and compliance without human bias.",
    gradient: "from-[#FF2D7A] to-[#FF6B9D]",
  },
  {
    icon: Zap,
    title: "Instant USDC",
    description: "Payments released instantly on Arc blockchain. No waiting, no middlemen, just pure speed.",
    gradient: "from-[#2D6EFF] to-[#6B9DFF]",
  },
  {
    icon: Shield,
    title: "Zero Trust Needed",
    description: "Smart contract escrow holds funds until criteria are met. Trustless by design.",
    gradient: "from-[#FF2D7A] via-[#9D4DFF] to-[#2D6EFF]",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Creators & Projects Choose Claimr
          </h2>
          <p className="text-[#a1a1aa] max-w-xl mx-auto">
            Built for the new economy where trust is earned through code, not promises.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 glass-card rounded-2xl hover:bg-white/[0.05] transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`relative w-12 h-12 mb-6 rounded-xl bg-gradient-to-br ${feature.gradient} p-[1px]`}>
                <div className="w-full h-full bg-[#0a0a0a] rounded-[11px] flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Content */}
              <h3 className="relative text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="relative text-[#a1a1aa] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
