"use client";

import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { Logo } from "@/components/claimr/logo";
import { useAuth } from "@/lib/auth";
import { useTour } from "@/lib/tour-state";

export function Navbar() {
  const { authenticated } = useAuth();
  const { startTour } = useTour();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="text-white font-semibold text-xl tracking-tight">
            Claimr
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#a1a1aa]">
          <Link
            href="/#features"
            className="hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-white transition-colors"
          >
            How it Works
          </Link>
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {/* Tour replay - only visible if a tour exists for the user. */}
          <button
            type="button"
            onClick={startTour}
            title="Take a tour"
            aria-label="Take a tour"
            data-tour-id="tour-replay"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
          <Link
            href="/dashboard/discover"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#FF2D7A] to-[#2D6EFF] rounded-lg hover:opacity-90 transition-opacity"
          >
            {authenticated ? "Open dashboard" : "Launch App"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
