import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AuthAccount, CurrentUserProfile, Role, SkillLevel, Sport, SportEvent } from "@/types";
import { seedEvents } from "@/data/events";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("your-project")
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Lightweight cryptographic password hashing using Web Crypto API (SHA-256 with salt)
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`sportsphere_salt_${password}`);
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback simple hash for older environments
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === storedHash || password === storedHash;
}

// -------------------------------------------------------------
// Database Operations (Supabase with Local Persistence Fallback)
// -------------------------------------------------------------

const USERS_STORAGE_KEY = "sportsphere_db_users_v1";
const EVENTS_STORAGE_KEY = "sportsphere_db_events_v1";
const REGISTRATIONS_STORAGE_KEY = "sportsphere_db_registrations_v1";

function getLocalUsers(): Record<string, AuthAccount> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalUsers(users: Record<string, AuthAccount>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {}
}

function getLocalEvents(): SportEvent[] {
  if (typeof window === "undefined") return seedEvents;
  try {
    const raw = window.localStorage.getItem(EVENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return seedEvents;
  } catch {
    return seedEvents;
  }
}

function saveLocalEvents(events: SportEvent[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch {}
}

export interface SignupInput {
  username: string;
  password: string;
  phone: string;
  email: string;
  aadhaar: string;
  role: Role;
  name?: string;
  sport?: Sport;
  skillLevel?: SkillLevel;
  city?: string;
  bio?: string;
}

export async function dbSignUp(input: SignupInput): Promise<{ user: AuthAccount | null; error: string | null }> {
  const cleanUsername = input.username.trim().toLowerCase();
  if (!cleanUsername || input.password.length < 4) {
    return { user: null, error: "Username and a password of at least 4 characters are required." };
  }

  const passwordHash = await hashPassword(input.password);
  const now = new Date().toISOString();

  const initialProfile: CurrentUserProfile = {
    username: cleanUsername,
    role: input.role,
    name: input.name?.trim() || input.username.trim(),
    city: input.city?.trim() || "Hyderabad",
    sport: input.sport || "Cricket",
    sports: [input.sport || "Cricket"],
    skillLevel: input.skillLevel || (input.role === "player" ? "Intermediate" : "Advanced"),
    bio: input.bio?.trim() || (input.role === "player"
      ? "Passionate sports player looking for matches, tournaments and teammates."
      : input.role === "coach"
      ? "Certified sports coach dedicated to player development."
      : "Sports organizer hosting community matches and tournaments."),
    rating: 4.8,
    verified: true,
  };

  const account: AuthAccount = {
    id: `u_${cleanUsername}_${Date.now()}`,
    username: cleanUsername,
    passwordHash,
    phone: input.phone.trim(),
    email: input.email.trim(),
    aadhaar: input.aadhaar.trim(),
    aadhaarVerified: Boolean(input.aadhaar.trim()),
    role: input.role,
    profile: initialProfile,
    createdAt: now,
  };

  // Try Supabase if available
  if (supabase) {
    try {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("username", cleanUsername)
        .maybeSingle();

      if (existing) {
        return { user: null, error: "Username is already taken." };
      }

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          username: cleanUsername,
          password_hash: passwordHash,
          phone: input.phone.trim(),
          email: input.email.trim(),
          aadhaar: input.aadhaar.trim(),
          aadhaar_verified: true,
          role: input.role,
          name: initialProfile.name,
          city: initialProfile.city,
          sport: initialProfile.sport,
          sports: initialProfile.sports,
          skill_level: initialProfile.skillLevel,
          bio: initialProfile.bio,
          rating: 4.8,
          created_at: now,
        })
        .select()
        .single();

      if (error) {
        console.warn("Supabase signup error, falling back to storage:", error.message);
      } else if (data) {
        account.id = data.id;
      }
    } catch (err) {
      console.warn("Supabase signup exception:", err);
    }
  }

  // Save to local registry
  const users = getLocalUsers();
  if (users[cleanUsername]) {
    return { user: null, error: "Username is already taken." };
  }
  users[cleanUsername] = account;
  saveLocalUsers(users);

  return { user: account, error: null };
}

export async function dbLogin(username: string, password: string): Promise<{ user: AuthAccount | null; error: string | null }> {
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername || !password) {
    return { user: null, error: "Username and password are required." };
  }

  // Try Supabase if available
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", cleanUsername)
        .maybeSingle();

      if (data && !error) {
        const matches = await verifyPassword(password, data.password_hash);
        if (matches) {
          const userAccount: AuthAccount = {
            id: data.id,
            username: data.username,
            passwordHash: data.password_hash,
            phone: data.phone,
            email: data.email,
            aadhaar: data.aadhaar,
            aadhaarVerified: data.aadhaar_verified ?? true,
            role: data.role as Role,
            createdAt: data.created_at,
            profile: {
              id: data.id,
              username: data.username,
              role: data.role as Role,
              name: data.name || data.username,
              city: data.city || "Hyderabad",
              sport: data.sport || "Cricket",
              sports: data.sports || [data.sport || "Cricket"],
              skillLevel: data.skill_level || "Intermediate",
              bio: data.bio || "Sports enthusiast.",
              rating: data.rating ?? 4.8,
              verified: data.aadhaar_verified ?? true,
            },
          };
          // Sync local
          const local = getLocalUsers();
          local[cleanUsername] = userAccount;
          saveLocalUsers(local);
          return { user: userAccount, error: null };
        }
      }
    } catch (err) {
      console.warn("Supabase login exception:", err);
    }
  }

  // Fallback to local users
  const users = getLocalUsers();
  const account = users[cleanUsername];
  if (!account) {
    return { user: null, error: "Invalid username or password." };
  }

  const ok = await verifyPassword(password, account.passwordHash || account.password || "");
  if (!ok) {
    return { user: null, error: "Invalid username or password." };
  }

  return { user: account, error: null };
}

export async function dbUpdateProfile(
  username: string,
  patch: Partial<CurrentUserProfile>
): Promise<{ profile: CurrentUserProfile | null; error: string | null }> {
  const cleanUsername = username.trim().toLowerCase();
  const users = getLocalUsers();
  const account = users[cleanUsername];

  const updatedProfile: CurrentUserProfile = {
    ...(account?.profile || {
      username: cleanUsername,
      role: patch.role || "player",
      name: cleanUsername,
      city: "Hyderabad",
    }),
    ...patch,
    username: cleanUsername,
    role: account?.profile?.role || patch.role || "player", // Role is immutable
  };

  if (account) {
    account.profile = updatedProfile;
    users[cleanUsername] = account;
    saveLocalUsers(users);
  }

  if (supabase) {
    try {
      await supabase
        .from("profiles")
        .update({
          name: updatedProfile.name,
          city: updatedProfile.city,
          sport: updatedProfile.sport,
          sports: updatedProfile.sports,
          skill_level: updatedProfile.skillLevel,
          bio: updatedProfile.bio,
          rating: updatedProfile.rating,
        })
        .eq("username", cleanUsername);
    } catch (err) {
      console.warn("Supabase updateProfile error:", err);
    }
  }

  return { profile: updatedProfile, error: null };
}

export async function dbGetEvents(): Promise<SportEvent[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(`
          id,
          name,
          sport,
          location,
          date,
          time,
          skill_level,
          organizer,
          organizer_id,
          owner_username,
          max_players,
          participants,
          description,
          status,
          participant_names
        `)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((e) => ({
          id: e.id,
          name: e.name,
          sport: e.sport as Sport,
          location: e.location,
          date: e.date,
          time: e.time || "07:00 AM",
          skillLevel: e.skill_level as SkillLevel,
          organizer: e.organizer,
          organizerId: e.organizer_id,
          ownerUsername: e.owner_username,
          maxPlayers: e.max_players ?? 10,
          participants: e.participants ?? 0,
          description: e.description,
          status: e.status ?? "open",
          participantNames: e.participant_names || [],
        }));
      }
    } catch (err) {
      console.warn("Supabase getEvents error:", err);
    }
  }
  return getLocalEvents();
}

export async function dbCreateEvent(
  event: SportEvent,
  organizer: AuthAccount
): Promise<{ event: SportEvent | null; error: string | null }> {
  // Backend Role Check
  if (organizer.role !== "organizer") {
    return { event: null, error: "Unauthorized: Only organizers can create events." };
  }

  const newEvent: SportEvent = {
    ...event,
    id: event.id || `e_${Date.now()}`,
    ownerUsername: organizer.username,
    organizer: organizer.profile.organization || organizer.profile.name || organizer.username,
    organizerId: organizer.id || organizer.username,
    participants: 0,
    participantNames: [],
    status: "open",
  };

  if (supabase) {
    try {
      const { error } = await supabase.from("events").insert({
        id: newEvent.id,
        name: newEvent.name,
        sport: newEvent.sport,
        location: newEvent.location,
        date: newEvent.date,
        time: newEvent.time,
        skill_level: newEvent.skillLevel,
        organizer: newEvent.organizer,
        organizer_id: newEvent.organizerId,
        owner_username: newEvent.ownerUsername,
        max_players: newEvent.maxPlayers,
        participants: 0,
        description: newEvent.description,
        status: "open",
        participant_names: [],
      });
      if (error) console.warn("Supabase createEvent error:", error.message);
    } catch (err) {
      console.warn("Supabase createEvent exception:", err);
    }
  }

  const events = getLocalEvents();
  const updated = [newEvent, ...events.filter((e) => e.id !== newEvent.id)];
  saveLocalEvents(updated);

  return { event: newEvent, error: null };
}

export async function dbUpdateEvent(
  eventId: string,
  patch: Partial<SportEvent>,
  organizer: AuthAccount
): Promise<{ event: SportEvent | null; error: string | null }> {
  // Backend Role Check
  if (organizer.role !== "organizer") {
    return { event: null, error: "Unauthorized: Only organizers can edit events." };
  }

  const events = getLocalEvents();
  const existing = events.find((e) => e.id === eventId);
  if (!existing) {
    return { event: null, error: "Event not found." };
  }

  // Permission Check: must own the event
  if (existing.ownerUsername !== organizer.username && existing.organizerId !== organizer.id && existing.organizerId !== "me") {
    return { event: null, error: "Unauthorized: You can only edit events you created." };
  }

  const updatedEvent: SportEvent = {
    ...existing,
    ...patch,
    id: existing.id,
    ownerUsername: existing.ownerUsername,
  };

  if (supabase) {
    try {
      await supabase
        .from("events")
        .update({
          name: updatedEvent.name,
          sport: updatedEvent.sport,
          location: updatedEvent.location,
          date: updatedEvent.date,
          time: updatedEvent.time,
          skill_level: updatedEvent.skillLevel,
          max_players: updatedEvent.maxPlayers,
          description: updatedEvent.description,
        })
        .eq("id", eventId);
    } catch (err) {
      console.warn("Supabase updateEvent error:", err);
    }
  }

  const updatedList = events.map((e) => (e.id === eventId ? updatedEvent : e));
  saveLocalEvents(updatedList);

  return { event: updatedEvent, error: null };
}

export async function dbJoinEvent(
  eventId: string,
  player: AuthAccount
): Promise<{ success: boolean; error: string | null }> {
  // Backend Role Check
  if (player.role !== "player") {
    return { success: false, error: "Unauthorized: Only players can join events." };
  }

  const events = getLocalEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) {
    return { success: false, error: "Event not found." };
  }

  if (event.ownerUsername === player.username) {
    return { success: false, error: "You cannot join your own event." };
  }

  const playerName = player.profile.name || player.username;
  const currentParticipants = event.participantNames || [];

  if (currentParticipants.includes(playerName) || currentParticipants.includes(player.username)) {
    return { success: true, error: null }; // Already joined
  }

  if (event.participants >= event.maxPlayers) {
    return { success: false, error: "This event is already full." };
  }

  const updatedNames = [...currentParticipants, playerName];
  const updatedParticipants = event.participants + 1;

  if (supabase) {
    try {
      await supabase.from("event_registrations").insert({
        event_id: eventId,
        player_id: player.id || player.username,
        player_username: player.username,
        player_name: playerName,
      });

      await supabase
        .from("events")
        .update({
          participants: updatedParticipants,
          participant_names: updatedNames,
        })
        .eq("id", eventId);
    } catch (err) {
      console.warn("Supabase joinEvent error:", err);
    }
  }

  const updatedList = events.map((e) =>
    e.id === eventId
      ? { ...e, participants: updatedParticipants, participantNames: updatedNames }
      : e
  );
  saveLocalEvents(updatedList);

  return { success: true, error: null };
}
