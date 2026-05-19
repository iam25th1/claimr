import { http, createConfig } from 'wagmi'
import { injected, metaMask } from 'wagmi/connectors'
import { arcTestnet } from './chains'

export const config = createConfig({
  chains: [arcTestnet],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [arcTestnet.id]: http()
  }
})