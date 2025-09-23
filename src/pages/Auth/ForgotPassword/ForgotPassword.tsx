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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Quên mật khẩu</h1>
        <p className="text-sm text-gray-600 mb-6">Nhập email để nhận hướng dẫn đặt lại mật khẩu.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? "Đang gửi..." : "Gửi email"}
          </Button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
