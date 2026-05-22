"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { isAdminWallet } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/claimr/admin-sidebar";
import { LivingBackground } from "@/components/primitives/living-background";

// Phase A read-first gate. Redirects:
//   - not signed in -> "/"
//   - signed in but wallet not on the allowlist -> "/dashboard"
//
// Both server and client see this layout, but the gate is enforced
// client-side via useAuth(). For Phase B write actions we'll add a
// server-side check inside each /api/admin/* mutation handler.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authenticated, user, ready } = useAuth();
  const router = useRouter();

  const isAdmin = isAdminWallet(user?.walletAddress);

  useEffect(() => {
    if (!ready) return;
    if (!authenticated) {
      router.replace("/");
      return;
    }
    if (!isAdmin) {
      router.replace("/dashboard");
    }
  }, [authenticated, isAdmin, ready, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-10 w-10 rounded-full border-2 border-white/20 border-t-[#FF2D7A] animate-spin" />
      </div>
    );
  }

  if (!authenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm max-w-md text-center">
          <p className="text-lg font-semibold text-foreground mb-2">
            Admin access only
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LivingBackground />
      <AdminSidebar />
      <main className="pl-64">
        <div className="relative min-h-screen p-8">{children}</div>
      </main>
    </div>
  );
}
