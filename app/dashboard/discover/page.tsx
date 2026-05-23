import { PageHeader } from "@/components/claimr/page-header";
import { DiscoverFeed } from "@/components/claimr/discover-feed";
import { DiscoverTour } from "@/components/claimr/discover-tour";

export default function DiscoverPage() {
  return (
    <div className="space-y-8">
      <div data-tour-id="discover-header">
        <PageHeader
          eyebrow="Creator"
          title="Discover jobs"
          subtitle="Find the right opportunity and start earning USDC."
        />
      </div>
      <DiscoverFeed />

      {/* First-time welcome + step-by-step tour. Self-managed via
          tour-state localStorage flag. Replay icon lives in the navbar. */}
      <DiscoverTour />
    </div>
  );
}
