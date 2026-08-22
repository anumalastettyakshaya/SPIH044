"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import EventForm from "@/components/EventForm";
import { canJoinEvents } from "@/utils/roles";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const { events, joinEvent, isJoined, profile, ownsEvent, updateEvent } = useApp();
  const [editing, setEditing] = useState(false);

  const event = events.find((e) => e.id === params.id);

  if (!event) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="font-display text-2xl font-bold text-ink">Event not found</p>
        <p className="mt-2 text-sm text-muted">This event may have been removed or does not exist.</p>
        <Link
          href="/events"
          className="mt-6 inline-block rounded-full bg-court px-6 py-3 text-sm font-semibold text-paper"
        >
          Back to Events
        </Link>
      </main>
    );
  }

  const mine = ownsEvent(event);
  const isPlayer = profile?.role === "player";
  const playerCanJoin = isPlayer && canJoinEvents(profile?.role) && !mine;
  const joined = isJoined(event.id);
  const full = event.participants >= event.maxPlayers;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/events" className="text-xs font-semibold text-muted hover:text-court">
        ← {mine ? "Back to My Events" : "Back to All Events"}
      </Link>

      <div className="mt-4 overflow-hidden rounded-card border border-line bg-white/90 shadow-card">
        {/* Banner Header */}
        <div className="flex h-36 items-end bg-gradient-to-br from-court via-court-dark to-ink p-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-volt px-3 py-1 text-xs font-bold text-court-dark">
              {event.sport}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-paper">
              {event.skillLevel}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {mine && (
            <span className="inline-block rounded-full bg-court/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-court">
              Your Event · Organizer View
            </span>
          )}

          <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            {event.name}
          </h1>

          <div className="mt-4 space-y-1.5 text-sm text-muted">
            <p className="flex items-center gap-2 text-ink">
              <span>📍 Location:</span>
              <strong className="text-ink">{event.location}</strong>
            </p>
            <p className="flex items-center gap-2">
              <span>📅 Date & Time:</span>
              <strong className="text-court font-mono">{event.date} · {event.time}</strong>
            </p>
            <p className="flex items-center gap-2">
              <span>👤 Organized by:</span>
              <strong className="text-ink">{event.organizer}</strong>
            </p>
          </div>

          <div className="mt-6 border-t border-line pt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Event Details</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
              {event.description || "No specific instructions provided. Contact the organizer for equipment and match schedule."}
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-paper p-4">
            <p className="text-xs font-semibold text-ink">
              Registration Status: <strong className="text-court">{event.participants} athletes joined</strong>
            </p>
            {mine && (
              <div className="mt-3">
                <p className="text-xs font-bold text-muted uppercase tracking-wide">Registered Participants:</p>
                <ul className="mt-2 space-y-1 text-xs text-ink/80">
                  {(!event.participantNames || event.participantNames.length === 0) ? (
                    <li className="italic text-muted">No players have joined yet.</li>
                  ) : (
                    event.participantNames.map((name, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-court font-bold">✓</span> {name}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* Player Join Button */}
            {playerCanJoin && (
              <button
                onClick={() => joinEvent(event.id)}
                disabled={joined || full}
                className={`rounded-full px-8 py-3 text-sm font-bold shadow-pop transition-transform hover:-translate-y-0.5 ${
                  joined
                    ? "cursor-default bg-court/15 text-court"
                    : full
                    ? "cursor-not-allowed bg-line text-muted"
                    : "bg-court text-paper hover:bg-court-dark"
                }`}
              >
                {joined ? "You are Registered ✓" : full ? "Event Full" : "Join Event"}
              </button>
            )}

            {/* Organizer Edit Button */}
            {mine && (
              <button
                onClick={() => setEditing((v) => !v)}
                className="rounded-full bg-court px-8 py-3 text-sm font-semibold text-paper shadow-pop hover:bg-court-dark"
              >
                {editing ? "Close Editor" : "Edit Event Details"}
              </button>
            )}
          </div>

          {/* Organizer Inline Editor */}
          {editing && mine && (
            <div className="mt-8 border-t border-line pt-6">
              <EventForm
                initial={event}
                onSubmit={async (updated) => {
                  await updateEvent(event.id, updated);
                  setEditing(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
