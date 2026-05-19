import { Suspense } from "react";
import { Navbar } from "@/components/claimr/navbar";
import { OnboardingCards } from "@/components/claimr/onboarding-cards";
import { Footer } from "@/components/claimr/footer";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen" />}>
        <OnboardingCards />
      </Suspense>
      <Footer />
    </main>
  );
}