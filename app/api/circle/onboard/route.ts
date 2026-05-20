import { NextRequest, NextResponse } from "next/server";
import {
  getCircleClient,
  emailToUserId,
  newIdempotencyKey,
  ARC_TESTNET_BLOCKCHAIN,
} from "@/lib/circle-server";

// Minimal email shape check. We do not verify deliverability here.
function isValidEmail(s: unknown): s is string {
  if (typeof s !== "string") return false;
  const trimmed = s.trim();
  if (trimmed.length < 3 || trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body?.email;
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const userId = emailToUserId(email);
    const client = getCircleClient();

    // 1. Create the Circle user. Idempotent at the application layer because
    //    userId is derived from email. Circle returns userAlreadyExisted (155101)
    //    if the user is already created, which we treat as success.
    try {
      await client.createUser({ userId });
    } catch (err: any) {
      const code = err?.response?.data?.code ?? err?.code;
      // 155101 = userAlreadyExisted (per Circle ErrorCode enum)
      if (code !== 155101) {
        console.error("[CIRCLE/onboard] createUser failed", err);
        return NextResponse.json(
          { error: "Could not create Circle user" },
          { status: 500 }
        );
      }
    }

    // 2. Issue a short-lived session token (60 min). Returns userToken +
    //    encryptionKey, both needed by the client SDK to execute challenges.
    const tokenResp = await client.createUserToken({ userId });
    const userToken = tokenResp.data?.userToken;
    const encryptionKey = tokenResp.data?.encryptionKey;
    if (!userToken || !encryptionKey) {
      return NextResponse.json(
        { error: "Could not issue session token" },
        { status: 500 }
      );
    }

    // 3. Open a PIN-setup-and-wallet-init challenge for Arc Testnet. The SDK
    //    will resolve this via the iframe PIN flow on the client.
    const challengeResp = await client.createUserPinWithWallets({
      userToken,
      accountType: "EOA",
      blockchains: [ARC_TESTNET_BLOCKCHAIN],
      idempotencyKey: newIdempotencyKey(),
    } as any);
    const challengeId = challengeResp.data?.challengeId;
    if (!challengeId) {
      // If the user already set a PIN previously (e.g. completed signup before
      // but lost their session), the wallet-init challenge will not be returned.
      // In that case we still hand back the session tokens so the client can
      // proceed to finalize (existing wallet lookup).
      return NextResponse.json(
        {
          userToken,
          encryptionKey,
          challengeId: null,
          alreadyInitialized: true,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      userToken,
      encryptionKey,
      challengeId,
      alreadyInitialized: false,
    });
  } catch (err) {
    console.error("[CIRCLE/onboard] FATAL", err);
    return NextResponse.json(
      { error: "Internal onboarding error" },
      { status: 500 }
    );
  }
}
