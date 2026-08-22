"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "@/types";
import { useApp } from "@/context/AppContext";
import { resolveAuthor, Avatar } from "./Avatar";

const TYPE_LABEL: Record<string, string> = {
  general: "Update",
  achievement: "Achievement",
  match: "Match Result",
  training: "Training",
  event: "Event",
  photo: "Photo",
};

export default function PostCard({ post }: { post: Post }) {
  const { profile, toggleLike, addComment, sharePost, joinEvent, isJoined } = useApp();
  const [openComments, setOpenComments] = useState(false);
  const [draft, setDraft] = useState("");
  const author = resolveAuthor(post.authorId, profile);
  if (!author) return null;

  const href = post.authorId === "me" ? "/profile" : `/profile/${author.id}`;
  const eventId = post.eventInfo?.eventId;
  const joined = eventId ? isJoined(eventId) : false;

  const submitComment = () => {
    if (!draft.trim()) return;
    addComment(post.id, draft.trim());
    setDraft("");
    setOpenComments(true);
  };

  return (
    <article className="rounded-card border border-line bg-white/80 p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <Link href={href} className="flex min-w-0 items-center gap-3">
          <Avatar initials={author.avatarInitials} accent={author.accent} name={author.name} />
          <div className="min-w-0">
            <p className="truncate font-display text-[15px] text-ink">{author.name}</p>
            <p className="truncate text-xs text-muted">
              {author.userType === "Organizer" ? "Organizer / Venue" : `${author.sport} ${author.userType}`}
              {author.userType === "Player" ? ` · ${author.skillLevel}` : ""}
            </p>
          </div>
        </Link>
        <div className="text-right">
          <span className="rounded-full bg-court/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-court">
            {TYPE_LABEL[post.type] ?? post.type}
          </span>
          <p className="mt-1 text-[11px] text-muted">{post.timeLabel}</p>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink/85">{post.text}</p>

      {post.achievement && (
        <div className="mt-4 rounded-2xl border border-volt/60 bg-volt/15 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-court">Achievement</p>
          <p className="mt-0.5 font-display text-sm text-ink">{post.achievement.title}</p>
          {post.achievement.position && (
            <p className="text-xs text-court">{post.achievement.position}</p>
          )}
          {post.achievement.event && post.achievement.event !== post.achievement.title && (
            <p className="text-xs text-muted">{post.achievement.event}</p>
          )}
        </div>
      )}

      {post.match && (
        <div className="mt-4 rounded-2xl border border-line bg-paper px-4 py-3 text-sm">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">Match result</p>
          <p className="mt-1 font-medium text-ink">
            {post.match.score}
            {post.match.opponent ? ` vs ${post.match.opponent}` : ""}
          </p>
        </div>
      )}

      {post.eventInfo && (
        <div className="mt-4 rounded-2xl border border-line bg-paper px-4 py-3">
          <p className="font-display text-sm text-ink">{post.eventInfo.name}</p>
          <p className="mt-1 text-xs text-muted">
            {[post.eventInfo.date, post.eventInfo.location, post.eventInfo.spots].filter(Boolean).join(" · ")}
          </p>
          {eventId && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/events/${eventId}`}
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-court/40"
              >
                View Event
              </Link>
              <button
                onClick={() => joinEvent(eventId)}
                disabled={joined}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  joined ? "bg-volt/30 text-court-dark" : "bg-court text-paper hover:bg-court-dark"
                }`}
              >
                {joined ? "Joined ✓" : "Join Event"}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 border-t border-line pt-3 text-xs text-muted">
        <span>{post.likes} likes</span>
        <span>{post.comments.length} comments</span>
        {post.shares > 0 && <span>{post.shares} shares</span>}
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1">
        <button
          onClick={() => toggleLike(post.id)}
          className={`rounded-full py-2 text-xs font-semibold transition-colors ${
            post.likedByMe ? "bg-whistle/10 text-whistle" : "text-ink/70 hover:bg-paper"
          }`}
        >
          {post.likedByMe ? "Liked" : "Like"}
        </button>
        <button
          onClick={() => setOpenComments((v) => !v)}
          className="rounded-full py-2 text-xs font-semibold text-ink/70 hover:bg-paper"
        >
          Comment
        </button>
        <button
          onClick={() => sharePost(post.id)}
          className="rounded-full py-2 text-xs font-semibold text-ink/70 hover:bg-paper"
        >
          Share
        </button>
      </div>

      {openComments && (
        <div className="mt-3 space-y-2 border-t border-line pt-3">
          {post.comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <Avatar initials={c.authorInitials} accent="#2D6A4F" size="sm" />
              <div className="flex-1 rounded-2xl bg-paper px-3 py-2">
                <p className="text-xs font-semibold text-ink">
                  {c.authorName} <span className="font-normal text-muted">· {c.time}</span>
                </p>
                <p className="text-sm text-ink/80">{c.text}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
              placeholder="Write a comment…"
              className="flex-1 rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-court"
            />
            <button
              onClick={submitComment}
              disabled={!draft.trim()}
              className="rounded-full bg-court px-4 py-2 text-xs font-semibold text-paper disabled:opacity-40"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
