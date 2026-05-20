import { DiscoverFeed } from "@/components/claimr/discover-feed";

export default function DiscoverPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Discover Jobs</h1>
        <p className="mt-1 text-muted-foreground">
          Find the perfect opportunity and start earning USDC
        </p>
      </div>
      <DiscoverFeed />
    </div>
  );
}
