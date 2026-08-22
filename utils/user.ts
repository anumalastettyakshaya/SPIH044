import {
  AchievementItem,
  Athlete,
  CurrentUserProfile,
  Role,
  UserType,
} from "@/types";

export const ME_ID = "me";

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ME";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function roleToUserType(role: Role): UserType {
  if (role === "coach") return "Coach";
  if (role === "organizer") return "Organizer";
  return "Player";
}

export function currentUserAsAthlete(profile: CurrentUserProfile | null): Athlete | null {
  if (!profile) return null;
  const sport = profile.sport ?? profile.sports?.[0] ?? "Badminton";
  const extraAchievements = profile.achievements
    ? profile.achievements.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];
  return {
    id: ME_ID,
    name: profile.organization?.trim() || profile.name || profile.username,
    userType: roleToUserType(profile.role),
    city: profile.city || "Hyderabad",
    sport,
    skillLevel: profile.skillLevel ?? "Intermediate",
    bio: profile.bio || defaultBio(profile),
    rating: profile.rating ?? 4.8,
    achievements: extraAchievements,
    avatarInitials: initialsFromName(profile.organization || profile.name || profile.username),
    accent: "#1B4332",
    sports: profile.sports?.length ? profile.sports : [sport],
    preferredLocations: profile.preferredLocations ?? ["Gachibowli", "Kukatpally"],
    availability: profile.availability ?? "Weekends and Evenings",
    yearsExperience: profile.yearsExperience ?? (profile.role === "coach" ? 8 : 6),
    experienceYears: profile.yearsExperience,
    fitnessLevel: profile.fitnessLevel ?? "High",
    preferredMatchType: profile.preferredMatchType ?? "Competitive + Casual",
    studentsCoached: profile.studentsCoached,
    eventsHosted: profile.eventsHosted,
    verified: profile.verified ?? true,
  };
}

export function defaultBio(profile: Partial<CurrentUserProfile>): string {
  const city = profile.city || "Hyderabad";
  if (profile.role === "coach") {
    return `Coach based in ${city}. Helping athletes improve with structured sessions, match prep and consistent feedback.`;
  }
  if (profile.role === "organizer") {
    return `${profile.organization || profile.name || "Organizer"} hosts matches, practices and tournaments for the local sports community.`;
  }
  return `Passionate ${profile.sport ?? "sports"} player based in ${city}. Looking to connect with players for practice, competitive games and local events.`;
}

export const defaultPlayerAchievements: AchievementItem[] = [
  {
    id: "a1",
    title: "Hyderabad Open 2026",
    event: "Hyderabad Open 2026",
    position: "Winner — Singles",
    date: "Aug 2026",
    description: "First local tournament title after months of training.",
  },
  {
    id: "a2",
    title: "Telangana State Championship",
    event: "Telangana State Championship",
    position: "Runner Up",
    date: "Mar 2026",
  },
  {
    id: "a3",
    title: "50 Matches Completed",
    event: "Community leagues",
    position: "Milestone",
    date: "2026",
  },
  {
    id: "a4",
    title: "District Sports Meet",
    event: "District Sports Meet",
    position: "Top 4",
    date: "Jan 2026",
  },
];
