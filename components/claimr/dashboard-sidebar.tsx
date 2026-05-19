"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, Briefcase, DollarSign, Wallet, Settings, LogOut } from "lucide-react";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";

const menuItems = [
  { icon: Compass, label: "Discover", href: "/dashboard/discover" },
  { icon: Briefcase, label: "My Jobs", href: "/dashboard/my-jobs" },
  { icon: DollarSign, label: "Earnings", href: "/dashboard/earnings" },
  { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

function UserProfile() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { address } = useAccount();
  const { user, logout, authenticated } = usePrivy();
  const router = useRouter();

  const displayName = user?.email?.address
    || user?.twitter?.username && `@${user.twitter.username}`
    || address && `${address.slice(0, 6)}...${address.slice(-4)}`
    || "Creator";

  const avatarLetter = displayName.slice(0, 1).toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };
if (!mounted) {
    return (
      <div className="border-t border-border/50 p-4 h-[72px]" />
    );
  }
  return (
    <div className="border-t border-border/50 p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FF2D7A] to-[#2D6EFF] flex items-center justify-center text-sm font-bold text-white shrink-0">
          {avatarLetter}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground">
            {authenticated ? "Signed in" : "Connected"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FF2D7A] to-[#2D6EFF]" />
          <span className="text-xl font-bold text-foreground">Claimr</span>
        </Link>
      </div>

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

      <UserProfile />
    </aside>
  );
}