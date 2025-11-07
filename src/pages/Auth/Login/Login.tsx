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
import { setUserData } from "@/lib/user";
import { setTokens } from "@/lib/token";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: Location })?.from?.pathname || "/home";

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => {
      console.log("Login success response:", res);
      console.log(
        "Response data structure:",
        JSON.stringify(res.data, null, 2)
      );
      const { access_token, refresh_token } = extractTokens(res);
      console.log("Extracted tokens:", {
        hasAccessToken: !!access_token,
        hasRefreshToken: !!refresh_token,
        accessTokenLength: access_token?.length,
      });
      
      // Save tokens using centralized token manager
      if (access_token) {
        setTokens(access_token, refresh_token);
        console.log("Tokens saved successfully");
      } else {
        console.error("No access token found in response");
        toast.error("Đăng nhập thất bại: Không nhận được token");
        return;
      }
      
      // Lưu user data nếu có trong response
      if (res.data?.user || res.data?.data?.user) {
        const userData = res.data?.user || res.data?.data?.user;
        setUserData(userData);
        console.log("User data saved:", userData);
      }
      
      toast.success("Đăng nhập thành công");
      console.log("Navigating to:", from);
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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-blue-300/20 rounded-full blur-3xl"></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full flex login-form-container border-2 border-blue-100">
        {/* Left Side */}
        <div 
          className="hidden md:flex md:w-1/2 rounded-l-2xl relative p-8 flex-col justify-between overflow-hidden"
          style={{
            backgroundImage: 'url(/logocs.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Dark overlay with blue tint for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-blue-900/30 to-black/40"></div>
          
          <div className="relative z-10 flex-1 flex items-center justify-center">
            <div className="text-center">
            </div>
          </div>
          
          <div className="relative z-10 text-white text-center">
            <p className="text-sm opacity-80">
              © 2025 ClosetShare. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-2">
                Đăng nhập
              </h2>
              <p className="text-gray-600 text-sm">
                Đăng nhập để tiếp tục khám phá thời trang
              </p>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  <span className="text-blue-600">Email</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  <span className="text-blue-600">Mật khẩu</span>
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-500 transition-colors"
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
                className="w-full bg-gray-900 text-white hover:bg-blue-500 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-blue-200"
              >
                {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>

            <div className="text-center mt-6 space-x-2 text-sm">
              <Link
                to="/forgot-password"
                className="text-gray-900 hover:text-blue-500 transition-colors"
              >
                Quên mật khẩu?
              </Link>
              <span className="text-gray-400">•</span>
              <Link 
                to="/register" 
                className="text-gray-900 hover:text-blue-500 transition-colors"
              >
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
