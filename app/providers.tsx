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
    // 1. Backend creates the Circle user, issues a session token, opens a wallet-init challenge.
    const onboard = await fetch("/api/circle/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!onboard.ok) {
      const err = await onboard.json().catch(() => ({}));
      throw new Error(err?.error ?? "Could not start signup");
    }
    const { userToken, encryptionKey, challengeId } = await onboard.json();

    // 2. Client SDK takes the user through PIN + security-question setup.
    await executeChallenge(challengeId, { userToken, encryptionKey });

    // 3. Backend records the session cookie and fetches the freshly created wallet.
    const finalize = await fetch("/api/circle/finalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!finalize.ok) {
      const err = await finalize.json().catch(() => ({}));
      throw new Error(err?.error ?? "Could not finalize signup");
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
