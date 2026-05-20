"use client";

import Link from "next/link";
import { Logo } from "@/components/claimr/logo";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="text-white font-semibold text-xl tracking-tight">Claimr</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#a1a1aa]">
          <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
        </div>
        <Link href="/dashboard/discover" className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
          Launch App
        </Link>
      </div>
    </nav>
  );
}