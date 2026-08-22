import { Role, SportEvent } from "@/types";

export function canJoinEvents(role?: Role | null): boolean {
  return role === "player";
}

export function canCreateEvents(role?: Role | null): boolean {
  return role === "organizer";
}

export function canEditEvent(
  event: SportEvent,
  username: string | null,
  role?: Role | null
): boolean {
  if (role !== "organizer" || !username) return false;
  return event.ownerUsername === username || event.organizerId === "me" || event.organizerId === username;
}

export function isOwnEvent(
  event: SportEvent,
  username: string | null,
  role?: Role | null
): boolean {
  return canEditEvent(event, username, role);
}

export function navLinksForRole(role?: Role | null): { href: string; label: string }[] {
  if (role === "organizer") {
    return [
      { href: "/home", label: "Home" },
      { href: "/events", label: "My Events" },
      { href: "/profile", label: "Profile" },
    ];
  }
  if (role === "coach") {
    return [
      { href: "/home", label: "Home" },
      { href: "/discover", label: "Discover" },
      { href: "/profile", label: "Profile" },
    ];
  }
  // Default Player
  return [
    { href: "/home", label: "Home" },
    { href: "/discover", label: "Discover" },
    { href: "/events", label: "Events" },
    { href: "/profile", label: "Profile" },
  ];
}
