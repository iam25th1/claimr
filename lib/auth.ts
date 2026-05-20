"use client";

import { usePrivy as usePrivyOriginal } from "@privy-io/react-auth";

const NO_PRIVY_MESSAGE =
  "Auth is not configured yet. Set NEXT_PUBLIC_PRIVY_APP_ID, or wait for the Circle Wallets migration.";

const STUB = {
  ready: true,
  authenticated: false,
  user: null as any,
  login: async () => {
    if (typeof window !== "undefined") window.alert(NO_PRIVY_MESSAGE);
  },
  logout: async () => {},
  connectWallet: async () => {
    if (typeof window !== "undefined") window.alert(NO_PRIVY_MESSAGE);
  },
};

// Drop-in replacement for `usePrivy` from @privy-io/react-auth.
// Returns a no-op stub when PrivyProvider isn't mounted (e.g. NEXT_PUBLIC_PRIVY_APP_ID
// is unset, so providers.tsx skips PrivyProvider). Lets the marketing site, browse
// pages and SSR/prerender all render without crashing. Auth-gated actions show a
// short notice when invoked.
export function usePrivy() {
  try {
    return usePrivyOriginal();
  } catch {
    return STUB as any;
  }
}
