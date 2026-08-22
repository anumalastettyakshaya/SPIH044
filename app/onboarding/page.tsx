"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RoleSelector from "@/components/RoleSelector";
import { useApp } from "@/context/AppContext";
import { Role, Sport, SkillLevel, PLAYER_LEVELS, ALL_SPORTS } from "@/types";
import { defaultBio } from "@/utils/user";

export default function OnboardingPage() {
  const router = useRouter();
  const { setProfile, sessionUsername } = useApp();
  const [role, setRole] = useState<Role | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [city, setCity] = useState("Hyderabad");
  const [sport, setSport] = useState<Sport>("Cricket");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("Intermediate");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [achievements, setAchievements] = useState("");
  const [organization, setOrganization] = useState("");

  const canSubmit = role && name.trim() && city.trim();

  const handleSubmit = () => {
    if (!role || !canSubmit) return;
    setSubmitting(true);
    setProfile({
      username: sessionUsername || name.trim().toLowerCase(),
      role,
      name: name.trim(),
      city: city.trim(),
      sport,
      sports: [sport],
      skillLevel: role === "player" ? skillLevel : role === "coach" ? "Advanced" : "Intermediate",
      bio: (role === "player" ? bio : undefined) || defaultBio({
        role,
        name: name.trim(),
        city: city.trim(),
        sport,
        organization,
      }),
      experience: role === "coach" ? experience : undefined,
      achievements: role === "coach" ? achievements : undefined,
      organization: role === "organizer" ? organization : undefined,
      rating: 4.8,
      verified: true,
    });

    setTimeout(() => {
      if (role === "organizer") {
        router.push("/events");
      } else {
        router.push("/home");
      }
    }, 400);
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-court">Setup Your Identity</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
          How will you use SportSphere?
        </h1>
        <p className="mt-2 text-sm text-muted">Choose your primary account role.</p>
      </div>

      <div className="mt-10">
        <RoleSelector selected={role} onSelect={setRole} />
      </div>

      {role && (
        <div className="mt-10 animate-rise rounded-card border border-line bg-white/80 p-6 shadow-card sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-court">Profile Details</p>
          <h2 className="mt-1 font-display text-xl font-bold text-ink">
            {role === "player" && "Create your player profile"}
            {role === "coach" && "Create your coach profile"}
            {role === "organizer" && "Create your organizer profile"}
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Full Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="input"
              />
            </Field>
            <Field label="City">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Hyderabad"
                className="input"
              />
            </Field>

            <Field label={role === "organizer" ? "Sports / Events Managed" : "Primary Sport"}>
              <select value={sport} onChange={(e) => setSport(e.target.value as Sport)} className="input">
                {ALL_SPORTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            {role === "player" && (
              <Field label="Player Level">
                <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value as SkillLevel)} className="input">
                  {PLAYER_LEVELS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
            )}

            {role === "coach" && (
              <Field label="Coaching Experience">
                <input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 6 years coaching"
                  className="input"
                />
              </Field>
            )}

            {role === "organizer" && (
              <Field label="Organization / Venue Name">
                <input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Hitech Sports Arena"
                  className="input"
                />
              </Field>
            )}

            {role === "player" && (
              <Field label="About Me" full>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell other athletes how you play and what matches you're looking for..."
                  rows={3}
                  className="input resize-none"
                />
              </Field>
            )}

            {role === "coach" && (
              <Field label="Coaching Achievements" full>
                <textarea
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="e.g. Trained regional and state tournament winners"
                  rows={3}
                  className="input resize-none"
                />
              </Field>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="mt-7 w-full rounded-full bg-court py-3.5 text-sm font-semibold text-paper shadow-pop transition-transform hover:-translate-y-0.5 hover:bg-court-dark disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-10"
          >
            {submitting ? "Setting up your profile…" : "Complete & Enter Platform"}
          </button>
        </div>
      )}

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
    </main>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-semibold text-ink/70">{label}</span>
      {children}
    </label>
  );
}
