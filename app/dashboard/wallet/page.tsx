import { WalletHeader, WalletBalances } from "@/components/claimr/wallet-balances"
import { SwapCard } from "@/components/claimr/swap-card"
import { TransactionsList } from "@/components/claimr/transactions-list"
import { WalletAddressCard } from "@/components/claimr/wallet-address-card"

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <WalletHeader />
      <WalletAddressCard />
      <WalletBalances />
      <TransactionsList />
      <div className="border-t border-white/10 pt-6">
        <p className="text-sm text-muted-foreground mb-4">Convert between stablecoins</p>
        <div className="max-w-md">
          <SwapCard />
        </div>
      </div>
    </div>
  )
}
