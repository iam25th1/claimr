"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Wallet, Twitter } from "lucide-react";
import { usePrivy } from "@/lib/auth";
import { useState, useEffect } from "react";
export function OnboardingCards() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role") || "creator";
  const { login, connectWallet, authenticated, user } = usePrivy();

  const handleEmailLogin = async () => {
    await login();
    if (role === "creator") router.push("/dashboard");
    else router.push("/project");
  };

  const handleWalletConnect = async () => {
    await connectWallet();
    if (role === "creator") router.push("/dashboard");
    else router.push("/project");
  };

  useEffect(() => {
  if (authenticated) {
    if (role === "creator") router.push("/dashboard");
    else router.push("/project");
  }
}, [authenticated, role]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#FF2D7A]/20 rounded-full blur-[128px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#2D6EFF]/20 rounded-full blur-[128px] animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Creator Card */}
        {role === "creator" && (
          <div className="relative group">
            <div className="absolute -inset-1 bg-[#FF2D7A]/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Start Earning on Claimr</h2>
              <p className="text-sm text-[#a1a1aa] mb-8">Sign in to claim jobs and get paid in USDC</p>

              <div className="space-y-3">
                <button
                  onClick={handleEmailLogin}
                  className="group/btn w-full px-6 py-3.5 text-base font-medium text-white bg-[#FF2D7A] rounded-xl hover:bg-[#FF2D7A]/90 transition-all shadow-lg shadow-[#FF2D7A]/25 flex items-center justify-center gap-2"
                >
                  Continue with Email
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleEmailLogin}
                  className="w-full px-6 py-3.5 text-base font-medium text-white bg-transparent border border-white/20 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <Twitter className="w-4 h-4" />
                  Continue with X
                </button>

                <div className="flex items-center gap-4 my-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-sm text-[#a1a1aa]">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <button
                  onClick={handleWalletConnect}
                  className="w-full px-6 py-3.5 text-base font-medium text-white bg-transparent border border-white/20 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </button>
              </div>

              <p className="mt-6 text-xs text-[#a1a1aa] leading-relaxed">
                Your embedded wallet is created automatically. Access your private key anytime.
              </p>

              <Link href="/onboarding?role=project" className="mt-4 inline-flex items-center gap-1 text-sm text-[#2D6EFF] hover:text-[#2D6EFF]/80 transition-colors">
                {"I'm a Project instead"}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        {/* Project Card */}
        {role === "project" && (
          <div className="relative group">
            <div className="absolute -inset-1 bg-[#2D6EFF]/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Post Your First Job</h2>
              <p className="text-sm text-[#a1a1aa] mb-8">Sign in to post jobs and escrow USDC trustlessly</p>

              <div className="space-y-3">
                <button
                  onClick={handleEmailLogin}
                  className="group/btn w-full px-6 py-3.5 text-base font-medium text-white bg-[#2D6EFF] rounded-xl hover:bg-[#2D6EFF]/90 transition-all shadow-lg shadow-[#2D6EFF]/25 flex items-center justify-center gap-2"
                >
                  Continue with Email
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleEmailLogin}
                  className="w-full px-6 py-3.5 text-base font-medium text-white bg-transparent border border-white/20 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <Twitter className="w-4 h-4" />
                  Continue with X
                </button>

                <div className="flex items-center gap-4 my-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-sm text-[#a1a1aa]">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <button
                  onClick={handleWalletConnect}
                  className="w-full px-6 py-3.5 text-base font-medium text-white bg-transparent border border-white/20 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </button>
              </div>

              <p className="mt-6 text-xs text-[#a1a1aa] leading-relaxed">
                Deposit USDC to escrow when you post your first job. Powered by Arc + Circle.
              </p>

              <Link href="/onboarding?role=creator" className="mt-4 inline-flex items-center gap-1 text-sm text-[#FF2D7A] hover:text-[#FF2D7A]/80 transition-colors">
                {"I'm a Creator instead"}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}