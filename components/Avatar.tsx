import { Athlete } from "@/types";
import { currentUserAsAthlete } from "@/utils/user";
import { CurrentUserProfile } from "@/types";
import { athletes } from "@/data/athletes";

export function resolveAuthor(
  authorId: string,
  profile: CurrentUserProfile | null
): Athlete | null {
  if (authorId === "me") return currentUserAsAthlete(profile);
  return athletes.find((a) => a.id === authorId) ?? null;
}

export function Avatar({
  name,
  initials,
  accent,
  size = "md",
}: {
  name?: string;
  initials: string;
  accent: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const dim =
    size === "sm" ? "h-8 w-8 text-[10px]" : size === "lg" ? "h-16 w-16 text-lg" : size === "xl" ? "h-24 w-24 text-2xl" : "h-11 w-11 text-sm";
  return (
    <div
      title={name}
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-paper ${dim}`}
      style={{ backgroundColor: accent }}
    >
      {initials}
    </div>
  );
}
