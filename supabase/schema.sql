-- SportSphere Supabase MVP Database Schema
-- Run this script in the Supabase SQL Editor to set up tables and security policies.

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  aadhaar TEXT,
  aadhaar_verified BOOLEAN DEFAULT TRUE,
  role TEXT NOT NULL CHECK (role IN ('player', 'coach', 'organizer')),
  name TEXT NOT NULL,
  city TEXT DEFAULT 'Hyderabad',
  sport TEXT DEFAULT 'Cricket',
  sports TEXT[] DEFAULT ARRAY['Cricket']::TEXT[],
  skill_level TEXT DEFAULT 'Intermediate' CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  bio TEXT,
  organization TEXT,
  rating NUMERIC(3, 1) DEFAULT 4.8,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  skill_level TEXT DEFAULT 'All Levels',
  organizer TEXT NOT NULL,
  organizer_id TEXT,
  owner_username TEXT NOT NULL,
  max_players INTEGER DEFAULT 10,
  participants INTEGER DEFAULT 0,
  description TEXT,
  status TEXT DEFAULT 'open',
  participant_names TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Event Registrations Table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL,
  player_username TEXT NOT NULL,
  player_name TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(event_id, player_username)
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public reads and inserts for MVP demo
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public insert events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update events" ON public.events FOR UPDATE USING (true);

CREATE POLICY "Public read event_registrations" ON public.event_registrations FOR SELECT USING (true);
CREATE POLICY "Public insert event_registrations" ON public.event_registrations FOR INSERT WITH CHECK (true);
