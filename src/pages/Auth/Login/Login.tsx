import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/apis/auth.api";
import { toast } from "react-toastify";
import type { LoginRequest } from "@/models/Auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { extractTokens } from "@/lib/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => {
      const { access_token, refresh_token } = extractTokens(res)
      if (access_token) {
        localStorage.setItem('access_token', access_token)
      }
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token)
      }
      toast.success("Đăng nhập thành công");
      navigate(from, { replace: true });
    },
    onError: (err) => {
      const anyErr = err as unknown as {
        response?: { data?: { message?: string } };
      };
      const msg = anyErr?.response?.data?.message || "Đăng nhập thất bại";
      toast.error(msg);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password)
      return toast.warn("Vui lòng nhập email và mật khẩu");
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-blue-500 to-pink-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full flex login-form-container">
        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-l-3xl rounded-tr-3xl relative p-8 flex-col justify-between ">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">👗</span>
              </div>
              <span className="text-xl font-bold">ClosetShare</span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <div className="w-64 h-64 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full flex items-center justify-center">
                <div className="text-6xl">👚</div>
              </div>
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

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-sm">
                Sign in to continue to your fashion journey
              </p>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center mt-4 space-x-2 text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </Link>
              <span className="text-gray-400">•</span>
              <Link to="/register" className="text-blue-600 hover:underline">
                Tạo tài khoản
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
