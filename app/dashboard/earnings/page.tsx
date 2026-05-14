import { EarningsStats } from "@/components/claimr/earnings-stats"
import { EarningsChart } from "@/components/claimr/earnings-chart"
import { PaymentHistory } from "@/components/claimr/payment-history"

export default function EarningsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Earnings</h1>
        <p className="mt-1 text-muted-foreground">Your complete payment history</p>
      </div>

      <EarningsStats />

      <EarningsChart />

      <PaymentHistory />
    </div>
  )
}
