import { PageHeader } from "@/components/claimr/page-header";
import { DiscoverFeed } from "@/components/claimr/discover-feed";

export default function DiscoverPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Creator"
        title="Discover jobs"
        subtitle="Find the right opportunity and start earning USDC."
      />
      <DiscoverFeed />
    </div>
  );
}
