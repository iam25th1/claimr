import { WalletHeader, WalletBalances } from "@/components/claimr/wallet-balances"
import { SwapCard } from "@/components/claimr/swap-card"
import { TransactionsList } from "@/components/claimr/transactions-list"

export default function WalletPage() {
  return (
    <div className="space-y-8">
      <WalletHeader />
      <WalletBalances />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SwapCard />
        <TransactionsList />
      </div>
    </div>
  )
}
