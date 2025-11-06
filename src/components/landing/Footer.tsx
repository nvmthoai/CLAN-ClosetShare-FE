import { Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo/Text */}
          <div className="mb-4 md:mb-0">
          <h3

              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <img src="/logocs.png" alt="CLOSETSHARE" className="h-8 w-auto" />
              <span className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
                CLOSETSHARE
              </span>
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Creative showcase and portfolio platform
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-500 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-500 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-500 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © 2025 YourBrand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
