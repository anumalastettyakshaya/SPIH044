"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { athletes } from "@/data/athletes";
import { useApp } from "@/context/AppContext";

function ChatContent() {
  const params = useSearchParams();
  const { connections, messages, sendMessage } = useApp();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const withId = params.get("with");
  const requestedNotConnected = Boolean(withId && connections[withId] !== "accepted");

  const connected = athletes.filter((a) => connections[a.id] === "accepted");

  useEffect(() => {
    if (withId && connections[withId] === "accepted") {
      setActiveId(withId);
    } else if (connected.length > 0 && !activeId) {
      setActiveId(connected[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, connections]);

  const activeAthlete = athletes.find((a) => a.id === activeId);
  const thread = activeId ? messages[activeId] ?? [] : [];

  const handleSend = () => {
    if (!activeId || !draft.trim()) return;
    sendMessage(activeId, draft.trim());
    setDraft("");
  };

  if (requestedNotConnected && connected.length === 0) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <p className="font-display text-2xl text-ink">Chat is locked</p>
        <p className="mt-2 text-sm text-muted">
          Messaging unlocks after your connection request is accepted.
        </p>
        <Link href={withId ? `/profile/${withId}` : "/network"} className="mt-6 rounded-full bg-court px-6 py-2.5 text-sm font-semibold text-paper">
          View profile
        </Link>
      </main>
    );
  }

  if (connected.length === 0) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <p className="font-display text-2xl text-ink">No chats yet</p>
        <p className="mt-2 text-sm text-muted">
          Messaging unlocks after your connection request is accepted.
        </p>
        <Link href="/discover" className="mt-6 rounded-full bg-court px-6 py-2.5 text-sm font-semibold text-paper hover:bg-court-dark">
          Find people to connect with
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-court">Messages</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">Your conversations</h1>
      {requestedNotConnected && (
        <p className="mt-3 rounded-card border border-whistle/30 bg-whistle/10 px-4 py-3 text-sm text-whistle">
          Messaging unlocks after your connection request is accepted.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 overflow-hidden rounded-card border border-line shadow-card sm:grid-cols-[280px_1fr]">
        <aside className="border-b border-line bg-white/70 sm:border-b-0 sm:border-r">
          {connected.map((a) => {
            const last = (messages[a.id] ?? [])[(messages[a.id] ?? []).length - 1];
            return (
              <button
                key={a.id}
                onClick={() => setActiveId(a.id)}
                className={`flex w-full items-center gap-3 border-b border-line px-4 py-3.5 text-left transition-colors ${
                  activeId === a.id ? "bg-court/10" : "hover:bg-court/5"
                }`}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-paper"
                  style={{ backgroundColor: a.accent }}
                >
                  {a.avatarInitials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{a.name}</p>
                  <p className="truncate text-xs text-muted">{last?.text ?? `${a.sport} · ${a.city}`}</p>
                </div>
              </button>
            );
          })}
        </aside>

        <section className="flex h-[520px] flex-col bg-paper">
          {activeAthlete ? (
            <>
              <div className="flex items-center gap-3 border-b border-line bg-white/70 px-5 py-3.5">
                <Link href={`/profile/${activeAthlete.id}`} className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-paper"
                    style={{ backgroundColor: activeAthlete.accent }}
                  >
                    {activeAthlete.avatarInitials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{activeAthlete.name}</p>
                    <p className="text-[11px] text-muted">Connected · messaging unlocked</p>
                  </div>
                </Link>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {thread.length === 0 && (
                  <p className="text-center text-xs text-muted">Say hi to {activeAthlete.name.split(" ")[0]} 👋</p>
                )}
                {thread.map((m) => (
                  <div key={m.id} className={`flex ${m.senderId === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.senderId === "me"
                          ? "rounded-br-sm bg-court text-paper"
                          : "rounded-bl-sm bg-white text-ink shadow-card"
                      }`}
                    >
                      <p>{m.text}</p>
                      <p className={`mt-1 text-[10px] ${m.senderId === "me" ? "text-paper/60" : "text-muted"}`}>{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-line bg-white/70 p-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message…"
                  className="flex-1 rounded-full border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-court"
                />
                <button
                  onClick={handleSend}
                  disabled={!draft.trim()}
                  className="rounded-full bg-court px-5 py-2.5 text-sm font-semibold text-paper hover:bg-court-dark disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted">
              Select a conversation
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatContent />
    </Suspense>
  );
}
