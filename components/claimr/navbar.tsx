"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF2D7A] to-[#2D6EFF] rounded-lg" />
            <div className="absolute inset-[2px] bg-[#0a0a0a] rounded-[6px] flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">Claimr</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#a1a1aa]">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#" className="hover:text-white transition-colors">Docs</a>
        </div>
        <Link href="/dashboard/discover" className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
          Launch App
        </Link>
      </div>
    </nav>
  );
}