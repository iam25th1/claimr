import { PlusCircle } from "lucide-react";
import Link from "next/link";

export function PostJobCTA() {
  return (
    <div className="relative overflow-hidden rounded-xl p-[1px]">
      {/* Gradient Border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#2D6EFF] via-[#2D6EFF]/50 to-[#2D6EFF]" />
      
      <div className="relative rounded-xl bg-background/95 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Ready to find your next creator?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Funds held in escrow until delivery
            </p>
          </div>
          <Link
            href="/project/post"
            className="inline-flex items-center gap-2 rounded-lg bg-[#2D6EFF] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#2D6EFF]/90 hover:shadow-lg hover:shadow-[#2D6EFF]/25"
          >
            <PlusCircle className="h-4 w-4" />
            Post a Job
          </Link>
        </div>
      </div>
    </div>
  );
}
