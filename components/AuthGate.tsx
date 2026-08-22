"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

const PUBLIC = new Set(["/", "/auth"]);

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { hydrated, isAuthenticated, profile } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    const isPublic = PUBLIC.has(pathname);

    // If not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublic) {
      router.replace("/auth");
      return;
    }

    // If authenticated and on /auth or /onboarding, route to home or events
    if (isAuthenticated && profile && (pathname === "/auth" || pathname === "/onboarding")) {
      if (profile.role === "organizer") {
        router.replace("/events");
      } else {
        router.replace("/home");
      }
    }
  }, [hydrated, isAuthenticated, profile, pathname, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm font-semibold text-muted">
        Loading SportSphere…
      </div>
    );
  }

  return <>{children}</>;
}
