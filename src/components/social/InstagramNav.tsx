import { NavLink } from "react-router-dom";
import { Home, Search, PlusSquare, Heart, User, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export function InstagramNav() {
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    // { to: "/search", icon: Search, label: "Search" },
    { to: "/create", icon: PlusSquare, label: "Create" },
    { to: "/activity", icon: Heart, label: "Activity" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Camera className="w-8 h-8 text-gradient bg-gradient-to-r from-purple-600 to-pink-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              ClosetShare
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs mx-8">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "p-2 rounded-full transition hover:bg-gray-100",
                    isActive && "text-purple-600"
                  )
                }
              >
                <item.icon className="w-6 h-6" />
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 p-2 transition",
                  isActive ? "text-purple-600" : "text-gray-600"
                )
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
