"use client";

import Link from "next/link";
import { Logo } from "@/components/claimr/logo";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const { authenticated } = useAuth();
  // Launch App goes to /dashboard/discover for everyone. Guests can
  // browse jobs and navigate. Sign-in is prompted when they try to do
  // anything that needs an account (claim, post, submit, swap).
  const launchHref = "/dashboard/discover";

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
          {!authenticated && (
            <Link
              href="/onboarding?mode=signin"
              className="hidden sm:inline-block px-3 py-2 text-sm text-[#a1a1aa] hover:text-white transition-colors"
            >
              Sign in
            </Link>
          )}
          <Link
            href={launchHref}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#FF2D7A] to-[#2D6EFF] rounded-lg hover:opacity-90 transition-opacity"
          >
            Launch App
          </Link>
        </div>
      </div>
    </nav>
  );
}
