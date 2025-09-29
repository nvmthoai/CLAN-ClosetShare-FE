import { Link, NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/apis/user.api";
import {
  Home,
  Search,
  PlusSquare,
  Heart,
  Menu,
  X,
  ShoppingBag,
  Camera,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export default function Layout({ children, sidebar }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const hasToken = Boolean(localStorage.getItem("access_token"));
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: () => userApi.getMe(),
    select: (res) =>
      res.data as { name?: string; email?: string; avatarUrl?: string },
    staleTime: 60_000,
    enabled: hasToken, // Only fetch if we have a token
    retry: false, // Don't retry on failure to prevent multiple 401s
  });

  const navItems = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/shop", icon: ShoppingBag, label: "Shop" },
    { to: "/create", icon: PlusSquare, label: "Create" },
    { to: "/activity", icon: Heart, label: "Activity" },
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
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <Link
              to="/home"
              className="flex items-center gap-2 font-bold text-lg tracking-tight"
            >
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm shadow">
                <Camera className="w-4 h-4" />
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
                    "relative font-medium text-gray-600 hover:text-purple-600 transition flex items-center gap-2",
                    isActive &&
                      "text-purple-600 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-purple-600 after:to-pink-600"
                  )
                }
              >
                <n.icon className="w-4 h-4" />
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4 relative">
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
            <div className="relative">
              <button
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-purple-50"
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <img
                  src={
                    me?.avatarUrl ||
                    (me?.name || me?.email
                      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          me?.name || me?.email || "U"
                        )}`
                      : "https://ui-avatars.com/api/?name=U")
                  }
                  alt={me?.name || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden sm:block text-sm font-medium max-w-[140px] truncate">
                  {me?.name || me?.email || "User"}
                </span>
                <span className="text-xs">▾</span>
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-lg z-50"
                >
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    View profile
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile/edit");
                    }}
                  >
                    Update info
                  </button>
                </div>
              )}
            </div>
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
                    "flex items-center gap-3 text-sm font-medium px-2 py-1 rounded hover:bg-purple-50",
                    isActive && "text-purple-600"
                  )
                }
              >
                <n.icon className="w-4 h-4" />
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
