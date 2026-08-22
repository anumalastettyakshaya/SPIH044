"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { athletes } from "@/data/athletes";
import { useApp } from "@/context/AppContext";
import { getCompatibility, compatibilityBlurb } from "@/utils/compatibility";
import CompatibilityScore from "@/components/CompatibilityScore";
import PostCard from "@/components/PostCard";

export default function ProfileDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { profile, getConnectionState, sendRequest, acceptRequest, posts } = useApp();

  const athlete = athletes.find((a) => a.id === params.id);

  if (!athlete) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="font-display text-2xl text-ink">Profile not found</p>
        <p className="mt-2 text-sm text-muted">This athlete may have been removed or the link is incorrect.</p>
        <Link href="/discover" className="mt-6 inline-block rounded-full bg-court px-6 py-2.5 text-sm font-semibold text-paper">
          Back to Discover
        </Link>
      </main>
    );
  }

  const compatibility = getCompatibility(profile, athlete);
  const connection = getConnectionState(athlete.id);
  const theirPosts = posts.filter((p) => p.authorId === athlete.id).slice(0, 6);
  const preview = athletes.filter((a) => a.id !== athlete.id).slice(0, 6);

  return (
    <main className="pb-16">
      <div className="relative h-40 bg-gradient-to-r from-court to-ink sm:h-52" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <button onClick={() => router.back()} className="mt-4 text-xs font-semibold text-muted hover:text-court">
          ← Back
        </button>

        <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-paper text-2xl font-bold text-paper"
              style={{ backgroundColor: athlete.accent }}
            >
              {athlete.avatarInitials}
            </div>
            <div className="pb-1">
              <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {athlete.name}
                {athlete.verified && <span className="ml-2 text-base text-court">✓</span>}
              </h1>
              <p className="text-sm text-muted">
                {athlete.userType === "Organizer"
                  ? "Organizer / Venue"
                  : `${athlete.sport} ${athlete.userType}`}
                {athlete.userType === "Player" ? ` · ${athlete.skillLevel}` : ""}
              </p>
              <p className="text-sm text-muted">{athlete.city}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-5 text-sm">
          <span>
            <strong className="font-mono">{athlete.rating.toFixed(1)}</strong> Sports Rating
          </span>
          <span>
            <strong className="font-mono">{athlete.achievements.length}</strong> Achievements
          </span>
          {athlete.experienceYears && (
            <span>
              <strong className="font-mono">{athlete.experienceYears}</strong> yrs experience
            </span>
          )}
          {athlete.studentsCoached && (
            <span>
              <strong className="font-mono">{athlete.studentsCoached}</strong> students
            </span>
          )}
          {athlete.eventsHosted && (
            <span>
              <strong className="font-mono">{athlete.eventsHosted}</strong> events hosted
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {connection === "none" && (
            <>
              <button onClick={() => sendRequest(athlete.id)} className="rounded-full bg-court px-6 py-2.5 text-sm font-semibold text-paper">
                Connect
              </button>
              <a href="#compat" className="rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-ink">
                View Compatibility
              </a>
            </>
          )}
          {connection === "sent" && (
            <>
              <div className="rounded-full bg-whistle/10 px-6 py-2.5 text-sm font-semibold text-whistle">Request Sent ✓</div>
              <button onClick={() => acceptRequest(athlete.id)} className="rounded-full border border-court px-5 py-2.5 text-sm font-semibold text-court">
                Simulate: Accept Request
              </button>
            </>
          )}
          {connection === "incoming" && (
            <button onClick={() => acceptRequest(athlete.id)} className="rounded-full bg-court px-6 py-2.5 text-sm font-semibold text-paper">
              Accept request
            </button>
          )}
          {connection === "accepted" && (
            <>
              <div className="rounded-full bg-volt/30 px-6 py-2.5 text-sm font-semibold text-court-dark">Connected ✓</div>
              <Link href={`/messages?with=${athlete.id}`} className="rounded-full bg-court px-6 py-2.5 text-sm font-semibold text-paper">
                Message
              </Link>
            </>
          )}
        </div>
        {connection === "sent" && (
          <p className="mt-2 text-xs text-muted">Demo control — simulates the other side accepting. Chat stays locked until then.</p>
        )}
        {connection !== "accepted" && connection !== "sent" && (
          <p className="mt-2 text-xs text-muted">Messaging unlocks after your connection request is accepted.</p>
        )}

        <section className="mt-8 rounded-card border border-line bg-white/80 p-6 shadow-card">
          <h2 className="font-display text-xl">About</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/80">{athlete.bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Tag>{athlete.userType}</Tag>
            <Tag>{athlete.sport}</Tag>
            <Tag>{athlete.skillLevel}</Tag>
            {(athlete.sports ?? []).filter((s) => s !== athlete.sport).map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-card border border-line bg-white/80 p-6 shadow-card">
          <h2 className="font-display text-xl">Achievements</h2>
          <ul className="mt-3 space-y-2">
            {athlete.achievements.map((a, i) => (
              <li key={i} className="rounded-2xl bg-paper px-4 py-3 text-sm text-ink">
                {a}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-card border border-line bg-white/80 p-6 shadow-card">
          <h2 className="font-display text-xl">Sports & skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Tag>
              {athlete.sport} · {athlete.skillLevel}
            </Tag>
            {athlete.fitnessLevel && <Tag>Fitness · {athlete.fitnessLevel}</Tag>}
            {athlete.preferredMatchType && <Tag>{athlete.preferredMatchType}</Tag>}
            {athlete.availability && <Tag>{athlete.availability}</Tag>}
          </div>
        </section>

        <div id="compat" className="mt-6">
          <CompatibilityScore result={compatibility} size="lg" />
          <p className="mt-2 text-xs text-muted">{compatibilityBlurb(compatibility)} AI-powered compatibility prototype — deterministic rules, not a trained ML model.</p>
        </div>

        <section className="mt-6 rounded-card border border-line bg-white/80 p-6 shadow-card">
          <h2 className="font-display text-xl">Recent posts</h2>
          <div className="mt-4 space-y-4">
            {theirPosts.length === 0 && <p className="text-sm text-muted">No public posts yet.</p>}
            {theirPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-card border border-line bg-white/80 p-6 shadow-card">
          <h2 className="font-display text-xl">Connections preview</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {preview.map((a) => (
              <Link key={a.id} href={`/profile/${a.id}`} className="text-center">
                <span
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-paper"
                  style={{ backgroundColor: a.accent }}
                >
                  {a.avatarInitials}
                </span>
                <p className="mt-1 truncate text-[11px] font-medium">{a.name.split(" ")[0]}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-court/10 px-3 py-1 text-[11px] font-semibold text-court">{children}</span>;
}
