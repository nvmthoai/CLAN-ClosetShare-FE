import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shopApi } from "@/apis/shop.api";
import { getUserId } from "@/lib/user";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { ArrowLeft, Upload, Save, X } from "lucide-react";
import type { UpdateShopPayload } from "@/models/Shop";

export default function EditShop() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<UpdateShopPayload>({
    name: "",
    description: "",
    address: "",
    phone_number: "",
    email: "",
    avatar: "",
    background: "",
  });
  const [errors, setErrors] = useState<Partial<UpdateShopPayload>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch shop data (use userId from auth if available)
  const userId = getUserId();
  const {
    data: shop,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-shop", userId],
    queryFn: () => (userId ? shopApi.getByUser(userId) : shopApi.getMyShop()),
    // Extract the shop object from response.data.shop
    select: (res: any) => res.data?.shop || null,
  });

  // Update form data when shop data is loaded
  useEffect(() => {
    if (shop) {
      setFormData({
        name: shop.name || "",
        description: shop.description || "",
        address: shop.address || "",
        phone_number: shop.phone_number || "",
        email: shop.email || "",
        avatar: shop.avatar || "",
        background: shop.background || "",
      });
    }
  }, [shop]);

  const updateShopMutation = useMutation({
    mutationFn: (payload: UpdateShopPayload) => shopApi.update(payload),
    onSuccess: () => {
      toast.success("Cập nhật shop thành công!");
      queryClient.invalidateQueries({ queryKey: ["my-shop"] });
      setHasChanges(false);
    },
    onError: (error: any) => {
      toast.error("Cập nhật shop thất bại");
      console.error("Update shop error:", error);
    },
  });

  const handleInputChange = (field: keyof UpdateShopPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateShopPayload> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Tên shop là bắt buộc";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (
      formData.phone_number &&
      !/^[0-9+\-\s()]+$/.test(formData.phone_number)
    ) {
      newErrors.phone_number = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      updateShopMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (
        window.confirm("Bạn có chắc chắn muốn hủy? Các thay đổi sẽ bị mất.")
      ) {
        navigate("/profile/shops");
      }
    } else {
      navigate("/profile/shops");
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Hoạt động
          </Badge>
        );
      case "UNVERIFIED":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Chờ xác minh
          </Badge>
        );
      case "SUSPENDED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Tạm dừng
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Không xác định
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin shop...</p>
        </div>
      </div>
    );
  }

  if (isError || !shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-red-600 mb-4">Không thể tải thông tin shop</div>
          <button
            onClick={() => navigate("/profile/shops")}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-900 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Chỉnh sửa Shop
                </h1>
                <p className="text-gray-600 mt-1">
                  Cập nhật thông tin cho shop "{shop.name}"
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(shop.status)}
              {hasChanges && (
                <Badge className="text-blue-600 border-blue-200 bg-blue-50">
                  Có thay đổi
                </Badge>
              )}
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
                  className={`h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : ""
                  }`}
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
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
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
                    onChange={(e) =>
                      handleInputChange("phone_number", e.target.value)
                    }
                    placeholder="0901 234 567"
                    className={`h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.phone_number ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone_number}
                    </p>
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
                    className={`h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Current Images */}
              {(shop.avatar || shop.background) && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Hình ảnh hiện tại
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shop.avatar && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Avatar</p>
                        <img
                          src={shop.avatar}
                          alt="Current avatar"
                          className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                        />
                      </div>
                    )}
                    {shop.background && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Background</p>
                        <img
                          src={shop.background}
                          alt="Current background"
                          className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Cập nhật hình ảnh
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors bg-gray-50/50">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2 font-medium">
                      Avatar
                    </p>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm border-2 border-gray-200 rounded-xl text-gray-900 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 font-medium"
                    >
                      Chọn ảnh
                    </button>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors bg-gray-50/50">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2 font-medium">
                      Background
                    </p>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm border-2 border-gray-200 rounded-xl text-gray-900 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 font-medium"
                    >
                      Chọn ảnh
                    </button>
                  </div>
                </div>
              </div>

              {/* Shop Info */}
              <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-2">
                  Thông tin shop
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-900">ID:</span>{" "}
                    {shop.id}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      Tạo lúc:
                    </span>{" "}
                    {new Date(shop.created_at || "").toLocaleDateString(
                      "vi-VN"
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      Cập nhật:
                    </span>{" "}
                    {new Date(shop.updated_at || "").toLocaleDateString(
                      "vi-VN"
                    )}
                  </div>
                  {shop.rating && (
                    <div>
                      <span className="font-semibold text-gray-900">
                        Đánh giá:
                      </span>{" "}
                      {shop.rating}/5
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  disabled={updateShopMutation.isPending}
                >
                  <X className="w-4 h-4" />
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={updateShopMutation.isPending || !hasChanges}
                >
                  <Save className="w-4 h-4" />
                  {updateShopMutation.isPending
                    ? "Đang lưu..."
                    : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
