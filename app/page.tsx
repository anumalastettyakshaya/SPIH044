import Link from "next/link";

const FEATURES = [
  {
    title: "Sports Profile",
    desc: "A LinkedIn-style profile built for sport — skill level, sports played, and a public achievement feed.",
    icon: "M12 2l2.4 6.6L21 9l-5 4.4L17.4 21 12 17.3 6.6 21 8 13.4 3 9l6.6-.4L12 2z",
  },
  {
    title: "Smart Matching",
    desc: "A deterministic compatibility score weighs sport, skill, location and ratings before you connect.",
    icon: "M12 20l-1.5-1.4C5.4 14.4 2 11.3 2 7.6 2 4.9 4.1 3 6.7 3c1.5 0 3 .7 3.9 1.9C11.5 3.7 13 3 14.5 3 17.1 3 19.2 4.9 19.2 7.6c0 3.7-3.4 6.8-8.5 11.1L12 20z",
  },
  {
    title: "Events & Courts",
    desc: "Discover matches, practices and tournaments near you, or list your own venue to a matched crowd.",
    icon: "M4 21V9l8-6 8 6v12M9 21v-6h6v6",
  },
  {
    title: "Coaches",
    desc: "Public coaching profiles with track record — find a mentor who's actually placed students before.",
    icon: "M12 3a4 4 0 100 8 4 4 0 000-8zM4 21a8 8 0 0116 0",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Build Your Profile",
    desc: "Pick your role — Player, Coach or Organizer — and set up a sport-specific profile in under a minute.",
  },
  {
    n: "02",
    title: "Discover Your Community",
    desc: "Browse a matched pool of athletes, coaches and events, filtered by sport, skill and location.",
  },
  {
    n: "03",
    title: "Connect and Play",
    desc: "Send a play request, get accepted, and unlock chat to plan the game — or just show up to an event.",
  },
];

const SPORTS = [
  { name: "Cricket", stat: "412 active players" },
  { name: "Football", stat: "298 active players" },
  { name: "Badminton", stat: "356 active players" },
  { name: "Running", stat: "189 active players" },
  { name: "Swimming", stat: "127 active players" },
  { name: "Chess", stat: "94 active players" },
];

export default function LandingPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-volt/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-40 h-72 w-72 rounded-full bg-court/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-court">
              <span className="h-1.5 w-1.5 animate-pulseRing rounded-full bg-volt" />
              Now live across Hyderabad
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Find Your Sport.
              <br />
              <span className="text-court">Find Your People.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base text-ink/70 sm:text-lg">
              SportSphere connects Players, Coaches and Organizers on one sport-centric network —
              matched by level, not by luck.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/auth"
                className="w-full rounded-full bg-court px-7 py-3.5 text-sm font-semibold text-paper shadow-pop transition-transform hover:-translate-y-0.5 hover:bg-court-dark sm:w-auto"
              >
                Click Here to Join Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-card border border-line bg-white/60 p-6 shadow-card transition-transform hover:-translate-y-1"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-court/10 text-court">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d={f.icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="mt-4 font-display text-lg text-ink">{f.title}</p>
              <p className="mt-1.5 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-y border-line bg-court-dark py-20 text-paper">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-volt">How It Works</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Three steps from sign-up to showing up.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative pl-2">
                {i < STEPS.length - 1 && (
                  <div className="absolute left-[3.1rem] top-6 hidden h-px w-[calc(100%-2rem)] bg-paper/15 sm:block" />
                )}
                <span className="font-mono text-4xl font-bold text-paper/20">{s.n}</span>
                <p className="mt-3 font-display text-xl">{s.title}</p>
                <p className="mt-2 text-sm text-paper/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MULTI-SPORT */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-court">Every Sport, One Network</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Play what you love.</h2>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SPORTS.map((s) => (
            <Link
              href="/discover"
              key={s.name}
              className="group flex flex-col items-center justify-center rounded-card border border-line bg-white/60 px-4 py-8 text-center transition-all hover:-translate-y-1 hover:border-court hover:bg-court hover:text-paper"
            >
              <p className="font-display text-base">{s.name}</p>
              <p className="mt-1 text-[11px] text-muted group-hover:text-paper/70">{s.stat}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-card bg-ink px-8 py-14 text-center text-paper sm:px-16">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-volt/20 blur-3xl" />
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Your next game is one match away.</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-paper/70">
            Build your profile in under a minute and see who's ready to play near you.
          </p>
          <Link
            href="/auth"
            className="mt-7 inline-block rounded-full bg-volt px-8 py-3.5 text-sm font-semibold text-court-dark transition-transform hover:-translate-y-0.5"
          >
            Click Here to Join Us
          </Link>
        </div>
      </section>

      <footer className="border-t border-line px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-muted sm:flex-row">
          <p>© 2026 SportSphere. Built for players, coaches and organizers.</p>
          <div className="flex gap-6">
            <Link href="/auth" className="hover:text-court">Click Here to Join Us</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
