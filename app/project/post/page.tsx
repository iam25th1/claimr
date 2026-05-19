"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { ProjectSidebar } from "@/components/claimr/project-sidebar";
import { ArrowRight, DollarSign, Calendar, Target, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { CLAIMR_ESCROW_ADDRESS, CLAIMR_ABI, USDC_ADDRESS, USDC_ABI } from "@/lib/contracts";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export default function PostJobPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("KOL");
  const [pay, setPay] = useState("");
  const [criteria, setCriteria] = useState("");
  const [duration, setDuration] = useState("7");
  const [isPrivate, setIsPrivate] = useState(false);
  const [invitedCreator, setInvitedCreator] = useState("");
  
  // Transaction flow state
  const [step, setStep] = useState<"idle" | "approving" | "posting" | "success">("idle");
  
  // Step 1 — Approve USDC
  const { writeContract: approveUSDC, data: approveHash, error: approveError } = useWriteContract();
  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });
  
  // Step 2 — Post Job
  const { writeContract: postJobContract, data: postHash, error: postError } = useWriteContract();
  const { isSuccess: postSuccess } = useWaitForTransactionReceipt({ hash: postHash });
  
  // When USDC approval confirms, automatically call postJob
  useEffect(() => {
    if (approveSuccess && step === "approving") {
      setStep("posting");
      const amountWei = parseUnits(pay, 6); // USDC has 6 decimals
      
      postJobContract({
        address: CLAIMR_ESCROW_ADDRESS,
        abi: CLAIMR_ABI,
        functionName: 'postJob',
        args: [
          title,
          criteria,
          amountWei,
          BigInt(duration),
          isPrivate,
          (invitedCreator || ZERO_ADDRESS) as `0x${string}`
        ]
      });
    }
  }, [approveSuccess, step]);
  
  // When postJob confirms, show success and navigate
  useEffect(() => {
    if (postSuccess && step === "posting") {
      setStep("success");
      setTimeout(() => router.push("/project"), 3000);
    }
  }, [postSuccess, step, router]);
  
  // Reset on error
  useEffect(() => {
    if (approveError || postError) {
      setStep("idle");
    }
  }, [approveError, postError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    
    if (!pay || parseFloat(pay) <= 0) {
      alert("Please enter a valid USDC amount");
      return;
    }
    
    setStep("approving");
    const amountWei = parseUnits(pay, 6);
    
    approveUSDC({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [CLAIMR_ESCROW_ADDRESS, amountWei]
    });
  };

  const getButtonContent = () => {
    if (step === "approving") return <><Loader2 className="h-4 w-4 animate-spin" /> Approving USDC...</>;
    if (step === "posting") return <><Loader2 className="h-4 w-4 animate-spin" /> Posting Job to Arc...</>;
    if (step === "success") return <><CheckCircle2 className="h-4 w-4" /> Job Posted! Redirecting...</>;
    return <>Post Job & Lock USDC in Escrow <ArrowRight className="h-4 w-4" /></>;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ProjectSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Post a New Job</h1>
            <p className="mt-2 text-muted-foreground">
              Lock USDC in escrow on Arc and find the right creator for your campaign
            </p>
          </div>

          {!isConnected && (
            <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-sm text-yellow-400">
              ⚠️ Connect your wallet first to post a job
            </div>
          )}

          {(approveError || postError) && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
              Transaction failed: {approveError?.message || postError?.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Details */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Target className="h-5 w-5 text-[#2D6EFF]" />
                Job Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Job Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Tweet about our DEX launch"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2D6EFF]/50 focus:border-[#2D6EFF]/50 transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what you want creators to do..."
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2D6EFF]/50 focus:border-[#2D6EFF]/50 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {["KOL", "Writing", "Design", "Dev", "Video"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                          category === cat
                            ? "bg-[#2D6EFF] text-white"
                            : "bg-white/5 text-muted-foreground hover:bg-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Criteria & Payment */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <DollarSign className="h-5 w-5 text-green-400" />
                Criteria & Payment
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Criteria to Meet</label>
                  <input
                    type="text"
                    value={criteria}
                    onChange={(e) => setCriteria(e.target.value)}
                    placeholder="e.g. 3 tweets, 50K impressions, mention @YourProject"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all"
                    required
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Be specific. AI will verify these criteria automatically.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Payment (USDC)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={pay}
                        onChange={(e) => setPay(e.target.value)}
                        placeholder="200"
                        min="1"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-16 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-green-400">USDC</span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Duration (Days)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        min="1"
                        max="30"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-16 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2D6EFF]/50 focus:border-[#2D6EFF]/50 transition-all"
                        required
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Lock className="h-5 w-5 text-[#FF2D7A]" />
                Visibility
              </h2>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="radio" checked={!isPrivate} onChange={() => setIsPrivate(false)} className="mt-1" />
                  <div>
                    <p className="font-medium text-foreground">Open Job</p>
                    <p className="text-sm text-muted-foreground">Anyone can claim. First valid submission wins.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="radio" checked={isPrivate} onChange={() => setIsPrivate(true)} className="mt-1" />
                  <div>
                    <p className="font-medium text-foreground">Private (Invite Only)</p>
                    <p className="text-sm text-muted-foreground">Only the creator you invite can claim.</p>
                  </div>
                </label>

                {isPrivate && (
                  <input
                    type="text"
                    value={invitedCreator}
                    onChange={(e) => setInvitedCreator(e.target.value)}
                    placeholder="Creator wallet address (0x...)"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#FF2D7A]/50 focus:border-[#FF2D7A]/50 transition-all"
                  />
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-4 backdrop-blur-sm">
              <p className="text-sm text-foreground">
                <span className="font-semibold text-green-400">{pay || "0"} USDC</span> will be locked in escrow on Arc.
                Funds release to creator automatically when AI verifies criteria are met.
              </p>
            </div>

            <button
              type="submit"
              disabled={!isConnected || step !== "idle"}
              className="group w-full rounded-xl bg-[#2D6EFF] px-6 py-4 text-base font-medium text-white transition-all hover:bg-[#2D6EFF]/90 shadow-lg shadow-[#2D6EFF]/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {getButtonContent()}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}