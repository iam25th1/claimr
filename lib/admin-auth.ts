// Phase A admin gate. Read-only by design — anyone with a chain explorer
// can see the same data. The gate is UX, not security. Phase B write
// actions will need a separate server-only check before any mutation.
//
// Environment:
//   NEXT_PUBLIC_ADMIN_WALLETS = "0xabc...,0xdef..."  (comma-separated)
//
// Set this in:
//   - .env.local         (local dev)
//   - Vercel Project Env (deployed)
//
// Addresses are matched case-insensitively after trimming whitespace.

function parseAdminList(raw: string | undefined): Set<string> {
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s) => /^0x[a-f0-9]{40}$/i.test(s))
  );
}

/**
 * Read the admin wallet allowlist. Returns a Set of lowercased addresses.
 * Same source works in client + server components because the var is
 * NEXT_PUBLIC_ prefixed.
 */
export function getAdminWallets(): Set<string> {
  return parseAdminList(process.env.NEXT_PUBLIC_ADMIN_WALLETS);
}

/**
 * Check whether a given wallet address is on the admin allowlist.
 */
export function isAdminWallet(address: string | undefined | null): boolean {
  if (!address) return false;
  const wallets = getAdminWallets();
  return wallets.has(address.toLowerCase());
}
