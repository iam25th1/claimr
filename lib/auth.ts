"use client";

import { createContext, useContext } from "react";

export interface AuthUser {
  email: string;
  walletAddress: string | null; // null between PIN setup completion and wallet fetch
}

export interface AuthContextValue {
  ready: boolean;
  authenticated: boolean;
  user: AuthUser | null;
  signUp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const NO_AUTH_MESSAGE =
  "Auth is not configured. Set NEXT_PUBLIC_CIRCLE_APP_ID and CIRCLE_API_KEY in Vercel env vars.";

export const STUB_AUTH: AuthContextValue = {
  ready: true,
  authenticated: false,
  user: null,
  signUp: async () => {
    if (typeof window !== "undefined") window.alert(NO_AUTH_MESSAGE);
  },
  logout: async () => {},
};

export const AuthContext = createContext<AuthContextValue | null>(null);

// Drop-in hook. Returns the safe STUB if AuthProvider isn't mounted, so SSR
// and any code path that runs before hydration doesn't crash.
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  return ctx ?? STUB_AUTH;
}
