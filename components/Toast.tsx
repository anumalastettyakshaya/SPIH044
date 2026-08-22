"use client";

import { useApp } from "@/context/AppContext";

export default function Toast() {
  const { toast, clearToast } = useApp();
  if (!toast) return null;
  return (
    <div className="fixed bottom-5 left-1/2 z-[80] w-[min(92vw,420px)] -translate-x-1/2 animate-rise">
      <div className="flex items-center justify-between gap-3 rounded-full border border-volt bg-ink px-5 py-3 text-sm font-medium text-paper shadow-pop">
        <span>{toast}</span>
        <button onClick={clearToast} className="text-paper/50 hover:text-paper" aria-label="Dismiss">
          ×
        </button>
      </div>
    </div>
  );
}
