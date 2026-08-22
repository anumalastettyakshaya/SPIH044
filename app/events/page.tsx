"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import EventCard from "@/components/EventCard";
import EventForm from "@/components/EventForm";
import { useApp } from "@/context/AppContext";
import { isOwnEvent } from "@/utils/roles";

function EventsInner() {
  const { events, profile, addEvent, sessionUsername } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const wantCreate = searchParams.get("create") === "1";
  const [formOpen, setFormOpen] = useState(wantCreate);

  useEffect(() => {
    setFormOpen(wantCreate);
  }, [wantCreate]);

  const isOrganizer = profile?.role === "organizer";
  const isCoach = profile?.role === "coach";

  const visibleEvents = useMemo(() => {
    if (isOrganizer) {
      // Organizer: ONLY show their own created events
      return events.filter((e) => isOwnEvent(e, sessionUsername, "organizer"));
    }
    // Player / other: show all available events
    return events;
  }, [events, isOrganizer, sessionUsername]);

  if (isCoach) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="font-display text-2xl font-bold text-ink">Events are for Players and Organizers</p>
        <p className="mt-2 text-sm text-muted">As a coach, discover athletes and manage your training network.</p>
        <Link
          href="/discover"
          className="mt-6 inline-block rounded-full bg-court px-6 py-3 text-sm font-semibold text-paper"
        >
          Go to Discover Players
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-court">
            {isOrganizer ? "Organizer Dashboard" : "Player Events"}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            {isOrganizer ? "My Events" : "Available Sports Events"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isOrganizer
              ? "Create and manage events you organize for your sports community."
              : "Discover matches, tournaments, and sessions. Join with one click."}
          </p>
        </div>

        {/* Organizer ONLY Create Event Button */}
        {isOrganizer && (
          <button
            onClick={() => setFormOpen((v) => !v)}
            className="rounded-full bg-court px-6 py-3 text-sm font-semibold text-paper shadow-pop transition-transform hover:-translate-y-0.5 hover:bg-court-dark"
          >
            {formOpen ? "✕ Close Form" : "+ Create Event"}
          </button>
        )}
      </div>

      {/* Organizer Create Event Form */}
      {formOpen && isOrganizer && (
        <div className="mt-8">
          <EventForm
            onSubmit={async (newEvent) => {
              await addEvent(newEvent);
              setFormOpen(false);
              router.replace("/events");
            }}
          />
        </div>
      )}

      {/* Event Cards Grid */}
      {visibleEvents.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleEvents.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              mode={isOrganizer ? "organizer" : "player"}
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-card border border-dashed border-line bg-white/50 py-16 text-center shadow-sm">
          <p className="font-display text-xl font-bold text-ink">
            {isOrganizer ? "You haven't created any events yet." : "No events available right now."}
          </p>
          <p className="mt-2 text-sm text-muted">
            {isOrganizer
              ? "Click 'Create Event' above to publish your first match or tournament."
              : "Check back later for new matches and sessions."}
          </p>
          {isOrganizer && (
            <button
              onClick={() => setFormOpen(true)}
              className="mt-6 rounded-full bg-court px-6 py-2.5 text-sm font-semibold text-paper hover:bg-court-dark"
            >
              Create Your First Event
            </button>
          )}
        </div>
      )}
    </main>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-muted">Loading events…</div>}>
      <EventsInner />
    </Suspense>
  );
}
