# SportSphere — Cursor Handoff

## 1. What this project is

SportSphere is a sports networking platform connecting three user types:

- Player
- Coach
- Organizer / Court Owner

Core idea:
- Players build sports profiles and achievements.
- Players discover other players, coaches and organizers.
- Players see a smart compatibility score.
- Players can discover and join sports events.
- Coaches showcase skills, achievements and students.
- Organizers create and promote events.

The current project is a **Next.js 14.2.35 + React 18 + TypeScript + Tailwind CSS** application.

---

## 2. Current state

The frontend is already built and runs with:

```bash
npm install
npm run dev
```

Local URL:

```text
http://localhost:3000
```

Landing page:

```text
/
```

The landing page already has:

```text
Click Here to Join Us
```

and it links to:

```text
/auth
```

So the public flow is already:

```text
Landing page
    ↓
/auth
    ↓
login / signup
    ↓
/onboarding
    ↓
/home
```

Do NOT replace the existing UI or redesign it unless explicitly asked.

---

## 3. Important: this is currently FRONTEND-ONLY

There is currently **NO real backend/database**.

The application currently stores its state in browser `localStorage`.

Main state file:

```text
context/AppContext.tsx
```

It currently handles:
- signup
- login
- logout
- profile
- connections
- events
- messages
- posts
- achievements
- local persistence

The data is currently seeded from:

```text
data/athletes.ts
data/events.ts
data/posts.ts
```

Therefore, two different users/devices do NOT share the same data.

---

## 4. Existing project structure

Important source files:

```text
app/
  page.tsx                 # Landing page
  auth/page.tsx            # Login / signup
  onboarding/page.tsx      # Role + profile setup
  home/page.tsx            # Main feed
  discover/page.tsx        # Player/coach/organizer discovery
  events/page.tsx          # Event list + organizer event creation
  events/[id]/page.tsx     # Event details
  profile/page.tsx         # Current user's profile
  profile/[id]/page.tsx    # Public profile
  network/page.tsx         # Connections
  messages/page.tsx        # Messages
  chat/page.tsx            # Chat

components/
  Navbar.tsx
  AuthGate.tsx
  AthleteCard.tsx
  CompatibilityScore.tsx
  ConnectButton.tsx
  EventCard.tsx
  PostCard.tsx
  Composer.tsx
  RoleSelector.tsx
  Toast.tsx

context/
  AppContext.tsx            # Current localStorage-based state

data/
  athletes.ts
  events.ts
  posts.ts

utils/
  compatibility.ts          # Existing smart compatibility algorithm
  roles.ts
  user.ts

types/
  index.ts
```

---

## 5. DO NOT READ / MODIFY generated folders

Ignore:

```text
.next/
node_modules/
```

They are generated/dependency folders and are not source code.

---

# 6. Existing compatibility system

There is ALREADY a deterministic compatibility engine in:

```text
utils/compatibility.ts
```

Do NOT build a new compatibility system from scratch.

It currently considers:

- sport
- skill level
- location
- rating
- achievements

It produces a score from 5–99 and reasons explaining the score.

This is suitable for the MVP.

For the presentation, describe it as:

> "Our MVP uses a deterministic smart compatibility engine. The production version can replace/extend this with a trained AI recommendation model using match history, performance, playing style and other signals."

---

# 7. ONE-HOUR BACKEND MVP GOAL

We need a basic working backend as quickly as possible.

Recommended backend:

**Supabase**

Use Supabase for:

- Authentication / user identity if needed
- PostgreSQL database
- API access

Do NOT create a complicated Express server for this one-hour MVP.

---

# 8. MVP database tables

Create only these tables first.

## profiles

Suggested columns:

```text
id
username
name
email
role
sport
skill_level
city
bio
achievements
verified
created_at
```

Role values:

```text
player
coach
organizer
```

---

## events

Suggested columns:

```text
id
title
sport
description
location
date
time
skill_level
organizer_id
max_players
created_at
```

---

## event_participants

Suggested columns:

```text
id
event_id
player_id
joined_at
```

This connects players to events.

---

# 9. MVP user journey to make functional

The most important demo flow is:

```text
Landing Page
    ↓
Click Here to Join Us
    ↓
Authentication
    ↓
Onboarding
    ↓
Create Profile
    ↓
Home
    ↓
Discover Players
    ↓
Compatibility Score
    ↓
Events
    ↓
Join Event
    ↓
Registration success
```

This is enough for the MVP demonstration.

---

# 10. Priority order

Implement in this exact order:

### Priority 1 — Supabase connection

Install:

```bash
npm install @supabase/supabase-js
```

Create:

```text
lib/supabase.ts
```

Use environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Never expose a Supabase service-role key in client-side code.

---

### Priority 2 — Profiles

Connect onboarding/profile data to the `profiles` table.

The existing onboarding UI should remain unchanged as much as possible.

Relevant file:

```text
app/onboarding/page.tsx
```

Relevant state:

```text
context/AppContext.tsx
```

---

### Priority 3 — Events

Connect:

```text
app/events/page.tsx
app/events/[id]/page.tsx
components/EventCard.tsx
```

to the `events` table.

Organizer:
- create event

Player:
- view events
- join event

---

### Priority 4 — Event participation

Connect the existing `joinEvent()` behavior to:

```text
event_participants
```

instead of only localStorage.

---

### Priority 5 — Discover

Current discover page:

```text
app/discover/page.tsx
```

currently reads:

```text
data/athletes.ts
```

For the MVP, replace this with profiles from Supabase if time allows.

Keep the existing filtering UI.

---

### Priority 6 — Compatibility

Reuse:

```text
utils/compatibility.ts
```

Do NOT build ML.

Calculate the score using the existing function and display it.

---

# 11. Authentication note

Current `app/auth/page.tsx` contains demo OTP/Aadhaar fields.

Current implementation uses:

```text
DEMO_OTP = "123456"
```

and stores accounts locally through `AppContext`.

For the MVP:

- Do not integrate real Aadhaar verification.
- Do not integrate real SMS OTP.
- Do not spend the one-hour MVP window on government APIs.

If authentication is moved to Supabase, preserve the current UI as much as possible.

---

# 12. Existing desired authentication behavior

The intended simple MVP authentication design is:

### Login

Only:

```text
Username
Password
```

### Sign Up

Can collect the additional profile/verification information.

Keep authentication simple enough to finish quickly.

If changing this, do not redesign unrelated pages.

---

# 13. Deployment

The project is a Next.js application.

Do NOT use GitHub Pages for the Next.js server application.

Recommended deployment:

```text
GitHub → Vercel
```

Vercel automatically redeploys after pushes to the connected GitHub repository.

---

# 14. Git rules

Do NOT commit:

```text
node_modules/
.next/
.env.local
```

The existing `.gitignore` already ignores these.

Before pushing:

```bash
git status
git add .
git commit -m "Implement MVP backend"
git push
```

---

# 15. Development rules for the new Cursor session

IMPORTANT:

1. Read this handoff file first.
2. Do not scan `.next/`.
3. Do not scan `node_modules/`.
4. Do not rewrite the whole project.
5. Do not redesign the existing UI.
6. Reuse existing components.
7. Reuse existing types.
8. Reuse the existing compatibility engine.
9. Modify only the files required for the MVP.
10. Before making large changes, explain which files will be changed.
11. Keep the existing landing page and `/auth` flow working.
12. Test with `npm run build` before final deployment if time permits.

---

# 16. First instruction to Cursor

Start by inspecting only:

```text
package.json
app/auth/page.tsx
app/onboarding/page.tsx
app/events/page.tsx
app/events/[id]/page.tsx
app/discover/page.tsx
context/AppContext.tsx
types/index.ts
utils/compatibility.ts
utils/roles.ts
```

Then tell me:

1. What is currently localStorage-only?
2. Which files must change to connect Supabase?
3. What is the minimum implementation needed for profiles + events + event joining?
4. Do NOT make changes until this analysis is complete.

After that, implement the MVP with the smallest possible set of changes.
