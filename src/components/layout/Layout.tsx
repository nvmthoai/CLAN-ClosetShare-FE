import { Link, NavLink } from "react-router-dom";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export default function Layout({ children, sidebar }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b bg-white/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-full gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm">
              👗
            </span>
            ClosetShare
          </Link>
          <nav className="hidden md:flex gap-6 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-purple-600 font-semibold"
                  : "text-gray-600 hover:text-purple-600"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive
                  ? "text-purple-600 font-semibold"
                  : "text-gray-600 hover:text-purple-600"
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/create"
              className={({ isActive }) =>
                isActive
                  ? "text-purple-600 font-semibold"
                  : "text-gray-600 hover:text-purple-600"
              }
            >
              Create
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "text-purple-600 font-semibold"
                  : "text-gray-600 hover:text-purple-600"
              }
            >
              Profile
            </NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <input
              placeholder="Search for anything"
              className="hidden md:block w-64 text-sm border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="relative text-sm">
              🔔
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] leading-none px-1 rounded">
                9+
              </span>
            </button>
            <button className="text-sm">🛍️</button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 flex gap-6">
        {sidebar && (
          <aside className="w-56 shrink-0 hidden lg:block">{sidebar}</aside>
        )}
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
