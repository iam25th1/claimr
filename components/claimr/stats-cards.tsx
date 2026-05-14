import { DollarSign, Briefcase, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Total Earned",
    value: "$1,240",
    unit: "USDC",
    icon: DollarSign,
    color: "#FF2D7A",
    bgColor: "rgba(255, 45, 122, 0.1)",
  },
  {
    label: "Active Jobs",
    value: "2",
    unit: "",
    icon: Briefcase,
    color: "#2D6EFF",
    bgColor: "rgba(45, 110, 255, 0.1)",
  },
  {
    label: "Success Rate",
    value: "94",
    unit: "%",
    icon: TrendingUp,
    color: "#22C55E",
    bgColor: "rgba(34, 197, 94, 0.1)",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card rounded-xl p-5 transition-all hover:border-white/20"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {stat.value}
                <span className="ml-1 text-lg font-medium text-muted-foreground">
                  {stat.unit}
                </span>
              </p>
            </div>
            <div
              className="rounded-lg p-2.5"
              style={{ backgroundColor: stat.bgColor }}
            >
              <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
