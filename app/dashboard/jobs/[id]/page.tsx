import { JobDetailsCard } from "@/components/claimr/job-details-card";
import { SubmitWorkCard } from "@/components/claimr/submit-work-card";

export default function JobSubmissionPage() {
  return (
    <div className="max-w-5xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Job Submission</h1>
        <p className="text-muted-foreground">
          Review the requirements and submit your work for AI verification
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Job Details */}
        <JobDetailsCard />

        {/* Right Column - Submit Work */}
        <SubmitWorkCard />
      </div>
    </div>
  );
}
