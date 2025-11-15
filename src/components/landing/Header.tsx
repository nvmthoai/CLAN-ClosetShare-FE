import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/token";
import { getUserData } from "@/lib/user";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated());
  const [displayName, setDisplayName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuthState = () => {
      const hasToken = isAuthenticated();
      setAuthenticated(hasToken);

      if (!hasToken) {
        setDisplayName(null);
        return;
      }

      const stored = getUserData<{ name?: string; email?: string; full_name?: string }>();
      setDisplayName(
        stored?.name || stored?.full_name || stored?.email || null
      );
    };

    updateAuthState();
    window.addEventListener("storage", updateAuthState);
    const interval = window.setInterval(updateAuthState, 1000);

    return () => {
      window.removeEventListener("storage", updateAuthState);
      window.clearInterval(interval);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <img src="/combine_logo.png" alt="CLOSETSHARE" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
            >
              Contact
            </button>
            {authenticated ? (
              <button
                onClick={() => navigate("/home")}
                className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
              >
                <span className="truncate max-w-[140px]">
                  {displayName || "Vào ứng dụng"}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/register"
                  className="text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-900 hover:text-blue-500"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => scrollToSection("home")}
              className="block text-sm font-medium text-gray-900 hover:text-blue-500 text-left w-full"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block text-sm font-medium text-gray-900 hover:text-blue-500 text-left w-full"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block text-sm font-medium text-gray-900 hover:text-blue-500 text-left w-full"
            >
              Contact
            </button>
            {authenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/home");
                }}
                className="block text-sm font-medium text-gray-900 text-left w-full hover:text-blue-500"
              >
                {displayName || "Vào ứng dụng"}
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/register"
                  className="block text-sm font-medium text-gray-900 hover:text-blue-500"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="block text-sm font-medium text-gray-900 hover:text-blue-500"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
