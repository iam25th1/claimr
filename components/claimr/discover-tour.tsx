"use client";

import { WelcomeModal } from "@/components/claimr/welcome-modal";
import { TourOverlay, type TourStep } from "@/components/claimr/tour-overlay";

const DISCOVER_STEPS: TourStep[] = [
  {
    target: '[data-tour-id="discover-header"]',
    title: "Discover jobs",
    body: "Every job on Claimr is right here. Open jobs you can claim, featured jobs from established projects, and the latest postings.",
    placement: "bottom",
  },
  {
    target: '[data-tour-id="discover-search"]',
    title: "Search and filter",
    body: "Filter by category or search by keyword. Jobs are indexed live from the chain, so the list always reflects current state.",
    placement: "bottom",
  },
  {
    target: '[data-tour-id="discover-featured"]',
    title: "Featured jobs",
    body: "Highest-pay open jobs and platform-posted ones surface here. The 'Platform' badge means the job was posted by Claimr directly.",
    placement: "top",
  },
  {
    target: '[data-tour-id="discover-latest"]',
    title: "Latest jobs",
    body: "Newest postings, sorted by time. Click Claim on any open job to start work. You'll need to be signed in to claim.",
    placement: "top",
  },
  {
    target: '[data-tour-id="dashboard-sidebar"]',
    title: "Your dashboard",
    body: "My Jobs tracks claims you've taken. Wallet shows your balances. Earnings sums up completed work. Sign in to use these sections.",
    placement: "right",
  },
  {
    target: '[data-tour-id="tour-replay"]',
    title: "Replay anytime",
    body: "Click this icon in the top nav anytime to run the tour again. That's it - go claim something.",
    placement: "bottom",
  },
];

export function DiscoverTour() {
  return (
    <>
      <WelcomeModal />
      <TourOverlay steps={DISCOVER_STEPS} />
    </>
  );
}
