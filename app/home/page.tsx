"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { initialsFromName } from "@/utils/user";
import PostComposer from "@/components/Composer";
import PostCard from "@/components/PostCard";
import { resolveAuthor } from "@/components/Avatar";
import { canJoinEvents } from "@/utils/roles";

export default function HomeFeedPage() {
  const { profile, posts, events, connectionCount, sessionUsername } = useApp();

  const sports = useMemo(() => {
    return profile?.sports?.length ? profile.sports : profile?.sport ? [profile.sport] : ["Cricket"];
  }, [profile]);

  const feed = useMemo(() => {
    return posts.filter((p) => {
      if (p.authorId === "me") return true;
      const author = resolveAuthor(p.authorId, profile);
      if (!author) return false;
      if (profile?.role === "organizer") {
        return p.type === "event" || author.userType === "Organizer";
      }
      if (profile?.role === "coach") {
        return author.userType === "Player" || author.userType === "Coach" || p.type === "training";
      }
      const sportMatch =
        sports.includes(author.sport) ||
        (author.sports ?? []).some((s) => sports.includes(s)) ||
        (p.eventInfo && events.find((e) => e.id === p.eventInfo?.eventId && sports.includes(e.sport)));
      return Boolean(sportMatch) || p.type === "general";
    });
  }, [posts, profile, sports, events]);

  const availableEvents = useMemo(() => {
    return events
      .filter((e) => e.ownerUsername !== sessionUsername)
      .slice(0, 3);
  }, [events, sessionUsername]);

  const organizerEvents = useMemo(() => {
    return events
      .filter((e) => e.ownerUsername === sessionUsername || e.organizerId === "me")
      .slice(0, 3);
  }, [events, sessionUsername]);

  if (!profile) return null;

  const playerLevel = profile.skillLevel || (profile.role === "player" ? "Intermediate" : "Advanced");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)_280px]">
        {/* Left Sidebar: Profile Summary */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-card border border-line bg-white/90 shadow-card">
            <div className="px-5 pb-5 pt-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-court text-xl font-bold text-volt">
                {initialsFromName(profile.name || profile.username)}
              </div>
              <p className="mt-3 font-display text-lg font-bold text-ink">
                {profile.name || profile.username}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-court">
                {profile.role} · {playerLevel}
              </p>
              <p className="mt-1 text-xs text-muted">
                📍 {profile.city || "Hyderabad"}
              </p>
              <p className="mt-2 text-xs text-muted font-medium">
                Sports: {sports.join(", ")}
              </p>
              <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-ink/75">
                {profile.bio || "Sports enthusiast on SportSphere."}
              </p>
              <div className="mt-4 border-t border-line pt-3 text-center">
                <Link
                  href="/profile"
                  className="block w-full rounded-full border border-line py-2 text-center text-xs font-semibold text-court transition-colors hover:border-court/40 hover:bg-court/5"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Center Feed */}
        <section className="space-y-5">
          <div className="rounded-card border border-line bg-white/70 p-4 shadow-sm">
            <h1 className="font-display text-2xl font-bold text-ink">
              {profile.role === "player" && "Player Community Feed"}
              {profile.role === "coach" && "Coaches & Training Feed"}
              {profile.role === "organizer" && "Organizer & Events Feed"}
            </h1>
            <p className="text-xs text-muted">
              Connect with local sports members and stay updated on activities.
            </p>
          </div>

          <PostComposer compact />

          <div className="space-y-4">
            {feed.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>

        {/* Right Sidebar: Role-Tailored Events Widget */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-line bg-white/90 p-5 shadow-card">
            <p className="text-[10px] font-bold uppercase tracking-widest text-court">Active Sports</p>
            <p className="mt-1.5 text-sm font-semibold text-ink">{sports.join(", ")}</p>
          </div>

          {/* Player: Joinable Events */}
          {canJoinEvents(profile.role) && (
            <div className="rounded-card border border-line bg-white/90 p-5 shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-court">Upcoming Events</p>
                <Link href="/events" className="text-xs font-semibold text-court hover:underline">
                  View All →
                </Link>
              </div>
              <ul className="mt-3 space-y-3">
                {availableEvents.length === 0 ? (
                  <li className="text-xs text-muted">No events currently scheduled.</li>
                ) : (
                  availableEvents.map((e) => (
                    <li key={e.id} className="rounded-xl border border-line/60 bg-paper/40 p-3">
                      <Link href={`/events/${e.id}`} className="block">
                        <p className="text-xs font-bold text-ink hover:text-court">{e.name}</p>
                        <p className="mt-0.5 text-[11px] text-muted">
                          {e.sport} · {e.date}
                        </p>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {/* Organizer: My Events Widget */}
          {profile.role === "organizer" && (
            <div className="rounded-card border border-line bg-white/90 p-5 shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-court">My Events</p>
                <Link href="/events" className="text-xs font-semibold text-court hover:underline">
                  Manage →
                </Link>
              </div>
              <ul className="mt-3 space-y-3">
                {organizerEvents.length === 0 ? (
                  <li className="text-xs text-muted">You haven't created any events yet.</li>
                ) : (
                  organizerEvents.map((e) => (
                    <li key={e.id} className="rounded-xl border border-line/60 bg-paper/40 p-3">
                      <Link href={`/events/${e.id}`} className="block">
                        <p className="text-xs font-bold text-ink hover:text-court">{e.name}</p>
                        <p className="mt-0.5 text-[11px] text-muted">
                          {e.sport} · {e.participants} joined
                        </p>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
              <Link
                href="/events?create=1"
                className="mt-4 block w-full rounded-full bg-court py-2 text-center text-xs font-semibold text-paper shadow-sm hover:bg-court-dark"
              >
                + Create Event
              </Link>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
