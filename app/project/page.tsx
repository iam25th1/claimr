import { ProjectStats } from "@/components/claimr/project-stats";
import { ProjectJobCards } from "@/components/claimr/project-job-cards";
import { PostJobCTA } from "@/components/claimr/post-job-cta";

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

      {/* Stats */}
      <ProjectStats />

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
