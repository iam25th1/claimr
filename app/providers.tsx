"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";
import { AuthContext, type AuthContextValue, type AuthUser } from "@/lib/auth";
import { executeChallenge } from "@/lib/circle-client";

const queryClient = new QueryClient();

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  // On mount, check existing session via the httpOnly cookie.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/circle/me", { cache: "no-store" });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (data?.email) {
            setUser({
              email: data.email,
              walletAddress: data.walletAddress ?? null,
            });
          }
        }
      } catch {
        // Network error or no session: stay unauthenticated.
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signUp = useCallback(async (email: string) => {
    // 1. Backend creates the Circle user (idempotent), issues a session token,
    //    opens a PIN+wallet challenge if needed.
    const onboard = await fetch("/api/circle/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!onboard.ok) {
      const err = await onboard.json().catch(() => ({}));
      // Surface the actual error message from the API so the UI can show
      // something more useful than "Internal onboarding error". Falls back
      // to a status-based message if the body didn't include `error`.
      const apiError =
        err?.error ??
        `Onboarding failed (HTTP ${onboard.status}). Check that CIRCLE_API_KEY is set in Vercel env vars.`;
      throw new Error(apiError);
    }
    const { userToken, encryptionKey, challengeId, alreadyInitialized } =
      await onboard.json();

    // 2. Run the PIN+wallet challenge only when one was issued. Returning
    //    users with an existing PIN won't get a challenge - skip directly
    //    to finalize. This was a bug previously: executeChallenge(null) threw.
    if (challengeId && !alreadyInitialized) {
      try {
        await executeChallenge(challengeId, { userToken, encryptionKey });
      } catch (err: any) {
        // Cancel inside the PIN sheet is the most common reason this rejects.
        const msg = err?.message ?? "PIN entry cancelled.";
        throw new Error(msg);
      }
    }

    // 3. Backend records the session cookie and fetches the wallet (new or existing).
    const finalize = await fetch("/api/circle/finalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!finalize.ok) {
      const err = await finalize.json().catch(() => ({}));
      throw new Error(err?.error ?? `Finalize failed (HTTP ${finalize.status}).`);
    }
    const data = await finalize.json();
    setUser({
      email: data.email,
      walletAddress: data.walletAddress ?? null,
    });
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/circle/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      authenticated: !!user,
      user,
      signUp,
      logout,
    }),
    [ready, user, signUp, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
