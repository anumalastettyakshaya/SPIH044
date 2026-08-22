"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { initialsFromName } from "@/utils/user";
import { navLinksForRole } from "@/utils/roles";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { profile, isAuthenticated, logout, sessionUsername } = useApp();

  const publicChrome = pathname === "/" || pathname === "/auth";
  const links = isAuthenticated && profile ? navLinksForRole(profile.role) : [];

  const isActive = (href: string) => {
    const path = href.split("?")[0];
    if (path === "/home") return pathname === "/home";
    if (path === "/profile") return pathname === "/profile";
    if (path === "/events") return pathname === "/events";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/auth");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link
          href={isAuthenticated && profile ? "/home" : "/"}
          className="flex items-center gap-2 font-display text-xl tracking-tight text-ink"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-court text-volt">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
          Sport<span className="text-court">Sphere</span>
        </Link>

        {/* Public Header CTA */}
        {publicChrome ? (
          <Link
            href="/auth"
            className="rounded-full bg-court px-5 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-court-dark"
          >
            Click Here to Join Us
          </Link>
        ) : (
          /* Authenticated Role-Based Navbar */
          <>
            <nav className="hidden items-center gap-1.5 lg:flex">
              {links.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-court/10 font-bold text-court"
                      : "text-ink/75 hover:bg-black/5 hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              {profile && (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-full border border-line bg-white/80 py-1 pl-1 pr-3.5 shadow-sm transition-colors hover:border-court"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-court text-[10px] font-bold text-volt">
                    {initialsFromName(profile.name || profile.username)}
                  </span>
                  <div className="text-left">
                    <p className="max-w-[100px] truncate text-xs font-bold text-ink leading-tight">
                      {profile.name || profile.username}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-court font-semibold">
                      {profile.role}
                    </p>
                  </div>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-whistle hover:bg-whistle/10 hover:border-whistle"
              >
                Logout
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              aria-label="Toggle menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              <div className="space-y-1.5">
                <span className={`block h-0.5 w-5 bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`block h-0.5 w-5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-5 bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
              </div>
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {open && !publicChrome && (
        <div className="border-t border-line bg-paper px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-1.5">
            {links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
                  isActive(link.href) ? "bg-court/10 font-bold text-court" : "text-ink/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="mt-2 w-full rounded-xl border border-whistle/20 bg-whistle/10 px-4 py-2.5 text-left text-sm font-semibold text-whistle"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
