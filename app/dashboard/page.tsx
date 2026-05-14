import { StatsCards } from "@/components/claimr/stats-cards";
import { JobCards } from "@/components/claimr/job-cards";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, <span className="text-[#FF2D7A]">jenzy.eth</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening with your creator account.
        </p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Jobs */}
      <JobCards />
    </div>
  );
}
