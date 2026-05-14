"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Briefcase, DollarSign, Wallet, Settings } from "lucide-react";

const menuItems = [
  { icon: Compass, label: "Discover", href: "/dashboard" },
  { icon: Briefcase, label: "My Jobs", href: "/dashboard/jobs" },
  { icon: DollarSign, label: "Earnings", href: "/dashboard/earnings" },
  { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r border-border/50 bg-background/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FF2D7A] to-[#2D6EFF]" />
          <span className="text-xl font-bold text-foreground">Claimr</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#FF2D7A]/10 text-[#FF2D7A]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FF2D7A] to-[#2D6EFF] p-[2px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-background text-sm font-bold">
              JZ
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">jenzy.eth</p>
            <p className="text-xs text-muted-foreground">Creator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
