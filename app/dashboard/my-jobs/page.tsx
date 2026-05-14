import { MyJobsList } from "@/components/claimr/my-jobs-list"

export default function MyJobsPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">My Jobs</h1>
        <p className="mt-1 text-muted-foreground">
          Track your active and completed work
        </p>
      </div>

      {/* Jobs List */}
      <MyJobsList />
    </div>
  )
}
