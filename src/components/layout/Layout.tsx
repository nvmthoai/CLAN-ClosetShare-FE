import { Link, NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export default function Layout({ children, sidebar }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/create", label: "Create" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-purple-600 text-white px-3 py-1 rounded"
      >
        Skip to content
      </a>
      <header className="h-16 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-full gap-6">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-md border text-gray-600 hover:bg-gray-100"
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-lg tracking-tight"
            >
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm shadow">
                👗
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                ClosetShare
              </span>
            </Link>
          </div>

            <nav className="hidden md:flex gap-6 text-sm">
              {navItems.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    cn(
                      "relative font-medium text-gray-600 hover:text-purple-600 transition",
                      isActive &&
                        "text-purple-600 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-purple-600 after:to-pink-600"
                    )
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <input
                placeholder="Search items"
                className="w-64 text-sm border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70"
              />
            </div>
            <button className="relative text-sm p-2 rounded-full hover:bg-purple-50">
              🔔
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] leading-none px-1 rounded">
                9+
              </span>
            </button>
            <button className="text-sm p-2 rounded-full hover:bg-purple-50">🛍️</button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur px-4 py-4 space-y-3 animate-in slide-in-from-top">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "block text-sm font-medium px-2 py-1 rounded hover:bg-purple-50",
                    isActive && "text-purple-600"
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>
      <main
        id="main"
        className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex gap-6"
      >
        {sidebar && (
          <aside className="w-60 shrink-0 hidden lg:block self-start sticky top-24">
            {sidebar}
          </aside>
        )}
        <div className="flex-1 min-w-0">{children}</div>
      </main>
      <footer className="border-t py-6 mt-auto text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ClosetShare. All rights reserved.
      </footer>
    </div>
  );
}
