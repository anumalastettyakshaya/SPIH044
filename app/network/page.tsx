"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { athletes } from "@/data/athletes";
import { useApp } from "@/context/AppContext";
import ConnectButton from "@/components/ConnectButton";
import { getCompatibility } from "@/utils/compatibility";
import { Sport, UserType } from "@/types";

const SPORTS: Sport[] = ["Cricket", "Football", "Badminton", "Running", "Swimming", "Chess"];
const TYPES: UserType[] = ["Player", "Coach", "Organizer"];

export default function NetworkPage() {
  const {
    profile,
    incomingRequests,
    connections,
    acceptIncoming,
    ignoreIncoming,
    cancelRequest,
    acceptedIds,
  } = useApp();
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState<Sport | "All">("All");
  const [role, setRole] = useState<UserType | "All">("All");

  const incoming = incomingRequests.map((id) => athletes.find((a) => a.id === id)).filter(Boolean);
  const sent = Object.entries(connections)
    .filter(([, st]) => st === "sent")
    .map(([id]) => athletes.find((a) => a.id === id))
    .filter(Boolean);

  const connected = useMemo(() => {
    return acceptedIds
      .map((id) => athletes.find((a) => a.id === id))
      .filter(Boolean)
      .filter((a) => {
        if (!a) return false;
        if (query && !a.name.toLowerCase().includes(query.toLowerCase())) return false;
        if (sport !== "All" && a.sport !== sport && !a.sports?.includes(sport)) return false;
        if (role !== "All" && a.userType !== role) return false;
        return true;
      });
  }, [acceptedIds, query, sport, role]);

  const suggestions = athletes.filter(
    (a) => !acceptedIds.includes(a.id) && connections[a.id] !== "sent" && !incomingRequests.includes(a.id)
  ).slice(0, 6);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-court">My Network</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink">Grow your sports circle.</h1>
      <p className="mt-2 text-sm text-muted">Accept requests, find people, and message after you connect.</p>

      <section className="mt-10">
        <h2 className="font-display text-xl text-ink">Pending connection requests</h2>
        {incoming.length === 0 ? (
          <p className="mt-3 rounded-card border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
            No pending requests right now.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {incoming.map((a) =>
              a ? (
                <div key={a.id} className="flex items-center gap-3 rounded-card border border-line bg-white/80 p-4">
                  <Link href={`/profile/${a.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-paper"
                      style={{ backgroundColor: a.accent }}
                    >
                      {a.avatarInitials}
                    </span>
                    <span>
                      <span className="block font-display text-ink">{a.name}</span>
                      <span className="block text-xs text-muted">
                        {a.sport} {a.userType} · {a.city}
                      </span>
                    </span>
                  </Link>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => acceptIncoming(a.id)}
                      className="rounded-full bg-court px-3 py-1.5 text-xs font-semibold text-paper"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => ignoreIncoming(a.id)}
                      className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl text-ink">People you may know</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((a) => {
            const score = getCompatibility(profile, a);
            return (
              <div key={a.id} className="rounded-card border border-line bg-white/80 p-4 shadow-card">
                <Link href={`/profile/${a.id}`} className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold text-paper"
                    style={{ backgroundColor: a.accent }}
                  >
                    {a.avatarInitials}
                  </span>
                  <span>
                    <span className="block font-display text-ink">{a.name}</span>
                    <span className="block text-xs text-muted">
                      {a.userType} · {a.sport} · {a.city}
                    </span>
                  </span>
                </Link>
                <p className="mt-2 text-xs text-muted">{score.score}% compatible · {score.reasons[0]}</p>
                <div className="mt-3">
                  <ConnectButton athleteId={a.id} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl text-ink">My connections</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            className="rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-court"
          />
          <select value={sport} onChange={(e) => setSport(e.target.value as Sport | "All")} className="rounded-full border border-line bg-white px-3 py-2 text-sm">
            <option value="All">All sports</option>
            {SPORTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select value={role} onChange={(e) => setRole(e.target.value as UserType | "All")} className="rounded-full border border-line bg-white px-3 py-2 text-sm">
            <option value="All">All roles</option>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {connected.map((a) =>
            a ? (
              <Link
                key={a.id}
                href={`/profile/${a.id}`}
                className="rounded-card border border-line bg-white/80 p-4 text-center hover:border-court/40"
              >
                <span
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-paper"
                  style={{ backgroundColor: a.accent }}
                >
                  {a.avatarInitials}
                </span>
                <p className="mt-2 font-display text-sm text-ink">{a.name}</p>
                <p className="text-[11px] text-muted">
                  {a.sport} · {a.city}
                </p>
              </Link>
            ) : null
          )}
        </div>
        {connected.length === 0 && (
          <p className="mt-4 text-sm text-muted">No connections match these filters.</p>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl text-ink">Sent requests</h2>
        {sent.length === 0 ? (
          <p className="mt-3 text-sm text-muted">You have no outgoing requests.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {sent.map((a) =>
              a ? (
                <div key={a.id} className="flex items-center justify-between rounded-card border border-line bg-white/80 px-4 py-3">
                  <Link href={`/profile/${a.id}`}>
                    <p className="font-display text-ink">{a.name}</p>
                    <p className="text-xs text-muted">
                      {a.sport} {a.userType} · Request pending
                    </p>
                  </Link>
                  <button
                    onClick={() => cancelRequest(a.id)}
                    className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:text-whistle"
                  >
                    Cancel Request
                  </button>
                </div>
              ) : null
            )}
          </div>
        )}
      </section>
    </main>
  );
}
