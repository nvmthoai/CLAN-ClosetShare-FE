import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { shopApi } from "@/apis/shop.api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { ArrowLeft, Upload, Store } from "lucide-react";
import type { CreateShopPayload } from "@/models/Shop";

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
      createShopMutation.mutate(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/profile/shops")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo Shop Mới</h1>
          <p className="text-gray-600 mt-1">
            Tạo shop để bắt đầu bán hàng trên ClosetShare
          </p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shop Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên shop <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Nhập tên shop của bạn"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả shop
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Mô tả ngắn về shop của bạn..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <Input
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Nhập địa chỉ shop"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <Input
                value={formData.phone_number}
                onChange={(e) => handleInputChange("phone_number", e.target.value)}
                placeholder="0901 234 567"
                className={errors.phone_number ? "border-red-500" : ""}
              />
              {errors.phone_number && (
                <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="shop@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Image Upload Placeholder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh shop
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Tải lên hình ảnh cho shop</p>
              <p className="text-sm text-gray-500">
                Hỗ trợ JPG, PNG. Tối đa 5MB
              </p>
              <Button type="button" variant="outline" className="mt-4">
                Chọn ảnh
              </Button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Store className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Lưu ý quan trọng
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Shop sẽ được xem xét và xác minh trước khi hoạt động</li>
                  <li>• Thông tin liên hệ sẽ được hiển thị công khai</li>
                  <li>• Bạn có thể chỉnh sửa thông tin sau khi tạo</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/profile/shops")}
              className="flex-1"
              disabled={createShopMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createShopMutation.isPending || !formData.name.trim()}
            >
              {createShopMutation.isPending ? "Đang tạo..." : "Tạo Shop"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
