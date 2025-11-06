import Layout from "@/components/layout/Layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi, type UpdateMePayload } from "@/apis/user.api";
import type { User } from "@/models/User";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { User as UserIcon, Phone, Camera, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => userApi.getMe(),
    select: (res) => res.data as User,
  });

  const mutation = useMutation({
    mutationFn: (payload: UpdateMePayload) => userApi.updateMe(payload),
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công!");
      qc.invalidateQueries({ queryKey: ["me"] });
      navigate("/profile");
    },
    onError: () => toast.error("Cập nhật thất bại. Vui lòng thử lại."),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const payload: UpdateMePayload = {
      name: (form.elements.namedItem("name") as HTMLInputElement)?.value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement)?.value,
      avatarUrl: (form.elements.namedItem("avatarUrl") as HTMLInputElement)
        ?.value,
    };
    mutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-900 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa thông tin</h1>
              <p className="text-gray-600 mt-1">Cập nhật thông tin cá nhân của bạn</p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            {/* Avatar Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
              {/* Decorative blobs */}
              <span className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-blue-500/20 blur-2xl" />
              <span className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-400/20 blur-2xl" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <img
                    src={data?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-xl"
                  />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{data?.name || "Chưa có tên"}</h2>
                  <p className="text-white/80">Thành viên từ {new Date().getFullYear()}</p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <UserIcon className="w-4 h-4 text-blue-500" />
                    Họ và tên
                  </label>
                  <Input
                    name="name"
                    defaultValue={data?.name || ""}
                    placeholder="Nhập họ và tên của bạn"
                    className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Phone className="w-4 h-4 text-blue-500" />
                    Số điện thoại
                  </label>
                  <Input
                    name="phone"
                    defaultValue={data?.phone || ""}
                    placeholder="Nhập số điện thoại của bạn"
                    className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                </div>

                {/* Avatar URL Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Camera className="w-4 h-4 text-blue-500" />
                    URL ảnh đại diện
                  </label>
                  <Input
                    name="avatarUrl"
                    defaultValue={data?.avatarUrl || ""}
                    placeholder="Nhập URL ảnh đại diện"
                    className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                  <p className="text-xs text-gray-500">
                    Bạn có thể sử dụng link ảnh từ internet hoặc tải lên từ máy tính
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="px-6 py-2.5 text-sm font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-blue-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-200 flex items-center gap-2"
                  >
                    {mutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang lưu...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Lưu thay đổi
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-6 bg-gradient-to-br from-blue-50/50 to-white rounded-xl p-4 border-2 border-blue-100">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-blue-500">💡</span>
              Mẹo nhỏ
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Sử dụng ảnh đại diện chất lượng cao để tạo ấn tượng tốt</li>
              <li>• Thông tin cá nhân sẽ được hiển thị công khai trên hồ sơ của bạn</li>
              <li>• Bạn có thể thay đổi thông tin bất cứ lúc nào</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
