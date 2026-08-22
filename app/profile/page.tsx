"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { initialsFromName } from "@/utils/user";
import { ALL_SPORTS, PLAYER_LEVELS, SkillLevel, Sport } from "@/types";

export default function MyProfilePage() {
  const {
    profile,
    sessionUsername,
    updateProfile,
    logout,
    events,
    showToast,
  } = useApp();
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);

  if (!profile) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="font-display text-2xl font-bold text-ink">No active sports profile.</p>
        <p className="mt-2 text-sm text-muted">Log in or create an account to view your profile.</p>
        <Link
          href="/auth"
          className="mt-6 inline-block rounded-full bg-court px-6 py-3 text-sm font-semibold text-paper hover:bg-court-dark"
        >
          Go to Login / Sign Up
        </Link>
      </main>
    );
  }

  const roleTitle =
    profile.role === "organizer"
      ? "Organizer / Court Owner"
      : profile.role === "coach"
      ? "Sports Coach"
      : "Sports Player";

  const sportsList: Sport[] = (profile.sports?.length ? profile.sports : profile.sport ? [profile.sport] : ["Cricket"]) as Sport[];
  const playerLevel: SkillLevel = (profile.skillLevel || (profile.role === "player" ? "Intermediate" : "Advanced")) as SkillLevel;

  const hosted = events.filter(
    (e) =>
      e.ownerUsername === sessionUsername ||
      e.organizer === profile.organization ||
      e.organizer === profile.name ||
      e.organizerId === "me"
  );

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Header Profile Info (No blank green banner) */}
      <div className="flex flex-col gap-6 rounded-card border border-line bg-white/90 p-6 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-court text-2xl font-bold text-volt shadow-sm sm:h-24 sm:w-24 sm:text-3xl">
            {initialsFromName(profile.name || profile.username)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {profile.name || profile.username}
              </h1>
              <span className="rounded-full bg-court/10 px-2.5 py-0.5 text-xs font-bold text-court" title="Verified Athlete">
                Verified ✓
              </span>
            </div>
            <p className="text-xs font-mono text-muted">@{profile.username || sessionUsername}</p>
            <p className="mt-1 text-sm font-semibold text-court">{roleTitle}</p>
            <p className="text-xs text-muted">{profile.city || "Hyderabad"}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setEditOpen(true)}
            className="rounded-full bg-court px-6 py-2.5 text-sm font-semibold text-paper shadow-sm transition-all hover:bg-court-dark"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Role & Level Badges */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-card border border-line bg-white/80 p-5 shadow-card">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-court">Account Role</p>
          <p className="mt-1 font-display text-lg font-bold text-ink uppercase tracking-wide">
            {profile.role}
          </p>
        </div>

        <div className="rounded-card border border-line bg-white/80 p-5 shadow-card">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-court">Player Level</p>
          <p className="mt-1 font-display text-lg font-bold text-ink">
            {playerLevel}
          </p>
        </div>

        <div className="rounded-card border border-line bg-white/80 p-5 shadow-card">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-court">Sports</p>
          <p className="mt-1 font-display text-lg font-bold text-ink truncate">
            {sportsList.join(", ")}
          </p>
        </div>
      </div>

      {/* About Me Section */}
      <section className="mt-6 rounded-card border border-line bg-white/80 p-6 shadow-card sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink">About Me</h2>
          <button
            onClick={() => setEditOpen(true)}
            className="text-xs font-semibold text-court hover:underline"
          >
            Edit
          </button>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink/85">
          {profile.bio || "Competitive badminton player looking for tournaments and people to play with."}
        </p>

        <div className="mt-6 border-t border-line pt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Selected Sports</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {sportsList.map((sport) => (
              <span
                key={sport}
                className="rounded-full bg-court/10 px-4 py-1.5 text-xs font-bold text-court"
              >
                {sport} · {playerLevel}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Organizer Specific Events Section */}
      {profile.role === "organizer" && (
        <section className="mt-6 rounded-card border border-line bg-white/80 p-6 shadow-card sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ink">My Hosted Events ({hosted.length})</h2>
            <Link
              href="/events"
              className="rounded-full bg-court px-4 py-1.5 text-xs font-semibold text-paper hover:bg-court-dark"
            >
              Create New Event
            </Link>
          </div>
          {hosted.length === 0 ? (
            <p className="mt-4 text-sm text-muted">You have not created any events yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {hosted.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-wrap items-center justify-between rounded-xl border border-line bg-paper/60 p-4"
                >
                  <div>
                    <Link href={`/events/${e.id}`} className="font-display text-base font-bold text-ink hover:text-court">
                      {e.name}
                    </Link>
                    <p className="text-xs text-muted">
                      {e.sport} · {e.location} · {e.date}
                    </p>
                  </div>
                  <Link
                    href={`/events/${e.id}`}
                    className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink hover:border-court"
                  >
                    Edit / Manage
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Prominent Working Logout Button */}
      <section className="mt-10 rounded-card border border-whistle/20 bg-whistle/5 p-6 text-center shadow-card">
        <h3 className="font-display text-lg font-bold text-ink">Account Session</h3>
        <p className="mt-1 text-xs text-muted">
          Signed in as <strong className="text-ink">{profile.username || sessionUsername}</strong> ({profile.role.toUpperCase()})
        </p>
        <button
          onClick={handleLogout}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-whistle px-8 py-3.5 text-sm font-bold text-paper shadow-pop transition-transform hover:-translate-y-0.5 hover:bg-whistle/90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Logout of SportSphere
        </button>
      </section>

      {/* Edit Profile Modal */}
      {editOpen && (
        <EditProfileModal
          initialUsername={profile.username || sessionUsername || ""}
          initialAbout={profile.bio || "Competitive badminton player looking for tournaments and people to play with."}
          initialSports={sportsList}
          initialLevel={playerLevel}
          onClose={() => setEditOpen(false)}
          onSave={async (updated) => {
            await updateProfile({
              username: updated.username,
              name: updated.username,
              bio: updated.aboutMe,
              sports: updated.sports,
              sport: updated.sports[0] || "Cricket",
              skillLevel: updated.playerLevel,
            });
            showToast("Profile synchronized with backend ✓");
            setEditOpen(false);
          }}
        />
      )}
    </main>
  );
}

function EditProfileModal({
  initialUsername,
  initialAbout,
  initialSports,
  initialLevel,
  onClose,
  onSave,
}: {
  initialUsername: string;
  initialAbout: string;
  initialSports: Sport[];
  initialLevel: SkillLevel;
  onClose: () => void;
  onSave: (data: {
    username: string;
    aboutMe: string;
    sports: Sport[];
    playerLevel: SkillLevel;
  }) => Promise<void>;
}) {
  const [username, setUsername] = useState(initialUsername);
  const [aboutMe, setAboutMe] = useState(initialAbout);
  const [selectedSports, setSelectedSports] = useState<Sport[]>(initialSports);
  const [playerLevel, setPlayerLevel] = useState<SkillLevel>(initialLevel);
  const [saving, setSaving] = useState(false);

  const toggleSport = (s: Sport) => {
    if (selectedSports.includes(s)) {
      if (selectedSports.length > 1) {
        setSelectedSports(selectedSports.filter((item) => item !== s));
      }
    } else {
      setSelectedSports([...selectedSports, s]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setSaving(true);
    await onSave({
      username: username.trim(),
      aboutMe: aboutMe.trim(),
      sports: selectedSports,
      playerLevel,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-card border border-line bg-paper p-6 shadow-pop sm:p-8">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-bold text-ink">Edit Profile</h3>
          <button onClick={onClose} className="text-muted hover:text-ink text-xl font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-ink/70">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-medium outline-none focus:border-court"
              required
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-ink/70">Player Level</span>
            <select
              value={playerLevel}
              onChange={(e) => setPlayerLevel(e.target.value as SkillLevel)}
              className="mt-1 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-medium outline-none focus:border-court"
            >
              {PLAYER_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </label>

          <div>
            <span className="text-xs font-semibold text-ink/70">Select Sports</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALL_SPORTS.map((s) => {
                const active = selectedSports.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSport(s)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? "bg-court text-paper"
                        : "border border-line bg-white text-ink/70 hover:border-court/40"
                    }`}
                  >
                    {s} {active ? "✓" : "+"}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-ink/70">About Me</span>
            <textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              rows={4}
              placeholder="Tell other athletes and organizers about yourself..."
              className="mt-1 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm leading-relaxed outline-none focus:border-court resize-none"
              required
            />
          </label>

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-muted hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-court px-7 py-2.5 text-sm font-semibold text-paper shadow-pop hover:bg-court-dark disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
