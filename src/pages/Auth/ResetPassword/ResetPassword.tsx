import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/apis/auth.api";
import { toast } from "react-toastify";
import type { ResetPasswordRequest } from "@/models/Auth";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Đặt lại mật khẩu</h1>
        <p className="text-sm text-gray-600 mb-6">Nhập mật khẩu mới cho tài khoản của bạn.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">Nhập lại mật khẩu</label>
            <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? "Đang lưu..." : "Đặt lại mật khẩu"}
          </Button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
