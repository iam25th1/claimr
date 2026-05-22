"use client";

import { useMemo, useState } from "react";
import { useJobs } from "@/lib/useJobs";
import { Search, ExternalLink, Briefcase, Wallet } from "lucide-react";
import { AnimatedNumber } from "@/components/primitives/animated-number";

interface WalletRecord {
  address: string;
  rolesProjects: number; // jobs posted (as project)
  rolesCreator: number; // jobs claimed (as creator)
  usdcLocked: number; // sum amount of jobs this wallet posted that are still locked
  usdcEarned: number; // sum amount * 0.95 of completed jobs this wallet claimed (5% fee assumed)
  lastJobId: number; // most recent job they touched (rough activity proxy)
}

export default function AdminWalletsPage() {
  const { jobs, isLoading } = useJobs();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "posted" | "earned">("recent");

  const wallets = useMemo<WalletRecord[]>(() => {
    const map = new Map<string, WalletRecord>();

    const ensure = (addr: string): WalletRecord => {
      const key = addr.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          address: addr,
          rolesProjects: 0,
          rolesCreator: 0,
          usdcLocked: 0,
          usdcEarned: 0,
          lastJobId: 0,
        });
      }
      return map.get(key)!;
    };

    jobs.forEach((j) => {
      // Project side
      const p = ensure(j.project);
      p.rolesProjects += 1;
      if (j.status === 0 || j.status === 1 || j.status === 2) {
        p.usdcLocked += j.amount;
      }
      if (j.id > p.lastJobId) p.lastJobId = j.id;

      // Creator side
      if (j.creator !== "0x0000000000000000000000000000000000000000") {
        const c = ensure(j.creator);
        c.rolesCreator += 1;
        if (j.status === 3) {
          c.usdcEarned += j.amount * 0.95;
        }
        if (j.id > c.lastJobId) c.lastJobId = j.id;
      }
    });

    return Array.from(map.values());
  }, [jobs]);

  const filtered = useMemo(() => {
    let out = wallets;

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter((w) => w.address.toLowerCase().includes(q));
    }

    if (sortBy === "recent") {
      out = [...out].sort((a, b) => b.lastJobId - a.lastJobId);
    } else if (sortBy === "posted") {
      out = [...out].sort((a, b) => b.rolesProjects - a.rolesProjects);
    } else if (sortBy === "earned") {
      out = [...out].sort((a, b) => b.usdcEarned - a.usdcEarned);
    }

    return out;
  }, [wallets, query, sortBy]);

  const totalWallets = wallets.length;
  const projectWallets = wallets.filter((w) => w.rolesProjects > 0).length;
  const creatorWallets = wallets.filter((w) => w.rolesCreator > 0).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Wallets</h1>
        <p className="mt-2 text-muted-foreground">
          Every address that has interacted with the escrow contract
        </p>
      </div>

      {/* Headline counts */}
      <div className="grid gap-4 md:grid-cols-3">
        <CountTile label="Total wallets" value={totalWallets} />
        <CountTile label="As project" value={projectWallets} />
        <CountTile label="As creator" value={creatorWallets} />
      </div>

      {/* Search + sort */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by address"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#FF2D7A]/50 focus:ring-2 focus:ring-[#FF2D7A]/20 transition-all"
          />
        </div>

        <div className="flex gap-1 rounded-xl bg-white/5 p-1">
          {[
            { key: "recent", label: "Recent" },
            { key: "posted", label: "Most posted" },
            { key: "earned", label: "Most earned" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key as typeof sortBy)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                sortBy === opt.key
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-12 text-center backdrop-blur-sm">
          <Wallet className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            {wallets.length === 0
              ? "No wallets have interacted with the contract yet."
              : "No wallets match this search."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground border-b border-white/5">
            <span className="col-span-5">Address</span>
            <span className="col-span-2 text-right">Posted</span>
            <span className="col-span-2 text-right">Claimed</span>
            <span className="col-span-2 text-right">USDC locked</span>
            <span className="col-span-1 text-right">Earned</span>
          </div>

          {filtered.map((w) => (
            <div
              key={w.address.toLowerCase()}
              className="grid md:grid-cols-12 gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center"
            >
              <div className="md:col-span-5 min-w-0">
                <a
                  href={`https://testnet.arcscan.app/address/${w.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-sm text-foreground hover:text-[#2D6EFF] transition-colors truncate"
                >
                  {w.address}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
                <div className="flex items-center gap-2 mt-1">
                  {w.rolesProjects > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-blue-400">
                      <Briefcase className="h-2.5 w-2.5" />
                      Project
                    </span>
                  )}
                  {w.rolesCreator > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#FF2D7A]">
                      <Wallet className="h-2.5 w-2.5" />
                      Creator
                    </span>
                  )}
                </div>
              </div>

              <span className="md:col-span-2 md:text-right text-sm text-foreground">
                <span className="md:hidden text-xs text-muted-foreground mr-2">Posted</span>
                {w.rolesProjects}
              </span>
              <span className="md:col-span-2 md:text-right text-sm text-foreground">
                <span className="md:hidden text-xs text-muted-foreground mr-2">Claimed</span>
                {w.rolesCreator}
              </span>
              <span className="md:col-span-2 md:text-right text-sm text-foreground">
                <span className="md:hidden text-xs text-muted-foreground mr-2">Locked</span>
                {w.usdcLocked.toFixed(2)}
              </span>
              <span className="md:col-span-1 md:text-right text-sm text-green-400 font-medium">
                <span className="md:hidden text-xs text-muted-foreground mr-2">Earned</span>
                {w.usdcEarned.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CountTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-foreground">
        <AnimatedNumber value={value} />
      </p>
    </div>
  );
}
