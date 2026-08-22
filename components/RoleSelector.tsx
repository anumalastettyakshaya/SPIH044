"use client";

import { Role } from "@/types";

const ROLES: { id: Role; title: string; blurb: string; icon: string }[] = [
  {
    id: "player",
    title: "Player",
    blurb: "Find people at your level, join events, and track your achievements.",
    icon: "M12 2l2.4 6.6L21 9l-5 4.4L17.4 21 12 17.3 6.6 21 8 13.4 3 9l6.6-.4L12 2z",
  },
  {
    id: "coach",
    title: "Coach",
    blurb: "Build a public coaching profile and get discovered by players nearby.",
    icon: "M12 3a4 4 0 100 8 4 4 0 000-8zM4 21a8 8 0 0116 0",
  },
  {
    id: "organizer",
    title: "Organizer / Court Owner",
    blurb: "List courts, matches and tournaments to a matched athlete pool.",
    icon: "M4 21V9l8-6 8 6v12M9 21v-6h6v6",
  },
];

export default function RoleSelector({
  selected,
  onSelect,
}: {
  selected: Role | null;
  onSelect: (role: Role) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {ROLES.map((role) => {
        const active = selected === role.id;
        return (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            className={`group flex flex-col items-start rounded-card border p-6 text-left transition-all duration-300 ${
              active
                ? "border-court bg-court text-paper shadow-pop"
                : "border-line bg-white/60 text-ink hover:-translate-y-1 hover:border-court/40 hover:shadow-card"
            }`}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full ${
                active ? "bg-volt text-court-dark" : "bg-court/10 text-court"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d={role.icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="mt-4 font-display text-lg">{role.title}</p>
            <p className={`mt-1 text-sm ${active ? "text-paper/80" : "text-muted"}`}>{role.blurb}</p>
          </button>
        );
      })}
    </div>
  );
}
