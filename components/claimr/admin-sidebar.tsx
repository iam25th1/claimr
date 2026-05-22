"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Wallet as WalletIcon,
  Activity,
  Bot,
  Database,
  LogOut,
  Shield,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/claimr/logo";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Briefcase, label: "Jobs", href: "/admin/jobs" },
  { icon: WalletIcon, label: "Wallets", href: "/admin/wallets" },
  { icon: Activity, label: "Activity", href: "/admin/activity" },
  { icon: Bot, label: "Verifier", href: "/admin/verifier" },
  { icon: Database, label: "Seed", href: "/admin/seed" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout, authenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const displayName =
    user?.email ||
    (user?.walletAddress
      ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
      : "Admin");

  const avatarLetter = displayName.slice(0, 1).toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r border-border/50 bg-background/80 backdrop-blur-xl z-10">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="text-xl font-bold text-foreground">Claimr</span>
          <span className="ml-1 rounded-full bg-[#FF2D7A]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#FF2D7A]">
            Admin
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
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

      {mounted ? (
        <div className="border-t border-border/50 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FF2D7A] to-[#2D6EFF] flex items-center justify-center text-sm font-bold text-white shrink-0">
              {avatarLetter}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {displayName}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Shield className="h-3.5 w-3.5 text-[#FF2D7A]" />
                <p className="text-xs text-[#FF2D7A]">
                  {authenticated ? "Superadmin" : "Not signed in"}
                </p>
              </div>
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
      ) : (
        <div className="border-t border-border/50 p-4 h-[72px]" />
      )}
    </aside>
  );
}
