// src/pages/Login.jsx (hoặc Login.js)
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "@/styles/phoneinput-fix.css"; // file fix dropdown ở dưới

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-blue-500 to-pink-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full flex login-form-container">
        {/* Left Side - Fashion Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-l-3xl rounded-tr-3xl relative p-8 flex-col justify-between ">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">👗</span>
              </div>
              <span className="text-xl font-bold">ClosetShare</span>
            </div>
          </div>
          {/* Fashion Illustration Area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              {/* Fashion Model Placeholder */}
              <div className="w-64 h-64 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full flex items-center justify-center">
                <div className="text-6xl">👚</div>
              </div>
              {/* Floating Fashion Elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
                💄
              </div>
              <div
                className="absolute -bottom-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-bounce"
                style={{ animationDelay: "1s" }}
              >
                👠
              </div>
              <div
                className="absolute top-1/2 -right-8 w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center text-xl animate-bounce"
                style={{ animationDelay: "2s" }}
              >
                💍
              </div>
            </div>
          </div>
          <div className="text-white text-center">
            <p className="text-sm opacity-80">
              © 2025 ClosetShare. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side - Login/Register Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            {/* Welcome Message */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-gray-600 text-sm">
                {isSignUp
                  ? "Join the fashion community and start sharing your style"
                  : "Sign in to continue to your fashion journey"}
              </p>
            </div>

            {/* Tab Switches */}
            <div className="flex mb-8">
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-3 text-center font-semibold transition-all duration-200 border-b-2 ${
                  isSignUp
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-3 text-center font-semibold transition-all duration-200 border-b-2 ${
                  !isSignUp
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Form */}
            <div className="min-h-[320px]">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Phone Number - Only show on Sign Up */}
                <div
                  className={`transition-all duration-300 ${
                    isSignUp
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-4 h-0 overflow-hidden"
                  }`}
                >
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneInput
                      country={"vn"}
                      value={phone}
                      onChange={setPhone}
                      enableSearch={true}
                      placeholder="Enter your phone number"
                      dropdownStyle={{
                        position: "absolute",
                        top: "-200px", // Hiển thị dropdown lên trên thay vì xuống dưới
                        left: "0",
                        right: "0",
                        zIndex: 999999,
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        maxHeight: "180px",
                        overflowY: "auto",
                        boxShadow: "0 -10px 25px rgba(0,0,0,0.15)", // Shadow hướng lên
                        marginTop: "0",
                      }}
                      inputStyle={{
                        width: "100%",
                        height: "48px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: "14px",
                        paddingLeft: "48px",
                        background: "#F6F8FB",
                      }}
                      buttonStyle={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px 0 0 12px",
                        backgroundColor: "#f9fafb",
                      }}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
              </form>
            </div>

            {!isSignUp && (
              <div className="text-center mt-4">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  I Have An Account ?
                </a>
              </div>
            )}

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-center gap-4">
                {["📧", "📱", "🔗", "📞", "🌐"].map((icon, idx) => (
                  <button
                    key={idx}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <span className="text-gray-600">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500 space-x-4">
              <span>🔒 SSL-SHA</span>
              <span>📧 info@closetshare.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
