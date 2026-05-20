import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getCircleClient,
  getArcWallet,
  newIdempotencyKey,
} from "@/lib/circle-server";

const COOKIE_NAME = "claimr_session";

function decodeSession(value: string): { userId?: string } | null {
  try {
    return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function isHex40(s: unknown): s is string {
  return typeof s === "string" && /^0x[0-9a-fA-F]{40}$/.test(s);
}

function isValidSignature(s: unknown): s is string {
  // e.g. "claimJob(uint256)" or "approve(address,uint256)"
  return typeof s === "string" && /^[a-zA-Z_][a-zA-Z0-9_]*\([^)]*\)$/.test(s);
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (!cookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const session = decodeSession(cookie.value);
    if (!session?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const contractAddress = body?.contractAddress;
    const abiFunctionSignature = body?.abiFunctionSignature;
    const abiParameters = body?.abiParameters;

    if (!isHex40(contractAddress)) {
      return NextResponse.json(
        { error: "Invalid contractAddress" },
        { status: 400 }
      );
    }
    if (!isValidSignature(abiFunctionSignature)) {
      return NextResponse.json(
        { error: "Invalid abiFunctionSignature" },
        { status: 400 }
      );
    }
    if (!Array.isArray(abiParameters)) {
      return NextResponse.json(
        { error: "abiParameters must be an array" },
        { status: 400 }
      );
    }

    const client = getCircleClient();

    // Issue a fresh user token. We use it both server-side to create the
    // challenge and return it to the client so the SDK can execute the
    // challenge using the same session.
    const tokenResp = await client.createUserToken({ userId: session.userId });
    const userToken = tokenResp.data?.userToken;
    const encryptionKey = tokenResp.data?.encryptionKey;
    if (!userToken || !encryptionKey) {
      return NextResponse.json(
        { error: "Could not issue session token" },
        { status: 500 }
      );
    }

    // Look up the user's Arc wallet to get walletId.
    const wallet = await getArcWallet(userToken);
    if (!wallet?.id) {
      return NextResponse.json(
        { error: "No Arc wallet found for user" },
        { status: 400 }
      );
    }

    // Create the contract-execution challenge. Arc pays gas in USDC; "MEDIUM"
    // is the default fee level and works well for testnet.
    const execResp = await client.createContractExecutionTransaction({
      userToken,
      walletId: wallet.id,
      contractAddress,
      abiFunctionSignature,
      abiParameters,
      fee: { type: "level", config: { feeLevel: "MEDIUM" } },
      idempotencyKey: newIdempotencyKey(),
    } as any);

    const challengeId = execResp.data?.challengeId;
    const transactionId = (execResp.data as any)?.id ?? null;
    if (!challengeId) {
      console.error(
        "[CIRCLE/tx/contract-execution] no challengeId returned",
        execResp.data
      );
      return NextResponse.json(
        { error: "Could not create transaction challenge" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      challengeId,
      transactionId,
      userToken,
      encryptionKey,
    });
  } catch (err: any) {
    console.error("[CIRCLE/tx/contract-execution] FATAL", err);
    // Surface Circle's error message when available, scrubbed of internals.
    const upstream = err?.response?.data?.message;
    return NextResponse.json(
      { error: upstream ?? "Could not create transaction" },
      { status: 500 }
    );
  }
}
