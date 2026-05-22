import { ProjectStats } from "@/components/claimr/project-stats";
import { ProjectJobCards } from "@/components/claimr/project-job-cards";
import { PostJobCTA } from "@/components/claimr/post-job-cta";
import { WalletAddressCard } from "@/components/claimr/wallet-address-card";
import { HeroEscrowNumber } from "@/components/claimr/hero-escrow-number";
import { RecentActivity } from "@/components/claimr/recent-activity";
import { VerifierCard } from "@/components/claimr/verifier-card";

export default function ProjectDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your jobs and track creator performance
        </p>
      </div>

      {/* Hero: total locked in escrow */}
      <HeroEscrowNumber />

      {/* AI verifier state — renders only when there's something to show */}
      <VerifierCard />

      {/* Wallet address + funding moment */}
      <WalletAddressCard />

      {/* Stats */}
      <ProjectStats />

      {/* Recent activity */}
      <RecentActivity />

      {/* Active Jobs */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Active Jobs
        </h2>
        <ProjectJobCards />
      </div>

      {/* Post Job CTA */}
      <PostJobCTA />
    </div>
  );
}
