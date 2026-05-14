"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, Briefcase, Vault, BarChart3, Settings, BadgeCheck } from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/project" },
  { icon: PlusCircle, label: "Post a Job", href: "/project/post" },
  { icon: Briefcase, label: "Active Jobs", href: "/project/jobs" },
  { icon: Vault, label: "Escrow", href: "/project/escrow" },
  { icon: BarChart3, label: "Analytics", href: "/project/analytics" },
  { icon: Settings, label: "Settings", href: "/project/settings" },
];

export function ProjectSidebar() {
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
                      ? "bg-[#2D6EFF]/10 text-[#2D6EFF]"
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

      {/* Company Profile */}
      <div className="border-t border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#2D6EFF] to-[#FF2D7A] p-[2px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-background text-sm font-bold">
              AS
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-foreground truncate">ArcSwap Protocol</p>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <BadgeCheck className="h-3.5 w-3.5 text-[#2D6EFF]" />
              <p className="text-xs text-[#2D6EFF]">Verified Project</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
