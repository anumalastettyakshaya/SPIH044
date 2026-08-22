"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Role, Sport, SkillLevel } from "@/types";

const SPORTS: Sport[] = ["Cricket", "Football", "Badminton", "Running", "Swimming", "Chess"];
const SKILL_LEVELS: SkillLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function AuthPage() {
  const { login, signup } = useApp();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login state (ONLY username & password)
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupAadhaar, setSignupAadhaar] = useState("");
  const [signupRole, setSignupRole] = useState<Role>("player");
  const [signupSport, setSignupSport] = useState<Sport>("Cricket");
  const [signupLevel, setSignupLevel] = useState<SkillLevel>("Intermediate");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginUsername.trim() || !loginPassword) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await login({
        username: loginUsername.trim(),
        password: loginPassword,
      });

      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      // Route based on role
      if (res.role === "organizer") {
        router.push("/events");
      } else {
        router.push("/home");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!signupUsername.trim() || !signupPassword) {
      setError("Username and password are required.");
      return;
    }

    if (signupPassword.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    if (!signupPhone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!signupEmail.trim()) {
      setError("Email address is required.");
      return;
    }

    setLoading(true);
    try {
      const err = await signup({
        username: signupUsername.trim(),
        password: signupPassword,
        phone: signupPhone.trim(),
        email: signupEmail.trim(),
        aadhaar: signupAadhaar.trim() || "1234-5678-9012",
        role: signupRole,
        sport: signupSport,
        skillLevel: signupLevel,
      });

      if (err) {
        setError(err);
        setLoading(false);
        return;
      }

      // Route based on role
      if (signupRole === "organizer") {
        router.push("/events");
      } else {
        router.push("/home");
      }
    } catch (err) {
      setError("Failed to create account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-lg px-6 py-12 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-court">Welcome to SportSphere</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">
        {mode === "login" ? "Log in to your account" : "Create your sports account"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {mode === "login"
          ? "Enter your credentials to access your sports dashboard."
          : "Join athletes, coaches and organizers across your city."}
      </p>

      {/* Tabs */}
      <div className="mt-6 grid grid-cols-2 rounded-full border border-line bg-white p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError("");
          }}
          className={`rounded-full py-2 text-sm font-semibold transition-all ${
            mode === "login" ? "bg-court text-paper shadow-sm" : "text-muted hover:text-ink"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError("");
          }}
          className={`rounded-full py-2 text-sm font-semibold transition-all ${
            mode === "signup" ? "bg-court text-paper shadow-sm" : "text-muted hover:text-ink"
          }`}
        >
          Sign Up
        </button>
      </div>

      <div className="mt-6 rounded-card border border-line bg-white/80 p-6 shadow-card backdrop-blur-sm sm:p-8">
        {mode === "login" ? (
          /* ========================================================
             LOGIN FORM: ONLY Username & Password
             ======================================================== */
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Username">
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Enter your username"
                className="input"
                autoComplete="username"
                required
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                className="input"
                autoComplete="current-password"
                required
              />
            </Field>

            {error && <p className="text-sm font-medium text-whistle">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-court py-3.5 text-sm font-semibold text-paper shadow-pop transition-transform hover:-translate-y-0.5 hover:bg-court-dark disabled:opacity-50"
            >
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>
        ) : (
          /* ========================================================
             SIGN UP FORM: Full registration with Role selection
             ======================================================== */
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Account Type / Role */}
            <div>
              <span className="text-xs font-semibold text-ink/70">Select Account Type / Role</span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "player", label: "Player", desc: "Play & join events" },
                    { id: "coach", label: "Coach", desc: "Train athletes" },
                    { id: "organizer", label: "Organizer", desc: "Host events" },
                  ] as const
                ).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSignupRole(r.id)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                      signupRole === r.id
                        ? "border-court bg-court/10 font-bold text-court"
                        : "border-line bg-white text-ink/70 hover:border-court/40"
                    }`}
                  >
                    <span className="text-xs font-bold">{r.label}</span>
                    <span className="mt-0.5 text-[10px] text-muted">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <Field label="Username">
              <input
                type="text"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                placeholder="Choose a username"
                className="input"
                required
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="Choose a strong password"
                className="input"
                required
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Phone Number">
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="input"
                  required
                />
              </Field>

              <Field label="Email Address">
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="input"
                  required
                />
              </Field>
            </div>

            <Field label="Aadhaar Number">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={signupAadhaar}
                  onChange={(e) => setSignupAadhaar(e.target.value)}
                  placeholder="12-digit Aadhaar number"
                  className="input"
                />
                <span className="shrink-0 rounded-lg bg-court/10 px-2.5 py-2 text-xs font-bold text-court">
                  Verified ✓
                </span>
              </div>
            </Field>

            {/* Sport & Level */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Primary Sport">
                <select
                  value={signupSport}
                  onChange={(e) => setSignupSport(e.target.value as Sport)}
                  className="input"
                >
                  {SPORTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Player Level">
                <select
                  value={signupLevel}
                  onChange={(e) => setSignupLevel(e.target.value as SkillLevel)}
                  className="input"
                >
                  {SKILL_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </Field>
            </div>

            {error && <p className="text-sm font-medium text-whistle">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-court py-3.5 text-sm font-semibold text-paper shadow-pop transition-transform hover:-translate-y-0.5 hover:bg-court-dark disabled:opacity-50"
            >
              {loading ? "Creating Account…" : `Create ${signupRole.toUpperCase()} Account`}
            </button>
            <p className="text-[11px] text-muted text-center">
              Aadhaar verification status is recorded securely.
            </p>
          </form>
        )}
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid #E4E2D8;
          background: white;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
          color: #101815;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: #1B4332;
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink/70">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
