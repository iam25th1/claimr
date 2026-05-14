import { Navbar } from "@/components/claimr/navbar";
import { OnboardingCards } from "@/components/claimr/onboarding-cards";
import { Footer } from "@/components/claimr/footer";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <OnboardingCards />
      <Footer />
    </main>
  );
}
