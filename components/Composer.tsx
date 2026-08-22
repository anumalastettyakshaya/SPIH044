"use client";

import { useState } from "react";
import { PostType, Sport } from "@/types";
import { useApp } from "@/context/AppContext";

const TYPES: { id: PostType; label: string }[] = [
  { id: "general", label: "General Update" },
  { id: "achievement", label: "Achievement" },
  { id: "match", label: "Match Result" },
  { id: "training", label: "Training" },
  { id: "event", label: "Event Announcement" },
  { id: "photo", label: "Photo" },
];

export default function PostComposer({ compact = false }: { compact?: boolean }) {
  const { addPost, profile, addEvent } = useApp();
  const [open, setOpen] = useState(!compact);
  const [text, setText] = useState("");
  const [type, setType] = useState<PostType>("general");
  const [achTitle, setAchTitle] = useState("");
  const [achEvent, setAchEvent] = useState("");
  const [achPos, setAchPos] = useState("");
  const [achDate, setAchDate] = useState("");
  const [opponent, setOpponent] = useState("");
  const [score, setScore] = useState("");
  const [evName, setEvName] = useState("");
  const [evLoc, setEvLoc] = useState("");
  const [evDate, setEvDate] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    addPost({
      authorId: "me",
      type,
      text: text.trim(),
      timeLabel: "Just now",
      achievement:
        type === "achievement" && (achTitle || achEvent || achPos)
          ? { title: achTitle || achEvent || "Achievement", event: achEvent, position: achPos }
          : undefined,
      match: type === "match" && (opponent || score) ? { opponent, score } : undefined,
      eventInfo:
        type === "event" && evName
          ? { name: evName, location: evLoc, date: evDate }
          : undefined,
    });
    if (type === "event" && evName && profile?.role === "organizer") {
      addEvent(
        {
          id: `e${Date.now()}`,
          name: evName,
          sport: (profile.sport as Sport) || "Badminton",
          location: evLoc || profile.city,
          date: evDate || "TBD",
          time: "TBD",
          skillLevel: "All Levels",
          organizer: profile.organization || profile.name,
          maxPlayers: 16,
          participants: 0,
          description: text.trim(),
        },
        false
      );
    }
    setText("");
    setAchTitle("");
    setAchEvent("");
    setAchPos("");
    setAchDate("");
    setOpponent("");
    setScore("");
    setEvName("");
    setEvLoc("");
    setEvDate("");
    setType("general");
    if (compact) setOpen(false);
  };

  return (
    <div className="rounded-card border border-line bg-white/80 p-4 shadow-card">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full rounded-full border border-line bg-paper px-4 py-3 text-left text-sm text-muted hover:border-court/30"
        >
          Share your sports journey...
        </button>
      ) : (
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your sports journey..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-court"
          />
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  type === t.id ? "bg-court text-paper" : "bg-paper text-muted hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {type === "achievement" && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input value={achTitle} onChange={(e) => setAchTitle(e.target.value)} placeholder="Achievement title" className="field" />
              <input value={achEvent} onChange={(e) => setAchEvent(e.target.value)} placeholder="Competition / event name" className="field" />
              <input value={achPos} onChange={(e) => setAchPos(e.target.value)} placeholder="Position / result" className="field" />
              <input value={achDate} onChange={(e) => setAchDate(e.target.value)} placeholder="Date" className="field" />
            </div>
          )}
          {type === "match" && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input value={opponent} onChange={(e) => setOpponent(e.target.value)} placeholder="Opponent" className="field" />
              <input value={score} onChange={(e) => setScore(e.target.value)} placeholder="Score / result" className="field" />
            </div>
          )}
          {type === "event" && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input value={evName} onChange={(e) => setEvName(e.target.value)} placeholder="Event name" className="field" />
              <input value={evLoc} onChange={(e) => setEvLoc(e.target.value)} placeholder="Location" className="field" />
              <input value={evDate} onChange={(e) => setEvDate(e.target.value)} placeholder="Date" className="field sm:col-span-2" />
            </div>
          )}

          <div className="flex justify-end gap-2">
            {compact && (
              <button onClick={() => setOpen(false)} className="rounded-full px-4 py-2 text-xs font-semibold text-muted">
                Cancel
              </button>
            )}
            <button
              onClick={submit}
              disabled={!text.trim()}
              className="rounded-full bg-court px-5 py-2 text-sm font-semibold text-paper hover:bg-court-dark disabled:opacity-40"
            >
              Create Post
            </button>
          </div>
        </div>
      )}
      <style>{`
        .field { width: 100%; border-radius: 12px; border: 1px solid #E4E2D8; background: white; padding: 0.55rem 0.85rem; font-size: 0.8rem; outline: none; }
        .field:focus { border-color: #1B4332; }
      `}</style>
    </div>
  );
}
