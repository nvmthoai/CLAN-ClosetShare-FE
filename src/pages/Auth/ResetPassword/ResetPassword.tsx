import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/apis/auth.api";
import { toast } from "react-toastify";
import type { ResetPasswordRequest } from "@/models/Auth";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || ""; // nếu backend gửi token qua query

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập");
      navigate("/login");
    },
    onError: (err) => {
      const anyErr = err as unknown as { response?: { data?: { message?: string } } };
      toast.error(anyErr?.response?.data?.message || "Không thể đặt lại mật khẩu");
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirm) return toast.warn("Vui lòng nhập đủ thông tin");
    if (password !== confirm) return toast.warn("Mật khẩu nhập lại không khớp");
    if (!token) return toast.warn("Thiếu token");
    mutation.mutate({ token, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-blue-300/20 rounded-full blur-3xl"></div>
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src="/logocs.png" alt="CLOSETSHARE" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-gray-900 uppercase">CLOSETSHARE</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">Đặt lại mật khẩu</h1>
        <p className="text-sm text-gray-600 mb-8 text-center">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
              Mật khẩu mới
            </label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-500 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-900 mb-2">
              Nhập lại mật khẩu
            </label>
            <div className="relative">
              <Input 
                id="confirm" 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirm} 
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-500 transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={mutation.isPending} 
            className="w-full bg-gray-900 text-white hover:bg-blue-500 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-blue-200"
          >
            {mutation.isPending ? "Đang lưu..." : "Đặt lại mật khẩu"}
          </Button>
        </form>
        
        <div className="text-center mt-6">
          <Link 
            to="/login" 
            className="text-sm text-gray-900 hover:text-blue-500 transition-colors font-medium"
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
