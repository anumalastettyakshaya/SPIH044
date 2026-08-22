"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  AchievementItem,
  AuthAccount,
  ChatMessage,
  Comment,
  ConnectionState,
  CurrentUserProfile,
  Post,
  Role,
  SkillLevel,
  Sport,
  SportEvent,
} from "@/types";
import { seedPosts } from "@/data/posts";
import { defaultPlayerAchievements } from "@/utils/user";
import { canCreateEvents, canJoinEvents, isOwnEvent } from "@/utils/roles";
import {
  dbSignUp,
  dbLogin,
  dbUpdateProfile,
  dbGetEvents,
  dbCreateEvent,
  dbUpdateEvent,
  dbJoinEvent,
  SignupInput,
} from "@/lib/supabase";

const SESSION_KEY = "sportsphere_session_user_v1";

interface AppContextValue {
  hydrated: boolean;
  isAuthenticated: boolean;
  sessionUsername: string | null;
  currentUserAccount: AuthAccount | null;
  profile: CurrentUserProfile | null;
  events: SportEvent[];
  joinedEvents: string[];
  connections: Record<string, ConnectionState>;
  incomingRequests: string[];
  messages: Record<string, ChatMessage[]>;
  posts: Post[];
  myAchievements: AchievementItem[];
  toast: string | null;
  acceptedIds: string[];
  connectionCount: number;

  signup: (input: SignupInput) => Promise<string | null>;
  login: (input: { username: string; password: string }) => Promise<{ error: string | null; role?: Role }>;
  logout: () => void;
  setProfile: (profile: CurrentUserProfile) => void;
  updateProfile: (patch: Partial<CurrentUserProfile>) => Promise<void>;
  joinEvent: (eventId: string) => Promise<string | null>;
  isJoined: (eventId: string) => boolean;
  addEvent: (event: SportEvent, announceInFeed?: boolean) => Promise<string | null>;
  updateEvent: (eventId: string, patch: Partial<SportEvent>) => Promise<string | null>;
  ownsEvent: (event: SportEvent) => boolean;

  sendRequest: (athleteId: string) => void;
  acceptRequest: (athleteId: string) => void;
  acceptIncoming: (athleteId: string) => void;
  ignoreIncoming: (athleteId: string) => void;
  cancelRequest: (athleteId: string) => void;
  getConnectionState: (athleteId: string) => ConnectionState;
  sendMessage: (athleteId: string, text: string) => void;
  addPost: (
    post: Omit<Post, "id" | "createdAt" | "likes" | "likedByMe" | "comments" | "shares"> & Partial<Post>
  ) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  sharePost: (postId: string) => void;
  addAchievement: (item: Omit<AchievementItem, "id">) => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  resetDemo: () => void;
}

const seedMessages: Record<string, ChatMessage[]> = {
  p2: [
    { id: "m1", senderId: "p2", text: "Hey! Up for a game this weekend?", time: "9:12 AM" },
    { id: "m2", senderId: "me", text: "Yes, definitely! Saturday morning works.", time: "9:15 AM" },
  ],
  c1: [
    { id: "m1", senderId: "c1", text: "Welcome! Let's start with your technique next session.", time: "Yesterday" },
  ],
};

const defaultConnections: Record<string, ConnectionState> = {
  p2: "accepted",
  p3: "accepted",
  p5: "accepted",
  p6: "accepted",
  c1: "accepted",
  o1: "accepted",
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sessionUsername, setSessionUsername] = useState<string | null>(null);
  const [currentUserAccount, setCurrentUserAccount] = useState<AuthAccount | null>(null);
  const [profile, setProfileState] = useState<CurrentUserProfile | null>(null);
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);
  const [connections, setConnections] = useState<Record<string, ConnectionState>>(defaultConnections);
  const [incomingRequests, setIncomingRequests] = useState<string[]>(["c4", "p10"]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(seedMessages);
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [myAchievements, setMyAchievements] = useState<AchievementItem[]>(defaultPlayerAchievements);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load initial session and events
  useEffect(() => {
    async function init() {
      try {
        const storedEvents = await dbGetEvents();
        setEvents(storedEvents);

        const savedSession = window.localStorage.getItem(SESSION_KEY);
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed && parsed.username) {
            setSessionUsername(parsed.username);
            setCurrentUserAccount(parsed);
            setProfileState(parsed.profile);

            // Compute joined events from event list
            const userJoined = storedEvents
              .filter(
                (e) =>
                  e.participantNames?.includes(parsed.profile?.name) ||
                  e.participantNames?.includes(parsed.username)
              )
              .map((e) => e.id);
            setJoinedEvents(userJoined);
          }
        }
      } catch (e) {
        console.error("Init state error:", e);
      } finally {
        setHydrated(true);
      }
    }
    init();
  }, []);

  // Save session updates
  useEffect(() => {
    if (!hydrated) return;
    if (currentUserAccount) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(currentUserAccount));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, [currentUserAccount, hydrated]);

  // Toast timer
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(t);
  }, [toast]);

  const showToast = (message: string) => setToast(message);
  const clearToast = () => setToast(null);

  // -------------------------------------------------------------
  // Authentication Actions
  // -------------------------------------------------------------

  const signup = async (input: SignupInput): Promise<string | null> => {
    const res = await dbSignUp(input);
    if (res.error || !res.user) {
      return res.error || "Failed to create account.";
    }

    setSessionUsername(res.user.username);
    setCurrentUserAccount(res.user);
    setProfileState(res.user.profile);
    showToast(`Account created as ${input.role.toUpperCase()} ✓`);
    return null;
  };

  const login = async (input: {
    username: string;
    password: string;
  }): Promise<{ error: string | null; role?: Role }> => {
    const res = await dbLogin(input.username, input.password);
    if (res.error || !res.user) {
      return { error: res.error || "Invalid username or password." };
    }

    setSessionUsername(res.user.username);
    setCurrentUserAccount(res.user);
    setProfileState(res.user.profile);

    // Refresh events and user's joined list
    const currentEvents = await dbGetEvents();
    setEvents(currentEvents);
    const userJoined = currentEvents
      .filter(
        (e) =>
          e.participantNames?.includes(res.user!.profile.name) ||
          e.participantNames?.includes(res.user!.username)
      )
      .map((e) => e.id);
    setJoinedEvents(userJoined);

    showToast(`Welcome back, ${res.user.profile.name || res.user.username}!`);
    return { error: null, role: res.user.role };
  };

  const logout = () => {
    setSessionUsername(null);
    setCurrentUserAccount(null);
    setProfileState(null);
    setJoinedEvents([]);
    window.localStorage.removeItem(SESSION_KEY);
    showToast("You have been logged out.");
  };

  // -------------------------------------------------------------
  // Profile Actions
  // -------------------------------------------------------------

  const setProfile = (newProfile: CurrentUserProfile) => {
    if (!sessionUsername || !currentUserAccount) return;
    const updatedAccount: AuthAccount = {
      ...currentUserAccount,
      profile: { ...newProfile, role: currentUserAccount.role },
    };
    setCurrentUserAccount(updatedAccount);
    setProfileState(updatedAccount.profile);
    dbUpdateProfile(sessionUsername, newProfile);
    showToast("Profile updated ✓");
  };

  const updateProfile = async (patch: Partial<CurrentUserProfile>) => {
    if (!sessionUsername || !currentUserAccount) return;
    const res = await dbUpdateProfile(sessionUsername, patch);
    if (res.profile) {
      const updatedAccount: AuthAccount = {
        ...currentUserAccount,
        profile: res.profile,
      };
      setCurrentUserAccount(updatedAccount);
      setProfileState(res.profile);
      showToast("Profile updated successfully ✓");
    }
  };

  // -------------------------------------------------------------
  // Event Actions
  // -------------------------------------------------------------

  const isJoined = (eventId: string) => joinedEvents.includes(eventId);

  const ownsEvent = (event: SportEvent) =>
    isOwnEvent(event, sessionUsername, profile?.role);

  const joinEvent = async (eventId: string): Promise<string | null> => {
    if (!currentUserAccount || !profile) {
      showToast("Please log in first.");
      return "Please log in first.";
    }

    if (!canJoinEvents(profile.role)) {
      showToast("Only players can join events.");
      return "Only players can join events.";
    }

    const res = await dbJoinEvent(eventId, currentUserAccount);
    if (res.error) {
      showToast(res.error);
      return res.error;
    }

    setJoinedEvents((prev) => (prev.includes(eventId) ? prev : [...prev, eventId]));
    const refreshed = await dbGetEvents();
    setEvents(refreshed);
    showToast("You have joined the event! ✓");
    return null;
  };

  const addEvent = async (
    event: SportEvent,
    announceInFeed = true
  ): Promise<string | null> => {
    if (!currentUserAccount || !profile) {
      showToast("Please log in first.");
      return "Please log in first.";
    }

    if (!canCreateEvents(profile.role)) {
      showToast("Only organizers can create events.");
      return "Only organizers can create events.";
    }

    const res = await dbCreateEvent(event, currentUserAccount);
    if (res.error || !res.event) {
      showToast(res.error || "Failed to create event.");
      return res.error || "Failed to create event.";
    }

    const refreshed = await dbGetEvents();
    setEvents(refreshed);

    if (announceInFeed) {
      const announcement: Post = {
        id: `evpost-${res.event.id}`,
        authorId: "me",
        type: "event",
        text: `${res.event.name} is now open for registration!`,
        timeLabel: "Just now",
        createdAt: Date.now(),
        likes: 0,
        likedByMe: false,
        comments: [],
        shares: 0,
        eventInfo: {
          eventId: res.event.id,
          name: res.event.name,
          location: res.event.location,
          date: `${res.event.date} · ${res.event.time}`,
          spots: `${res.event.maxPlayers} spots available`,
        },
      };
      setPosts((p) => [announcement, ...p]);
    }

    showToast("Event published successfully ✓");
    return null;
  };

  const updateEvent = async (
    eventId: string,
    patch: Partial<SportEvent>
  ): Promise<string | null> => {
    if (!currentUserAccount || !profile) {
      showToast("Please log in first.");
      return "Please log in first.";
    }

    const res = await dbUpdateEvent(eventId, patch, currentUserAccount);
    if (res.error || !res.event) {
      showToast(res.error || "Failed to update event.");
      return res.error || "Failed to update event.";
    }

    const refreshed = await dbGetEvents();
    setEvents(refreshed);
    showToast("Event updated successfully ✓");
    return null;
  };

  // -------------------------------------------------------------
  // Social / Connections / Posts
  // -------------------------------------------------------------

  const sendRequest = (athleteId: string) => {
    if (connections[athleteId] === "accepted") return;
    setConnections((c) => ({ ...c, [athleteId]: "sent" }));
    setIncomingRequests((r) => r.filter((id) => id !== athleteId));
    showToast("Connection request sent");
  };

  const acceptRequest = (athleteId: string) => {
    setConnections((c) => ({ ...c, [athleteId]: "accepted" }));
    setIncomingRequests((r) => r.filter((id) => id !== athleteId));
    setMessages((m) =>
      m[athleteId] ? m : { ...m, [athleteId]: seedMessages[athleteId] ?? [] }
    );
    showToast("You are now connected");
  };

  const acceptIncoming = (athleteId: string) => acceptRequest(athleteId);

  const ignoreIncoming = (athleteId: string) => {
    setIncomingRequests((r) => r.filter((id) => id !== athleteId));
    showToast("Request ignored");
  };

  const cancelRequest = (athleteId: string) => {
    setConnections((c) => {
      const next = { ...c };
      delete next[athleteId];
      return next;
    });
    showToast("Request cancelled");
  };

  const getConnectionState = (athleteId: string): ConnectionState => {
    if (incomingRequests.includes(athleteId) && connections[athleteId] !== "accepted") {
      return "incoming";
    }
    return connections[athleteId] ?? "none";
  };

  const sendMessage = (athleteId: string, text: string) => {
    const existing = messages[athleteId] ?? [];
    const message: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "me",
      text,
      time: "Now",
    };
    setMessages((m) => ({ ...m, [athleteId]: [...existing, message] }));
  };

  const addPost = (
    post: Omit<Post, "id" | "createdAt" | "likes" | "likedByMe" | "comments" | "shares"> & Partial<Post>
  ) => {
    const next: Post = {
      likes: 0,
      likedByMe: false,
      comments: [],
      shares: 0,
      ...post,
      id: post.id ?? `post-${Date.now()}`,
      createdAt: Date.now(),
      timeLabel: post.timeLabel ?? "Just now",
      authorId: post.authorId ?? "me",
      type: post.type ?? "general",
      text: post.text,
    };
    setPosts((p) => [next, ...p]);
    showToast("Post shared successfully");
  };

  const toggleLike = (postId: string) => {
    setPosts((p) =>
      p.map((item) =>
        item.id === postId
          ? { ...item, likedByMe: !item.likedByMe, likes: item.likedByMe ? item.likes - 1 : item.likes + 1 }
          : item
      )
    );
  };

  const addComment = (postId: string, text: string) => {
    const name = profile?.name ?? "You";
    const comment: Comment = {
      id: `cm-${Date.now()}`,
      authorName: name,
      authorInitials: name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      text,
      time: "Just now",
    };
    setPosts((p) =>
      p.map((item) => (item.id === postId ? { ...item, comments: [...item.comments, comment] } : item))
    );
  };

  const sharePost = (postId: string) => {
    setPosts((p) =>
      p.map((item) => (item.id === postId ? { ...item, shares: item.shares + 1 } : item))
    );
    showToast("Post shared successfully");
  };

  const addAchievement = (item: Omit<AchievementItem, "id">) => {
    const achievement: AchievementItem = { ...item, id: `ach-${Date.now()}` };
    setMyAchievements((a) => [achievement, ...a]);
    showToast("Achievement added to profile");
  };

  const resetDemo = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setSessionUsername(null);
    setCurrentUserAccount(null);
    setProfileState(null);
    setJoinedEvents([]);
    setConnections(defaultConnections);
    showToast("Demo state reset");
  };

  const acceptedIds = useMemo(
    () => Object.entries(connections).filter(([, v]) => v === "accepted").map(([k]) => k),
    [connections]
  );

  const connectionCount = acceptedIds.length;

  return (
    <AppContext.Provider
      value={{
        hydrated,
        isAuthenticated: Boolean(sessionUsername && profile),
        sessionUsername,
        currentUserAccount,
        profile,
        events,
        joinedEvents,
        connections,
        incomingRequests,
        messages,
        posts,
        myAchievements,
        toast,
        acceptedIds,
        connectionCount,
        signup,
        login,
        logout,
        setProfile,
        updateProfile,
        joinEvent,
        isJoined,
        addEvent,
        updateEvent,
        ownsEvent,
        sendRequest,
        acceptRequest,
        acceptIncoming,
        ignoreIncoming,
        cancelRequest,
        getConnectionState,
        sendMessage,
        addPost,
        toggleLike,
        addComment,
        sharePost,
        addAchievement,
        showToast,
        clearToast,
        resetDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
