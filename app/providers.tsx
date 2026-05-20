"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";

const queryClient = new QueryClient();
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export function Providers({ children }: { children: React.ReactNode }) {
  const inner = (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  );

  if (!PRIVY_APP_ID) {
    if (typeof window !== "undefined") {
      console.warn(
        "[Claimr] NEXT_PUBLIC_PRIVY_APP_ID not set. Auth flows are disabled. " +
          "Add it in Vercel env vars to enable Privy."
      );
    }
    return inner;
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["email", "wallet", "twitter"],
        appearance: { theme: "dark", accentColor: "#FF2D7A" },
      }}
    >
      {inner}
    </PrivyProvider>
  );
}
