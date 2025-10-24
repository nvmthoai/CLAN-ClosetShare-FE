import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "@/styles/phoneinput-fix.css";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/apis/auth.api";
import { toast } from "react-toastify";
import type { RegisterRequest } from "@/models/Auth";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      toast.success("Đăng ký thành công. Vui lòng đăng nhập");
      navigate("/login");
    },
    onError: (err) => {
      const anyErr = err as unknown as { response?: { data?: { message?: string } } };
      const msg = anyErr?.response?.data?.message || "Đăng ký thất bại";
      toast.error(msg);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !phone) {
      toast.warn("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    registerMutation.mutate({
      email,
      password,
      name,
      phone_number: phone.startsWith("+") ? phone : `+${phone}`,
    });
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
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center text-2xl animate-bounce">💄</div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-bounce" style={{ animationDelay: "1s" }}>👠</div>
              <div className="absolute top-1/2 -right-8 w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center text-xl animate-bounce" style={{ animationDelay: "2s" }}>💍</div>
            </div>
          </div>
          <div className="text-white text-center">
            <p className="text-sm opacity-80">© 2025 ClosetShare. All rights reserved.</p>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Tạo tài khoản</h2>
                <p className="text-gray-600 text-sm">Tham gia cộng đồng thời trang và bắt đầu chia sẻ phong cách của bạn</p>
              </div>

            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập họ và tên" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập địa chỉ email" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu" className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <PhoneInput
                    country={"vn"}
                    value={phone}
                    onChange={setPhone}
                    enableSearch
                    placeholder="Nhập số điện thoại"
                    dropdownStyle={{
                      position: "absolute",
                      top: "-200px",
                      left: "0",
                      right: "0",
                      zIndex: 999999,
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      maxHeight: "180px",
                      overflowY: "auto",
                      boxShadow: "0 -10px 25px rgba(0,0,0,0.15)",
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

              <Button type="submit" disabled={registerMutation.isPending} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
            </form>

            <div className="text-center mt-4 text-sm">
              <span className="text-gray-600">Đã có tài khoản?</span>{" "}
              <Link to="/login" className="text-blue-600 hover:underline">Đăng nhập</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
