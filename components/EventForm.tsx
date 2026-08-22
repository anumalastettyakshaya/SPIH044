"use client";

import { FormEvent, useState } from "react";
import { ALL_SPORTS, PLAYER_LEVELS, SkillLevel, Sport, SportEvent } from "@/types";

export function EventForm({
  initial,
  onSubmit,
}: {
  initial?: SportEvent;
  onSubmit: (event: SportEvent) => void | Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [sport, setSport] = useState<Sport>(initial?.sport ?? "Cricket");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [time, setTime] = useState(initial?.time ?? "07:00 AM");
  const [skillLevel, setSkillLevel] = useState<SkillLevel | "All Levels">(initial?.skillLevel ?? "All Levels");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim() && location.trim() && date.trim();

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    await onSubmit({
      id: initial?.id ?? `e_${Date.now()}`,
      name: name.trim(),
      sport,
      location: location.trim(),
      date: date.trim(),
      time: time.trim(),
      skillLevel,
      organizer: initial?.organizer ?? "Organizer",
      maxPlayers: initial?.maxPlayers ?? 12,
      participants: initial?.participants ?? 0,
      description: description.trim() || undefined,
      status: initial?.status ?? "open",
      participantNames: initial?.participantNames,
      ownerUsername: initial?.ownerUsername,
    });
    setSubmitting(false);
  };

  return (
    <form
      onSubmit={handle}
      className="animate-rise rounded-card border border-line bg-white/90 p-6 shadow-card sm:p-8"
    >
      <h2 className="font-display text-2xl font-bold text-ink">
        {initial ? "Edit Event" : "Create New Event"}
      </h2>
      <p className="mt-1 text-xs text-muted">
        Fill in the basic event information. Players will see this in their events feed.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold text-ink/70">Event Name *</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Weekend Cricket Cup"
            className="input mt-1"
            required
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-ink/70">Sport *</span>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value as Sport)}
            className="input mt-1"
          >
            {ALL_SPORTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-ink/70">Location *</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Hitech Sports Arena, Hyderabad"
            className="input mt-1"
            required
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-ink/70">Date *</span>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="e.g. Sunday, Oct 12"
            className="input mt-1"
            required
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-ink/70">Time</span>
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 07:00 AM"
            className="input mt-1"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-ink/70">Skill Level</span>
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value as SkillLevel | "All Levels")}
            className="input mt-1"
          >
            <option value="All Levels">All Levels</option>
            {PLAYER_LEVELS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold text-ink/70">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Details about format, rules, gear required..."
            className="input mt-1 resize-none"
          />
        </label>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="rounded-full bg-court px-8 py-3 text-sm font-semibold text-paper shadow-pop hover:bg-court-dark disabled:opacity-40"
        >
          {submitting ? "Saving…" : initial ? "Save Changes" : "Publish Event"}
        </button>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid #E4E2D8;
          background: white;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: #101815;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: #1B4332;
        }
      `}</style>
    </form>
  );
}
export default EventForm;
