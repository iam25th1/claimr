"use client";

import { useCallback, useRef, useState } from "react";
import { executeChallenge } from "@/lib/circle-client";

// State machine for one write transaction.
//   idle         nothing in flight
//   creating     POST /tx/contract-execution in flight
//   awaitingPin  SDK iframe is open, waiting for user PIN
//   confirming   on-chain, polling /tx/status
//   success      terminal: COMPLETE/CONFIRMED, txHash available
//   error        terminal: FAILED/CANCELLED/DENIED, or any earlier failure
export type CircleWriteStatus =
  | "idle"
  | "creating"
  | "awaitingPin"
  | "confirming"
  | "success"
  | "error";

export interface CircleWriteParams {
  contractAddress: `0x${string}` | string;
  abiFunctionSignature: string;
  abiParameters: Array<string | number | boolean>;
}

interface CircleWriteResult {
  txHash: string | null;
  state: string | null;
}

export interface UseCircleWriteReturn {
  execute: (params: CircleWriteParams) => Promise<CircleWriteResult>;
  reset: () => void;
  status: CircleWriteStatus;
  txHash: string | null;
  error: string | null;
  // Wagmi-shaped compat flags, so existing UI conditionals migrate cleanly.
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export function useCircleWrite(): UseCircleWriteReturn {
  const [status, setStatus] = useState<CircleWriteStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const reset = useCallback(() => {
    setStatus("idle");
    setTxHash(null);
    setError(null);
  }, []);

  const pollStatus = useCallback(
    async (transactionId: string): Promise<CircleWriteResult> => {
      const start = Date.now();
      while (Date.now() - start < POLL_TIMEOUT_MS) {
        const res = await fetch(
          `/api/circle/tx/status?id=${encodeURIComponent(transactionId)}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          throw new Error("Could not check transaction status");
        }
        const data = await res.json();
        // Surface the txHash as soon as Circle has it (typically SENT or later).
        if (data.txHash) setTxHash(data.txHash);

        if (data.isTerminal) {
          if (data.state === "COMPLETE" || data.state === "CONFIRMED") {
            return { txHash: data.txHash ?? null, state: data.state };
          }
          throw new Error(
            data.errorReason ?? `Transaction ${data.state?.toLowerCase()}`
          );
        }

        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      }
      throw new Error("Transaction polling timed out");
    },
    []
  );

  const execute = useCallback(
    async (params: CircleWriteParams): Promise<CircleWriteResult> => {
      if (inFlight.current) {
        throw new Error("A transaction is already in progress");
      }
      inFlight.current = true;
      setError(null);
      setTxHash(null);

      try {
        // 1. Create the contract-execution challenge server-side.
        setStatus("creating");
        const createRes = await fetch("/api/circle/tx/contract-execution", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });
        if (!createRes.ok) {
          const err = await createRes.json().catch(() => ({}));
          throw new Error(err?.error ?? "Could not create transaction");
        }
        const { challengeId, transactionId, userToken, encryptionKey } =
          await createRes.json();
        if (!challengeId || !userToken || !encryptionKey) {
          throw new Error("Incomplete challenge response from server");
        }

        // 2. Open the SDK iframe for PIN entry. Resolves when the user
        //    completes the challenge, rejects if they cancel or error out.
        setStatus("awaitingPin");
        await executeChallenge(challengeId, { userToken, encryptionKey });

        // 3. Poll for terminal state on-chain.
        setStatus("confirming");
        if (!transactionId) {
          // Some edge cases return only challengeId. Without an id we cannot
          // poll, so treat the challenge completion itself as success.
          setStatus("success");
          return { txHash: null, state: null };
        }
        const result = await pollStatus(transactionId);
        setStatus("success");
        return result;
      } catch (err: any) {
        const message = err?.message ?? "Transaction failed";
        setError(message);
        setStatus("error");
        throw err;
      } finally {
        inFlight.current = false;
      }
    },
    [pollStatus]
  );

  return {
    execute,
    reset,
    status,
    txHash,
    error,
    isPending: status === "creating" || status === "awaitingPin",
    isConfirming: status === "confirming",
    isSuccess: status === "success",
    isError: status === "error",
  };
}
