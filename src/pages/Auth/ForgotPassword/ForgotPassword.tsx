import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/apis/auth.api";
import { toast } from "react-toastify";
import type { ForgotPasswordRequest } from "@/models/Auth";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: () => {
      toast.success("Đã gửi hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra email");
    },
    onError: (err) => {
      const anyErr = err as unknown as { response?: { data?: { message?: string } } };
      toast.error(anyErr?.response?.data?.message || "Không thể gửi email");
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.warn("Vui lòng nhập email");
    mutation.mutate({ email });
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
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">Quên mật khẩu</h1>
        <p className="text-sm text-gray-600 mb-8 text-center">
          Nhập email để nhận hướng dẫn đặt lại mật khẩu.
        </p>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Nhập địa chỉ email của bạn"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={mutation.isPending} 
            className="w-full bg-gray-900 text-white hover:bg-blue-500 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-blue-200"
          >
            {mutation.isPending ? "Đang gửi..." : "Gửi email"}
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

export default ForgotPassword;
