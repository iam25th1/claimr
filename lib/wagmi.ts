import { http, createConfig } from "wagmi";
import { arcTestnet } from "./chains";

// No connectors: Claimr is Circle-only. Wagmi still gives us useReadContract /
// useReadContracts for on-chain reads (which need no signer), via the http
// transport. Writes happen through Circle's challenge flow, not wagmi.
export const config = createConfig({
  chains: [arcTestnet],
  connectors: [],
  transports: {
    [arcTestnet.id]: http(),
  },
});
