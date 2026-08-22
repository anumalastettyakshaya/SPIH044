"use client";

import Link from "next/link";
import { Athlete } from "@/types";
import { useApp } from "@/context/AppContext";
import { getCompatibility } from "@/utils/compatibility";
import CompatibilityScore from "./CompatibilityScore";
import ConnectButton from "./ConnectButton";

const SKILL_STYLES: Record<string, string> = {
  Beginner: "bg-court/10 text-court",
  Intermediate: "bg-whistle/10 text-whistle",
  Advanced: "bg-ink text-volt",
};

export default function AthleteCard({ athlete }: { athlete: Athlete }) {
  const { profile } = useApp();
  const compatibility = getCompatibility(profile, athlete);
  const isCoach = athlete.userType === "Coach";
  const isOrg = athlete.userType === "Organizer";

  return (
    <div className="group flex flex-col rounded-card border border-line bg-white/60 p-5 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-pop">
      <div className="flex items-start justify-between">
        <Link href={`/profile/${athlete.id}`} className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-paper"
            style={{ backgroundColor: athlete.accent }}
          >
            {athlete.avatarInitials}
          </div>
          <div>
            <p className="font-display text-base leading-tight text-ink">
              {athlete.name}
              {athlete.verified && <span className="ml-1 text-court" title="Verified">✓</span>}
            </p>
            <p className="text-xs text-muted">{athlete.city}</p>
          </div>
        </Link>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${SKILL_STYLES[athlete.skillLevel]}`}>
          {isOrg ? "Venue" : athlete.skillLevel}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="rounded-full bg-court/10 px-2.5 py-1 font-medium text-court">{athlete.sport}</span>
        {athlete.sports?.slice(1).map((s) => (
          <span key={s} className="rounded-full bg-paper px-2.5 py-1 font-medium">{s}</span>
        ))}
        <span className="flex items-center gap-1">
          ★ <span className="font-semibold text-ink">{athlete.rating.toFixed(1)}</span>
        </span>
      </div>

      {isCoach && (
        <p className="mt-2 text-xs text-muted">
          {athlete.experienceYears ?? athlete.yearsExperience ?? 0} yrs experience
          {athlete.studentsCoached ? ` · ${athlete.studentsCoached} students coached` : ""}
        </p>
      )}
      {isOrg && (
        <p className="mt-2 text-xs text-muted">
          {athlete.eventsHosted ?? 0} events hosted
          {athlete.verified ? " · Verified venue" : ""}
        </p>
      )}
      {!isCoach && !isOrg && (
        <p className="mt-2 text-xs text-muted">{athlete.achievements.length} achievements</p>
      )}

      <p className="mt-3 line-clamp-2 text-sm text-ink/70">{athlete.bio}</p>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <CompatibilityScore result={compatibility} size="sm" />
        <Link href={`/profile/${athlete.id}`} className="text-xs font-semibold text-court hover:underline">
          View Profile →
        </Link>
      </div>

      <div className="mt-4">
        <ConnectButton athleteId={athlete.id} />
      </div>
    </div>
  );
}
