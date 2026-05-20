"use client";

import { usePrivy } from "@/lib/auth";
import { useAccount } from "wagmi";
import { StatsCards } from "@/components/claimr/stats-cards";
import { FeaturedJobs } from "@/components/claimr/featured-jobs";
import { LatestJobs } from "@/components/claimr/latest-jobs";

export default function DashboardPage() {
  const { user } = usePrivy();
  const { address } = useAccount();

  const displayName = user?.twitter?.username && `@${user.twitter.username}`
    || user?.email?.address && user.email.address.split("@")[0]
    || address && `${address.slice(0, 6)}...${address.slice(-4)}`
    || "Creator";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, <span className="text-[#FF2D7A]">{displayName}</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening with your creator account.
        </p>
      </div>

      <StatsCards />
      <FeaturedJobs />
      <LatestJobs />
    </div>
  );
}