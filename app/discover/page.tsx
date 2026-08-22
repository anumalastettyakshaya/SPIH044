"use client";

import { useMemo, useState } from "react";
import { athletes } from "@/data/athletes";
import AthleteCard from "@/components/AthleteCard";
import { Sport, SkillLevel, UserType } from "@/types";

const SPORTS: Sport[] = ["Cricket", "Football", "Badminton", "Running", "Swimming", "Chess"];
const SKILLS: SkillLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];
const TYPES: UserType[] = ["Player", "Coach", "Organizer"];
const LOCATIONS = ["Kukatpally", "Hitech City", "Gachibowli", "Secunderabad", "Jubilee Hills", "Madhapur", "Hyderabad"];

export default function DiscoverPage() {
  const [sport, setSport] = useState<Sport | "All">("All");
  const [location, setLocation] = useState<string>("All");
  const [skill, setSkill] = useState<SkillLevel | "All">("All");
  const [userType, setUserType] = useState<UserType | "All">("All");

  const filtered = useMemo(() => {
    return athletes.filter((a) => {
      if (sport !== "All" && a.sport !== sport && !a.sports?.includes(sport)) return false;
      if (location !== "All" && a.city !== location) return false;
      if (skill !== "All" && a.skillLevel !== skill) return false;
      if (userType !== "All" && a.userType !== userType) return false;
      return true;
    });
  }, [sport, location, skill, userType]);

  const resetFilters = () => {
    setSport("All");
    setLocation("All");
    setSkill("All");
    setUserType("All");
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-court">Discover Community</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
          Players, coaches and organizers near you.
        </h1>
        <p className="mt-2 text-sm text-muted">
          Filter by sport, location and skill level to connect with sports members.
        </p>
      </div>

      <div className="sticky top-[73px] z-30 mt-8 flex flex-wrap gap-3 rounded-card border border-line bg-paper/95 p-4 backdrop-blur-md">
        <Select label="Sport" value={sport} onChange={setSport} options={["All", ...SPORTS]} />
        <Select label="Location" value={location} onChange={setLocation} options={["All", ...LOCATIONS]} />
        <Select label="Player Level" value={skill} onChange={setSkill} options={["All", ...SKILLS]} />
        <Select label="Account Role" value={userType} onChange={setUserType} options={["All", ...TYPES]} />
        <button
          onClick={resetFilters}
          className="ml-auto self-end rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted hover:border-court/40 hover:text-court"
        >
          Reset filters
        </button>
      </div>

      <p className="mt-6 text-xs font-medium text-muted">
        Showing {filtered.length} of {athletes.length} profiles
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <AthleteCard key={a.id} athlete={a} />
          ))}
        </div>
      ) : (
        <div className="mt-14 flex flex-col items-center rounded-card border border-dashed border-line py-16 text-center">
          <p className="font-display text-lg text-ink">No matches for these filters</p>
          <p className="mt-1 text-sm text-muted">Try widening your search — reset filters to see everyone.</p>
          <button
            onClick={resetFilters}
            className="mt-5 rounded-full bg-court px-6 py-2.5 text-sm font-semibold text-paper hover:bg-court-dark"
          >
            Reset filters
          </button>
        </div>
      )}
    </main>
  );
}

function Select<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: T[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-full border border-line bg-white px-3.5 py-2 text-xs font-medium text-ink outline-none focus:border-court"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
