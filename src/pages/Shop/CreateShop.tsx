import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { shopApi } from "@/apis/shop.api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { ArrowLeft, Store } from "lucide-react";
import type { CreateShopPayload } from "@/models/Shop";
import { getAccessToken } from "@/lib/token";

export default function CreateShop() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateShopPayload>({
    name: "",
    description: "",
    address: "",
    phone_number: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<CreateShopPayload>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  const createShopMutation = useMutation({
    mutationFn: (payload: CreateShopPayload) => shopApi.create(payload),
    onSuccess: (_response) => {
      toast.success("Tạo shop thành công! Đang chờ xác minh.");
      navigate("/profile/shops");
    },
    onError: (error: any) => {
      toast.error("Tạo shop thất bại");
      console.error("Create shop error:", error);
    },
  });

  const handleInputChange = (field: keyof CreateShopPayload, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateShopPayload> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên shop là bắt buộc";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (formData.phone_number && !/^[0-9+\-\s()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // If user uploaded files, send multipart/form-data to match backend expectations
      if (avatarFile || backgroundFile) {
        const fd = new FormData();
        fd.append("name", formData.name);
        if (formData.description) fd.append("description", formData.description);
        if (formData.address) fd.append("address", formData.address);
        if (formData.phone_number) fd.append("phone_number", formData.phone_number);
        if (formData.email) fd.append("email", formData.email);
        if (avatarFile) fd.append("avatar", avatarFile);
        if (backgroundFile) fd.append("background", backgroundFile);

        // Send via fetch so browser sets correct multipart boundary
        const token = getAccessToken();
        fetch("/api/shops", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: fd,
        })
          .then(async (res) => {
            if (!res.ok) throw new Error(`Create shop failed: ${res.status}`);
            const data = await res.json().catch(() => null);
            toast.success("Tạo shop thành công! Đang chờ xác minh.");
            navigate("/profile/shops");
          })
          .catch((err) => {
            console.error("Create shop (form-data) error:", err);
            toast.error("Tạo shop thất bại");
          });
      } else {
        createShopMutation.mutate(formData);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/profile/shops")}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-900 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tạo Shop Mới</h1>
              <p className="text-gray-600 mt-1">
                Tạo shop để bắt đầu bán hàng trên ClosetShare
              </p>
            </div>
          </div>

          <Card className="p-6 border-2 border-gray-100 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shop Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tên shop <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nhập tên shop của bạn"
                  className={`h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mô tả shop
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Mô tả ngắn về shop của bạn..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Địa chỉ
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Nhập địa chỉ shop"
                  className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Số điện thoại
                  </label>
                  <Input
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange("phone_number", e.target.value)}
                    placeholder="0901 234 567"
                    className={`h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${errors.phone_number ? "border-red-500" : ""}`}
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="shop@example.com"
                    className={`h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Image Uploads: avatar and background (multipart/form-data) */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Hình ảnh shop (avatar & background)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50/50">
                    <p className="text-sm font-medium text-gray-700 mb-2">Avatar (logo)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                      className="mx-auto"
                    />
                    {avatarFile && <p className="text-xs text-gray-500 mt-2">{avatarFile.name}</p>}
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50/50">
                    <p className="text-sm font-medium text-gray-700 mb-2">Background (banner)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBackgroundFile(e.target.files?.[0] ?? null)}
                      className="mx-auto"
                    />
                    {backgroundFile && <p className="text-xs text-gray-500 mt-2">{backgroundFile.name}</p>}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Hỗ trợ JPG, PNG. Tối đa 5MB mỗi ảnh.</p>
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-xl p-4 border-2 border-blue-100">
                <div className="flex items-start gap-3">
                  <Store className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">
                      Lưu ý quan trọng
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Shop sẽ được xem xét và xác minh trước khi hoạt động</li>
                      <li>• Thông tin liên hệ sẽ được hiển thị công khai</li>
                      <li>• Bạn có thể chỉnh sửa thông tin sau khi tạo</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/profile/shops")}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  disabled={createShopMutation.isPending}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={createShopMutation.isPending || !formData.name.trim()}
                >
                  {createShopMutation.isPending ? "Đang tạo..." : "Tạo Shop"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
