"use client";

import Link from "next/link";
import { SportEvent } from "@/types";
import { useApp } from "@/context/AppContext";
import { canJoinEvents } from "@/utils/roles";

export default function EventCard({
  event,
  mode = "player",
}: {
  event: SportEvent;
  mode?: "player" | "organizer";
}) {
  const { joinEvent, isJoined, profile } = useApp();
  const joined = isJoined(event.id);
  const full = event.participants >= event.maxPlayers;
  const isPlayer = profile?.role === "player";
  const showJoin = mode === "player" && isPlayer && canJoinEvents(profile?.role);

  return (
    <div className="flex flex-col justify-between rounded-card border border-line bg-white/80 p-5 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-pop">
      <div>
        <div className="flex items-start justify-between">
          <span className="rounded-full bg-court/10 px-3 py-1 text-xs font-bold text-court">
            {event.sport}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            {event.skillLevel}
          </span>
        </div>

        {mode === "organizer" && (
          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-court">
            Your Hosted Event
          </p>
        )}

        <h3 className="mt-3 font-display text-xl font-bold leading-snug text-ink">
          {event.name}
        </h3>
        <p className="mt-1 text-xs text-muted flex items-center gap-1">
          📍 {event.location}
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-ink/80">
          <span className="font-mono font-bold text-court">{event.date}</span>
          <span className="text-line">·</span>
          <span className="font-mono text-muted">{event.time}</span>
        </div>

        {event.description && (
          <p className="mt-3 line-clamp-2 text-xs text-ink/70">
            {event.description}
          </p>
        )}
      </div>

      <div className="mt-5 border-t border-line/60 pt-4">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>By <strong className="text-ink">{event.organizer}</strong></span>
          <span className="font-semibold text-ink">
            {event.participants} {event.participants === 1 ? "player" : "players"} joined
          </span>
        </div>

        <div className={`mt-4 grid gap-2 ${showJoin ? "grid-cols-2" : "grid-cols-1"}`}>
          <Link
            href={`/events/${event.id}`}
            className="rounded-full border border-line py-2 text-center text-xs font-semibold text-ink hover:border-court/60 hover:text-court"
          >
            {mode === "organizer" ? "Manage / Edit" : "View Details"}
          </Link>

          {showJoin && (
            <button
              onClick={() => joinEvent(event.id)}
              disabled={joined || full}
              className={`rounded-full py-2 text-xs font-bold transition-all ${
                joined
                  ? "cursor-default bg-court/15 text-court"
                  : full
                  ? "cursor-not-allowed bg-line text-muted"
                  : "bg-court text-paper shadow-sm hover:bg-court-dark"
              }`}
            >
              {joined ? "Joined ✓" : full ? "Full" : "Join Event"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
