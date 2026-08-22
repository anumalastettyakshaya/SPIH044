# SportSphere — Hackathon MVP

A LinkedIn-for-sports web app connecting **Players**, **Coaches**, and **Organizers / Court Owners** — built with Next.js (App Router), TypeScript, and Tailwind CSS.

This is a fully frontend-driven MVP: no backend, no auth, no payment gateways, no external AI APIs. All matching, connections, events, and chat run on local React state persisted to `localStorage`, with a deterministic, explainable compatibility scoring algorithm.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
sportsphere/
├── app/                  → routes (App Router)
│   ├── page.tsx              Landing page
│   ├── onboarding/page.tsx   Role selection + profile creation
│   ├── discover/page.tsx     Filterable athlete/coach directory
│   ├── profile/[id]/page.tsx Profile detail + connection flow
│   ├── events/page.tsx       Events list + organizer create-event form
│   ├── chat/page.tsx         Chat (unlocked after connection accepted)
│   └── layout.tsx            Root layout, fonts, AppProvider
├── components/           → reusable UI (Navbar, AthleteCard, EventCard,
│                            CompatibilityScore, RoleSelector)
├── context/AppContext.tsx→ global app state (profile, connections,
│                            joined events, chat) persisted to localStorage
├── data/                 → seed athletes, coaches and events (Hyderabad)
├── types/                → shared TypeScript interfaces
└── utils/compatibility.ts→ deterministic compatibility scoring engine
```

## Demo flow

```
Landing Page → Get Started → Select Role → Create Profile → Discover
  → View Athlete → View Compatibility → Send Request → Accept Request → Open Chat

Discover → Events → Join Event
```

`Accept Request` on a profile page is a demo control that simulates the other person accepting — there's no real backend, so this is how the connection state machine is exercised end-to-end in a live demo.

## Compatibility engine

`utils/compatibility.ts` computes a 0–100 score from same-sport, skill-level closeness, same-city, peer rating, and achievement count — each with a fixed weight, fully explainable in the UI. It is explicitly **not** presented as machine learning.

## Resetting demo state

The app persists to `localStorage` under the key `sportsphere-state-v1` so a judge can refresh mid-demo without losing progress. Clear that key (or your browser's site data) to reset to a clean seeded state.
