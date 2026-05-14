import { Navbar } from "@/components/claimr/navbar";
import { Hero } from "@/components/claimr/hero";
import { Features } from "@/components/claimr/features";
import { Footer } from "@/components/claimr/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
