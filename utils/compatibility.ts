import { Athlete, CompatibilityResult, CurrentUserProfile, SkillLevel } from "@/types";

const SKILL_ORDER: Record<SkillLevel, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
  Expert: 3,
};

// Simple deterministic string hash so we always get the same "random-looking"
// number for a given id — no Math.random(), fully reproducible for the demo.
function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * MVP smart compatibility engine.
 * This is a deterministic, explainable weighted score — NOT a trained
 * machine-learning model. Every point is traceable to a rule below.
 */
export function getCompatibility(
  currentUser: CurrentUserProfile | null,
  athlete: Athlete
): CompatibilityResult {
  const reasons: string[] = [];
  let score = 0;

  const userSport = currentUser?.sport ?? currentUser?.sports?.[0];
  const userSkill = currentUser?.skillLevel;
  const userCity = currentUser?.city;

  // Fallback baseline when no profile exists yet (pre-onboarding preview on Discover)
  if (!currentUser) {
    const seed = hashString(athlete.id) % 18; // 0-17
    score = 58 + seed; // 58-75 baseline band
    reasons.push("Baseline estimate — complete your profile for a personalized score");
    reasons.push(`Strong ${athlete.sport} community activity nearby`);
    return {
      score: Math.min(score, 99),
      reasons,
      summary: `${Math.min(score, 99)}% Compatible — ${reasons[1]}.`,
    };
  }

  // Sport match — highest weight
  if (userSport && userSport === athlete.sport) {
    score += 40;
    reasons.push(`Same sport (${athlete.sport})`);
  } else if (userSport) {
    score += 8;
    reasons.push(`Different primary sport (${userSport} vs ${athlete.sport})`);
  }

  // Skill level match
  if (userSkill) {
    const diff = Math.abs(SKILL_ORDER[userSkill] - SKILL_ORDER[athlete.skillLevel]);
    if (diff === 0) {
      score += 22;
      reasons.push("Similar skill level");
    } else if (diff === 1) {
      score += 11;
      reasons.push("Adjacent skill level");
    } else {
      reasons.push("Skill level gap");
    }
  }

  // Location match
  if (userCity && userCity === athlete.city) {
    score += 18;
    reasons.push("Nearby location");
  } else if (userCity) {
    score += 4;
    reasons.push("Different area of the city");
  }

  // Rating contribution (max 12)
  const ratingPoints = Math.round((athlete.rating / 5) * 12);
  score += ratingPoints;
  if (athlete.rating >= 4.5) {
    reasons.push("Strong peer ratings");
  }

  // Achievements contribution (max 8)
  const achievementPoints = Math.min(athlete.achievements.length, 3) * 2.7;
  score += achievementPoints;
  if (athlete.achievements.length >= 2) {
    reasons.push("Multiple recent achievements");
  }

  const finalScore = Math.max(5, Math.min(99, Math.round(score)));

  const topReasons = reasons.slice(0, 3).join(", ").replace(/,([^,]*)$/, " and$1");

  return {
    score: finalScore,
    reasons,
    summary: `${finalScore}% Compatible — ${topReasons}.`,
  };
}

export function compatibilityBlurb(result: CompatibilityResult): string {
  const joined = result.reasons.slice(0, 4).join(", ").replace(/,([^,]*)$/, " and$1");
  return joined
    ? `${joined.charAt(0).toUpperCase()}${joined.slice(1)}.`
    : "SportSphere Smart Compatibility Score based on sport, skill, location, rating and achievements.";
}
