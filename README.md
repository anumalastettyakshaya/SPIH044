# SportSphere (KhelConnect) — Smart Sports Networking Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/anumalastettyakshaya/SPIH044)

A smart sports networking web application connecting **Players**, **Coaches**, and **Organizers / Court Owners** in one unified ecosystem. Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

---

## 📌 About the Project

**SportSphere** is designed to connect the entire sports community in one place:
- **Players:** Discover suitable opponents, calculate AI-based compatibility scores, participate in events, showcase achievements, and connect with coaches.
- **Coaches:** Build professional coaching profiles, showcase expertise & student achievements, and promote coaching services.
- **Organizers & Court Owners:** Host sports tournaments, manage event registrations, list venues/facilities, and increase court bookings.

---

## 🚀 Live Demo & Deployment

- **Vercel Deploy:** [Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/anumalastettyakshaya/SPIH044)
- **GitHub Repository:** [anumalastettyakshaya/SPIH044](https://github.com/anumalastettyakshaya/SPIH044)

---

## 🎯 Key Features

- 🏃 **Player Discovery & Smart Matching:** Algorithmic compatibility scoring based on sport, skill level, city, peer rating, and achievements.
- 🏋️ **Coach Directory & Profiles:** Detailed coach profiles showcasing certifications, coaching domains, and student outcomes.
- 🏟️ **Event & Tournament Management:** Create, browse, filter, and register for local sporting events and tournaments.
- 💬 **Live Networking & Chat:** Real-time messaging unlocked when players/coaches accept connection requests.
- 🔐 **Role-Based Authentication & Profiles:** Supabase-backed authentication with custom role selection (Player, Coach, Organizer).

---

## 🛠️ Technologies Used

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database / Auth:** [Supabase](https://supabase.com/)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 💻 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anumalastettyakshaya/SPIH044.git
   cd SPIH044
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

```
├── app/                  # Next.js App Router (pages & layouts)
│   ├── page.tsx          # Landing page
│   ├── onboarding/       # Role selection & profile creation
│   ├── discover/         # Filterable athlete & coach directory
│   ├── profile/[id]/     # Profile details & connection flow
│   ├── events/           # Events list & organizer event creation
│   ├── chat/             # Direct messaging interface
│   └── layout.tsx        # Root layout, providers & navigation
├── components/           # Reusable UI components
├── context/              # Global state management (AppContext)
├── data/                 # Seed data for athletes, coaches & events
├── lib/                  # Supabase client & utility helpers
├── types/                # Shared TypeScript definitions
└── utils/                # Compatibility scoring engine
```
