import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              onClick={() => scrollToSection("showcase")}
              className="text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
            >
              Showcase
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
            >
              Contact
            </button>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
            >
              Login
            </Link>
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
              onClick={() => scrollToSection("showcase")}
              className="block text-sm font-medium text-gray-900 hover:text-blue-500 text-left w-full"
            >
              Showcase
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block text-sm font-medium text-gray-900 hover:text-blue-500 text-left w-full"
            >
              Contact
            </button>
            <Link
              to="/login"
              className="block text-sm font-medium text-gray-900 hover:text-blue-500"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
