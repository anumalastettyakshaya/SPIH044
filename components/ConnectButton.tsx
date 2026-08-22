"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ConnectionState } from "@/types";

export default function ConnectButton({
  athleteId,
  compact = false,
}: {
  athleteId: string;
  compact?: boolean;
}) {
  const { getConnectionState, sendRequest, acceptIncoming, acceptRequest } = useApp();
  const connection = getConnectionState(athleteId);

  const base = compact
    ? "rounded-full px-3.5 py-1.5 text-xs font-semibold"
    : "w-full rounded-full py-2.5 text-sm font-semibold";

  if (connection === "accepted") {
    return (
      <Link
        href={`/messages?with=${athleteId}`}
        className={`${base} inline-flex items-center justify-center bg-volt/30 text-court-dark`}
      >
        Message
      </Link>
    );
  }

  if (connection === "incoming") {
    return (
      <button
        onClick={() => acceptIncoming(athleteId)}
        className={`${base} bg-court text-paper hover:bg-court-dark`}
      >
        Accept request
      </button>
    );
  }

  if (connection === "sent") {
    return (
      <button disabled className={`${base} cursor-default bg-whistle/10 text-whistle`}>
        Request Sent ✓
      </button>
    );
  }

  return (
    <button
      onClick={() => sendRequest(athleteId)}
      className={`${base} bg-court text-paper hover:bg-court-dark`}
    >
      Connect
    </button>
  );
}

export function connectionLabel(state: ConnectionState): string {
  if (state === "accepted") return "Connected ✓";
  if (state === "sent") return "Request Sent ✓";
  if (state === "incoming") return "Wants to connect";
  return "Connect";
}
