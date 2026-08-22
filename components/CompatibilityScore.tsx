import { CompatibilityResult } from "@/types";

interface Props {
  result: CompatibilityResult;
  size?: "sm" | "lg";
}

export default function CompatibilityScore({ result, size = "sm" }: Props) {
  const { score, reasons, summary } = result;
  const circumference = 2 * Math.PI * 26;
  const offset = circumference - (score / 100) * circumference;

  if (size === "sm") {
    return (
      <div className="flex items-center gap-2">
        <div className="relative flex h-11 w-11 items-center justify-center">
          <svg viewBox="0 0 60 60" className="h-11 w-11 -rotate-90">
            <circle cx="30" cy="30" r="26" fill="none" stroke="#E4E2D8" strokeWidth="5" />
            <circle
              cx="30"
              cy="30"
              r="26"
              fill="none"
              stroke="#D6FF4A"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="absolute font-mono text-[11px] font-bold text-court-dark">{score}</span>
        </div>
        <span className="text-xs font-medium text-muted">Compatible</span>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line bg-ink p-6 text-paper">
      <div className="flex items-center gap-5">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
          <svg viewBox="0 0 60 60" className="h-24 w-24 -rotate-90">
            <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(246,247,241,0.15)" strokeWidth="5" />
            <circle
              cx="30"
              cy="30"
              r="26"
              fill="none"
              stroke="#D6FF4A"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="animate-tick"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-mono text-2xl font-bold leading-none text-volt">{score}</span>
            <span className="font-mono text-[10px] tracking-widest text-paper/50">/ 100</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-volt">
            SportSphere Smart Compatibility Score
          </p>
          <p className="mt-1 text-sm text-paper/80">{summary}</p>
        </div>
      </div>
      <ul className="mt-5 grid grid-cols-1 gap-2 border-t border-paper/10 pt-4 sm:grid-cols-2">
        {reasons.map((reason, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-paper/70">
            <span className="h-1.5 w-1.5 rounded-full bg-volt" />
            {reason}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] text-paper/40">
        Deterministic rule-based scoring — not a trained ML model.
      </p>
    </div>
  );
}
