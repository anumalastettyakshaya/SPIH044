export type Sport =
  | "Cricket"
  | "Football"
  | "Badminton"
  | "Running"
  | "Swimming"
  | "Chess";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type Role = "player" | "coach" | "organizer";

export type UserType = "Player" | "Coach" | "Organizer";

export type ConnectionState = "none" | "sent" | "incoming" | "accepted" | "ignored";

export type PostType =
  | "general"
  | "achievement"
  | "match"
  | "training"
  | "event"
  | "photo";

export type EventStatus = "open" | "upcoming" | "closed";

export interface BaseProfile {
  id: string;
  name: string;
  city: string;
  avatarInitials: string;
  accent: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  event?: string;
  position?: string;
  date?: string;
  description?: string;
}

export interface Athlete extends BaseProfile {
  userType: UserType;
  sport: Sport;
  skillLevel: SkillLevel;
  bio: string;
  rating: number;
  achievements: string[];
  experienceYears?: number;
  sports?: Sport[];
  preferredLocations?: string[];
  availability?: string;
  fitnessLevel?: string;
  preferredMatchType?: string;
  studentsCoached?: number;
  eventsHosted?: number;
  verified?: boolean;
  yearsExperience?: number;
}

export interface SportEvent {
  id: string;
  name: string;
  sport: Sport;
  location: string;
  date: string;
  time: string;
  skillLevel: SkillLevel | "All Levels";
  organizer: string;
  organizerId?: string;
  ownerUsername?: string;
  maxPlayers: number;
  participants: number;
  description?: string;
  status?: EventStatus;
  participantNames?: string[];
}

export interface CurrentUserProfile {
  id?: string;
  username: string;
  role: Role;
  name: string;
  city: string;
  sport?: Sport;
  sports?: Sport[];
  skillLevel?: SkillLevel;
  bio?: string;
  organization?: string;
  experience?: string;
  achievements?: string;
  rating?: number;
  verified?: boolean;
  preferredLocations?: string[];
  availability?: string;
  yearsExperience?: number;
  fitnessLevel?: string;
  preferredMatchType?: string;
  studentsCoached?: number;
  eventsHosted?: number;
}

export interface AuthAccount {
  id?: string;
  username: string;
  password?: string;
  passwordHash?: string;
  phone?: string;
  email?: string;
  aadhaar?: string;
  aadhaarVerified?: boolean;
  role: Role;
  profile: CurrentUserProfile;
  createdAt?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  playerId: string;
  playerUsername: string;
  playerName?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorInitials: string;
  text: string;
  time: string;
}

export interface Post {
  id: string;
  authorId: string;
  type: PostType;
  text: string;
  timeLabel: string;
  createdAt: number;
  likes: number;
  likedByMe: boolean;
  comments: Comment[];
  shares: number;
  achievement?: {
    title: string;
    event?: string;
    position?: string;
  };
  match?: {
    opponent?: string;
    score?: string;
  };
  eventInfo?: {
    eventId?: string;
    name: string;
    location?: string;
    date?: string;
    spots?: string;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

export interface CompatibilityResult {
  score: number;
  reasons: string[];
  summary: string;
}

export const ALL_SPORTS: Sport[] = ["Cricket", "Football", "Badminton", "Running", "Swimming", "Chess"];
export const PLAYER_LEVELS: SkillLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];
