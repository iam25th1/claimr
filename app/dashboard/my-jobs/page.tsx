import { PageHeader } from "@/components/claimr/page-header";
import { MyJobsList } from "@/components/claimr/my-jobs-list";

export default function MyJobsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Creator"
        title="My jobs"
        subtitle="Track active claims, submissions awaiting review, and completed work."
      />
      <MyJobsList />
    </div>
  );
}
