import { NextResponse } from "next/server";
import { getAllReasoning } from "@/lib/verification-log";

// GET /api/admin/activity
//
// Returns every verification reasoning entry the verifier has logged, newest
// first. Phase A read-only endpoint. No mutation, no destructive action,
// so the only protection here is the same wallet-allowlist gate enforced
// client-side on /admin/* layout. Anyone with chain access can read the
// same status/data anyway.
//
// Phase B (write actions) will require non-public ADMIN_WALLETS env check
// per route before any mutation.

export async function GET() {
  const entries = getAllReasoning();
  return NextResponse.json({ entries });
}
